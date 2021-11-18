import { Graph, Node, NodeConectionSchema, NodeTypeSchema, ViewerState } from "./node";
export declare const initGraph: () => Graph;
export declare const addNodeType: (graph: Graph) => (schema: NodeTypeSchema) => {
    nodeSchema: NodeTypeSchema[];
    graphSchema: import("./node").GraphSchema;
    nodes: Node[];
    adjacencyList: Record<string, string[]>;
};
export declare const updateNodeType: (graph: Graph) => (schema: NodeTypeSchema) => {
    nodeSchema: NodeTypeSchema[];
    graphSchema: import("./node").GraphSchema;
    nodes: Node[];
    adjacencyList: Record<string, string[]>;
};
export declare const removeNodeType: (graph: Graph) => (schema: NodeTypeSchema) => {
    nodeSchema: NodeTypeSchema[];
    graphSchema: import("./node").GraphSchema;
    nodes: Node[];
    adjacencyList: Record<string, string[]>;
};
export declare const addConnectionType: (graph: Graph) => (connection: NodeConectionSchema) => {
    graphSchema: {
        connections: NodeConectionSchema[];
    };
    nodeSchema: NodeTypeSchema[];
    nodes: Node[];
    adjacencyList: Record<string, string[]>;
};
export declare const removeConnectionType: (graph: Graph) => (connection: NodeConectionSchema) => {
    graphSchema: {
        connections: NodeConectionSchema[];
    };
    nodeSchema: NodeTypeSchema[];
    nodes: Node[];
    adjacencyList: Record<string, string[]>;
};
export declare const addConnection: (graph: Graph) => (connection: NodeConectionSchema) => {
    adjacencyList: {
        [x: string]: string[];
    };
    nodeSchema: NodeTypeSchema[];
    graphSchema: import("./node").GraphSchema;
    nodes: Node[];
};
export declare const removeConnection: (graph: Graph) => (connection: NodeConectionSchema) => {
    adjacencyList: Record<string, string[]>;
    nodeSchema: NodeTypeSchema[];
    graphSchema: import("./node").GraphSchema;
    nodes: Node[];
};
export declare const createNode: (node: Omit<Node, "id">) => Node;
export declare const addNode: (graph: Graph) => (node: Node) => {
    nodes: Node[];
    nodeSchema: NodeTypeSchema[];
    graphSchema: import("./node").GraphSchema;
    adjacencyList: Record<string, string[]>;
};
export declare const graphBuilder: (_graph?: Graph | undefined) => {
    build: () => Graph;
    addNode: (node: Node) => any;
    addConnection: (connection: NodeConectionSchema) => any;
    removeConnection: (connection: NodeConectionSchema) => any;
    addConnectionType: (connectionType: NodeConectionSchema) => any;
    removeConnectionType: (connectionType: NodeConectionSchema) => any;
    addNodeType: (nodeType: NodeTypeSchema) => any;
    updateNodeType: (nodeType: NodeTypeSchema) => any;
    removeNodeType: (nodeType: NodeTypeSchema) => any;
};
export declare type GraphBuilder = ReturnType<typeof graphBuilder>;
export declare const getVisibleNodes: (graph: Graph) => (revealed: string[]) => string[];
export declare const getVisibleChildren: (graph: Graph, visible: string[]) => (id: string) => Node[];
export declare const queryType: (nodes: Node[], type: string) => Node[];
export declare const revealNodes: (viewerState: ViewerState) => (ids: string[]) => {
    revealed: string[];
};
export declare const hideNodes: (viewerState: ViewerState) => (ids: string[]) => {
    revealed: string[];
};
export declare const getNodeById: (nodes: Node[]) => (id: string) => Node;
export declare const graphViewer: (graph: Graph, viewerState?: {
    revealed: string[];
} | undefined) => {
    revealNodes: (ids: string[]) => any;
    hideNodes: (ids: string[]) => any;
    getTypes: () => {
        type: string;
        fields: {
            name: string;
            type: string;
        }[];
    }[];
    getConnectionTypes: string[][];
    getChildren: (id: string) => Node[];
    getChildrenByType: (id: string, type: string) => Node[];
    getNodes: () => Node[];
    getByType: (type: string) => Node[];
    getNodeById: (id: string) => Node;
    getVNodeById: (id: string) => Node;
    state: () => ViewerState;
};
export declare type GraphViewer = ReturnType<typeof graphViewer>;
