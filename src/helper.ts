import debug from "debug";
import type { Node } from "./compiler/types";
import Adapter from "./adapter";

export function getTargetNode<T>(node: T, keys: string, adapter: Adapter<T>): T | T[] | undefined {
  let target = node as any;
  if (!target) return;

  const [firstKey, ...restKeys] = keys.split(".");
  if (Array.isArray(target) && firstKey === "*") {
    return target.map((t) => getTargetNode(t, restKeys.join("."), adapter));
  }

  if (Array.isArray(target) && !Number.isNaN(Number.parseInt(firstKey))) {
    target = target.at(Number.parseInt(firstKey));
  } else if (target.hasOwnProperty(firstKey)) {
    target = target[firstKey];
  } else if (typeof target[firstKey] === "function") {
    target = target[firstKey].call(target);
  } else if (firstKey === "nodeType") {
    target = adapter.getNodeType(target);
  } else {
    debug("node-query:get-target-node")(
      `${adapter.getNodeType(target)} ${firstKey} not found`
    );
    target = null;
  }
  if (restKeys.length === 0) {
    return target;
  }
  return getTargetNode<T>(target, restKeys.join("."), adapter);
}

export function handleRecursiveChild<T>(
  node: T,
  adapter: Adapter<T>,
  handler: (childNode: T) => { stop: boolean } | void
): { stop: boolean } {
  let result;
  for (let childNode of adapter.getChildren(node)) {
    result = handler(childNode);
    if (result && result.stop) {
      break;
    }
    result = handleRecursiveChild(childNode, adapter, handler);
    if (result && result.stop) {
      break;
    }
  }
  if (result) {
    return result;
  }
  return { stop: false };
}

export function isNode<T>(node: Node<T>): boolean {
  if (node === null) {
    return false;
  }
  if (["string", "number", "boolean", "undefined"].includes(typeof node)) {
    return false;
  }
  return true;
}

export function evaluateNodeValue<T>(node: T, str: string, adapter: Adapter<T>): string {
  for (let matchData of str.matchAll(/{{(.+?)}}/g)) {
    const targetNode = getTargetNode(node, matchData[1], adapter);
    str = str.replace(matchData[0], toString(targetNode, adapter));
  }
  return str;
}

export function toString<T>(node: Node<T> | Node<T>[], adapter: Adapter<T>): string {
  if (Array.isArray(node)) {
    return `(${node.map((n) => toString(n, adapter)).join(", ")})`;
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
      return adapter.getSource(node);
  }
}
