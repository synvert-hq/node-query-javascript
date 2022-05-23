interface Adapter<T> {
  getNodeType(node: T): string;
  getSource(node: T): string;
  getChildren(node: T): T[];
  getSiblings(node: T): T[];
}

export default Adapter;
