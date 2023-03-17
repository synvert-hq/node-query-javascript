import Adapter from "../adapter";
import { Node, SyntaxKind } from "typescript";

class TypescriptAdapter implements Adapter<Node> {
  getNodeType(node: Node): string {
    return SyntaxKind[node.kind];
  }

  getSource(node: Node): string {
    // typescript getText() may contain trailing whitespaces and newlines.
    return node.getText().trimEnd();
  }

  getChildren(node: Node): Node[] {
    const children: Node[] = [];
    node.forEachChild((childNode) => {
      children.push(childNode);
    });
    return children;
  }

  getSiblings(node: Node): Node[] {
    const siblings: Node[] = [];
    let matched = false;
    node.parent.forEachChild((childNode) => {
      if (matched) {
        siblings.push(childNode);
      }
      if (childNode === node) {
        matched = true;
      }
    });
    return siblings;
  }
}

export default TypescriptAdapter;
