import { Node } from 'typescript';

interface Adapter {
  getNodeType(node: Node): string;
  getSource(node: Node): string;
  getChildren(node: Node): Node[];
  getSiblings(node: Node): Node[];
}

export default Adapter;