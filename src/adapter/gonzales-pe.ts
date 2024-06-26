import type { Node } from "@synvert-hq/gonzales-pe";
import Adapter from "../adapter";

/**
 * GonzelesPe Adapter
 * @extends Adapter
 */
class GonzalesPeAdapter implements Adapter<Node> {
  getNodeType(node: Node): string {
    return node.type;
  }

  getSource(node: Node): string {
    return node.toString();
  }

  getChildren(node: Node): Node[] {
    return Array.isArray(node.content) ? node.content : [];
  }

  // Gonzales doesn't support siblings.
  getSiblings(_node: Node): Node[] {
    return [];
  }
}

export default GonzalesPeAdapter;
