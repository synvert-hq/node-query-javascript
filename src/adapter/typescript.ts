import Adapter from "../adapter";
import { Node, SyntaxKind } from "typescript";

/**
 * Typescript Adapter
 * @extends Adapter
 */
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

  getNamedValue(_key: string, value: number): string | undefined {
    // Convert numeric SyntaxKind values to their string names
    // This allows queries like .PrefixUnaryExpression[operator=MinusToken]
    const name = SyntaxKind[value];
    // Only return if it's a valid SyntaxKind name (not just the number as string)
    if (name && isNaN(Number(name))) {
      return name;
    }
    return undefined;
  }
}

export default TypescriptAdapter;
