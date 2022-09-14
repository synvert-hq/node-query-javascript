import debug from "debug";
import Adapter from "./adapter";
import NodeQuery from "./node-query";
import type { Node } from "./compiler/types";

export function getAdapter<T>(): Adapter<T> {
  return NodeQuery<T>.getAdapter();
}

export function getTargetNode<T>(node: T, keys: string): Node<T> | Node<T>[] {
  let target = node as any;
  if (!target) return;

  const [firstKey, ...restKeys] = keys.split(".");
  if (Array.isArray(target) && firstKey === "*") {
    return target.map((t) => getTargetNode(t, restKeys.join(".")));
  }

  if (target.hasOwnProperty(firstKey)) {
    target = target[firstKey];
  } else if (typeof target[firstKey] === "function") {
    target = target[firstKey].call(target);
  } else if (firstKey === "nodeType") {
    target = getAdapter<T>().getNodeType(target);
  } else {
    debug("node-query:get-target-node")(
      `${getAdapter<T>().getNodeType(target)} ${firstKey} not found`
    );
    target = null;
  }
  if (restKeys.length === 0) {
    return target;
  }
  return getTargetNode<T>(target, restKeys.join("."));
}

export function handleRecursiveChild<T>(
  node: T,
  handler: (childNode: T) => void
): void {
  getAdapter<T>()
    .getChildren(node)
    .forEach((childNode: T) => {
      handler(childNode);
      handleRecursiveChild(childNode, handler);
    });
}

export function isNode<T>(node: Node<T> | Node<T>[]): boolean {
  if (Array.isArray(node)) {
    return node.every((n) => isNode(n));
  }

  if (node === null) {
    return false;
  }
  if (["string", "number", "boolean", "undefined"].includes(typeof node)) {
    return false;
  }
  return true;
}

export function evaluateNodeValue<T>(node: T, str: string): string {
  for (let matchData of str.matchAll(/{{(.*?)}}/g)) {
    const targetNode = getTargetNode(node, matchData[1]);
    str = str.replace(matchData[0], toString(targetNode));
  }
  return str;
}

export function toString<T>(node: Node<T> | Node<T>[]): string {
  if (Array.isArray(node)) {
    return `(${node.map((n) => toString(n)).join(", ")})`;
  }

  if (node === null) {
    return "null";
  }
  switch (typeof node) {
    case "undefined":
      return "undefined";
    case "string":
    case "number":
    case "boolean":
      return node.toString();
    default:
      return getAdapter<T>().getSource(node);
  }
}
