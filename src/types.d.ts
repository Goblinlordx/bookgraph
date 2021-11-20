export type Node = {
  id: string;
  type: string;
  data: any;
};

export type NodeTypeSchema = {
  type: string;

  fields: NodeFieldSchema[];
};

export type NodeFieldSchema = {
  name: string;
  type: string;
};

export type NodeConectionSchema = [string, string];

export type GraphSchema = {
  connections: NodeConectionSchema[];
};

export type Graph = {
  nodeSchema: NodeTypeSchema[];
  graphSchema: GraphSchema;
  nodes: Node[];
  adjacencyList: Record<string, string[]>;
};

export type ViewerState = {
  revealed: string[];
};

export type GraphBuilder = {
  build(): Graph;
  addNode(n: Node): GraphBuilder;
  removeNode(id: string): GraphBuilder;
  addConnection(c: NodeConectionSchema): GraphBuilder;
  removeConnection(c: NodeConectionSchema): GraphBuilder;
  addConnectionType(c: NodeConectionSchema): GraphBuilder;
  removeConnectionType(c: NodeConectionSchema): GraphBuilder;
  addNodeType(t: NodeTypeSchema): GraphBuilder
  updateNodeType(t: NodeTypeSchema): GraphBuilder
  removeNodeType(t: string): GraphBuilder
}

export type GraphViewer = {
  revealNodes(ids: string[]): GraphViewer;
  hideNodes(ids: string[]): GraphViewer;
  getTypes(): NodeTypeSchema[];
  getConnectionTypes(): string[][];
  getChildren(id: string): Node[];
  getChildrenByType(id: string, type: string): Node[];
  getNodes(): Node[];
  getVNodes(): Node[];
  getByType(type: string): Node[];
  getNodeById(id: string): Node;
  getVNodeById(id: string): Node;
  state(): ViewerState;
}
