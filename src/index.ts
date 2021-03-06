import { GraphError } from "./error";

import type {
  Graph,
  Node,
  NodeConectionSchema,
  NodeTypeSchema,
  ViewerState,
  GraphBuilder,
  GraphViewer,
} from "./types";

const compose = <A, B>(f: (a: A) => B) => {
  return {
    f: <C>(g: (b: B) => C) => compose((x: A) => g(f(x))),
    out: () => f,
  };
};

export const initGraph = (): Graph => {
  return {
    nodeSchema: [],
    graphSchema: { connections: [] },
    nodes: [],
    adjacencyList: {},
  };
};

export const addNodeType = (graph: Graph) => (schema: NodeTypeSchema) => {
  const { type: newType } = schema;
  const exists = graph.nodeSchema.some((t) => t.type === newType);
  if (exists) throw new GraphError("Type of same name already exists");

  return {
    ...graph,
    nodeSchema: graph.nodeSchema.concat(schema),
  };
};

export const updateNodeType = (graph: Graph) => (schema: NodeTypeSchema) => {
  const { type: newType } = schema;
  const exists = graph.nodeSchema.some((t) => t.type === newType);
  if (!exists) throw new GraphError("Type does not exist");

  return {
    ...graph,
    nodeSchema: graph.nodeSchema.map((t) => (t.type === newType ? schema : t)),
  };
};

export const removeNodeType = (graph: Graph) => (type: string) => {
  const exists = graph.nodeSchema.some((t) => t.type === type);
  if (!exists) throw new GraphError("Type does not exist");

  return {
    ...graph,
    nodeSchema: graph.nodeSchema.filter((t) => t.type !== type),
  };
};

export const addConnectionType =
  (graph: Graph) => (connection: NodeConectionSchema) => {
    const validTypes = new Set(graph.nodeSchema.map((t) => t.type));
    if (!connection.every((t) => validTypes.has(t)))
      throw new GraphError("Type does not exist");
    if (
      graph.graphSchema.connections.some(
        (c) => c[0] === connection[0] && c[1] === connection[1]
      )
    )
      throw new GraphError("Connection type already exists");

    return {
      ...graph,
      graphSchema: {
        ...graph.graphSchema,
        connections: [...graph.graphSchema.connections, connection],
      },
    };
  };

export const removeConnectionType =
  (graph: Graph) => (connection: NodeConectionSchema) => {
    return {
      ...graph,
      graphSchema: {
        ...graph.graphSchema,
        connections: graph.graphSchema.connections.filter(
          (c) => c[0] !== connection[0] && c[1] !== connection[1]
        ),
      },
    };
  };

export const addConnection =
  (graph: Graph) => (connection: NodeConectionSchema) => {
    const existingIds = new Set(graph.nodes.map((n) => n.id));
    const valid = connection.every((id) => existingIds.has(id));
    if (!valid) throw new GraphError(`ID does not exist`);

    const conIds = new Set(connection);
    const conTypes = graph.nodes
      .filter((n) => conIds.has(n.id))
      .map((n) => n.type);
    const validType = graph.graphSchema.connections.some(
      ([l, r]) => l === conTypes[0] && r === conTypes[1]
    );
    if (!validType)
      throw new GraphError(`invalid connection type: ${conTypes.join(" -> ")}`);

    const list = graph.adjacencyList[connection[0]]?.slice() || [];
    if (list.indexOf(connection[0]) === -1) list.push(connection[1]);

    const adjacencyList = {
      ...graph.adjacencyList,
      [connection[0]]: list,
    };

    return {
      ...graph,
      adjacencyList,
    };
  };

export const removeConnection =
  (graph: Graph) => (connection: NodeConectionSchema) => {
    const existingIds = new Set(graph.nodes.map((n) => n.id));

    const valid = connection.every((id) => existingIds.has(id));
    if (!valid) throw new GraphError(`ID does not exist`);

    const adjacencyList = Object.entries(graph.adjacencyList).reduce<
      Record<string, string[]>
    >((a, [k, v]) => {
      if (k === connection[0]) a[k] = v.filter((id) => id !== connection[1]);
      else a[k] = [...v];

      return a;
    }, {});

    return {
      ...graph,
      adjacencyList,
    };
  };

export const createNode = (node: Omit<Node, "id">): Node => {
  return {
    id: Math.floor(Math.random() * 36 ** 6).toString(36),
    ...node,
  };
};

