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

export { GraphError } from "./error";
