import fs from "fs";
import { KEYS } from "eslint-visitor-keys";
import Adapter from "./adapter";

import type { Node } from "acorn";

/**
 * Implement node-query-typescript adapter
 * @see https://github.com/xinminlabs/node-query-typescript/blob/main/src/adapter.ts
 */
class EspreeAdapter implements Adapter<Node> {
  // get node type
  getNodeType(node: Node): string {
    return node.type;
  }

  // get node source
  getSource(node: Node): string {
    const source = fs.readFileSync(node.loc!.source!, "utf-8");
    return source.slice(node.start, node.end);
  }

  // get node children
  getChildren(node: Node): Node[] {
    const children: Node[] = [];
    KEYS[node.type].forEach((key) => {
      const childNode = (node as any)[key];
      if (Array.isArray(childNode)) {
        childNode.forEach((child) => {
          if (child) {
            children.push(child);
          }
        });
      } else {
        if (childNode) {
          children.push(childNode);
        }
      }
    });
    return children;
  }

  // Espree doesn't support siblings.
  getSiblings(_node: Node): Node[] {
    return [];
  }
}

export default EspreeAdapter;