export const addNode = (graph: Graph) => (node: Node) => {
  const existingIds = new Set(graph.nodes.map((n) => n.id));
  if (existingIds.has(node.id)) throw new GraphError("Id already exists");

  const existingTypes = new Set(graph.nodeSchema.map((t) => t.type));
  if (!existingTypes.has(node.type)) throw new GraphError("invalid type");

  return {
    ...graph,
    nodes: graph.nodes.concat(node),
  };
};

export const removeNode =
  (graph: Graph) =>
  (id: string): Graph => {
    const adjacencyList = Object.entries(graph.adjacencyList).reduce<
      Record<string, string[]>
    >((a, [k, v]) => {
      if (k === id) return a;
      a[k] = v.filter((vId) => vId !== id);

      return a;
    }, {});

    return {
      ...graph,
      adjacencyList,
      nodes: graph.nodes.filter((n) => n.id !== id),
    };
  };

export const graphBuilder = (graph = initGraph()): GraphBuilder => ({
  build: () => graph,
  addNode: compose(addNode(graph)).f(graphBuilder).out(),
  removeNode: compose(removeNode(graph)).f(graphBuilder).out(),
  addConnection: compose(addConnection(graph)).f(graphBuilder).out(),
  removeConnection: compose(removeConnection(graph)).f(graphBuilder).out(),
  addConnectionType: compose(addConnectionType(graph)).f(graphBuilder).out(),
  removeConnectionType: compose(removeConnectionType(graph))
    .f(graphBuilder)
    .out(),
  addNodeType: compose(addNodeType(graph)).f(graphBuilder).out(),
  updateNodeType: compose(updateNodeType(graph)).f(graphBuilder).out(),
  removeNodeType: compose(removeNodeType(graph)).f(graphBuilder).out(),
});

export const getVisibleNodes = (graph: Graph) => (revealed: string[]) => {
  const visible = new Set(revealed);

  revealed.forEach((id) => {
    const children = graph.adjacencyList[id];
    if (!children) return;

    children.forEach((cId) => visible.add(cId));
  });

  return [...visible];
};

export const getVisibleChildren =
  (graph: Graph, visible: string[]) => (id: string) => {
    const vSet = new Set(visible);
    const vChildren = new Set(
      (graph.adjacencyList[id] || []).filter((cId) => vSet.has(cId))
    );
    return graph.nodes.filter((n) => vChildren.has(n.id));
  };

export const queryType = (nodes: Node[], type: string) =>
  nodes.filter((n) => n.type === type);

export const revealNodes = (viewerState: ViewerState) => (ids: string[]) => {
  const rSet = new Set(viewerState.revealed);
  ids.forEach((x) => rSet.add(x));

  return { revealed: [...rSet] };
};

export const hideNodes = (viewerState: ViewerState) => (ids: string[]) => {
  const rSet = new Set(viewerState.revealed);
  ids.forEach((x) => rSet.delete(x));

  return { revealed: [...rSet] };
};

export const getNodeById = (nodes: Node[]) => {
  const nodeMap = nodes.reduce<Record<string, Node>>((a, n) => {
    a[n.id] = n;
    return a;
  }, {});

  return (id: string) => nodeMap[id];
};

export const graphViewer =
  (graph: Graph) =>
  (viewerState?: { revealed: string[] }): GraphViewer => {
    const getVN = getVisibleNodes(graph);
    const internalState: ViewerState = {
      revealed: [...(viewerState?.revealed || [])],
    };
    const visibleNodeIds = getVN(internalState.revealed);
    const vSet = new Set(visibleNodeIds);
    const vNodes = graph.nodes.filter((n) => vSet.has(n.id));
    const getVC = getVisibleChildren(graph, visibleNodeIds);
    return {
      revealNodes: compose(revealNodes(internalState))
        .f(graphViewer(graph))
        .out(),
      hideNodes: compose(hideNodes(internalState)).f(graphViewer(graph)).out(),
      getTypes: () =>
        graph.nodeSchema.map((s) => ({
          type: s.type,
          fields: s.fields.map((f) => ({ ...f })),
        })),
      getConnectionTypes: () =>
        graph.graphSchema.connections.map((c) => c.slice()),
      getChildren: getVC,
      getChildrenByType: (id: string, type: string) =>
        queryType(getVC(id), type),
      getNodes: () => [...graph.nodes],
      getVNodes: () => [...vNodes],
      getByType: (type: string) => queryType(vNodes, type),
      getNodeById: getNodeById(graph.nodes),
      getVNodeById: getNodeById(vNodes),
      state: () => internalState,
    };
  };

export * from "./error";
export * from "./types.d";
