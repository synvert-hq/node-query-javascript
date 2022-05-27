import Adapter from "../adapter";
import NodeQuery from "../index";
import { PrimitiveTypes } from "./types";

export function getAdapter<T>(): Adapter<T> {
  return NodeQuery.getAdapter();
}

export function getTargetNode<T>(node: T, keys: string): T | PrimitiveTypes {
  let target = node as any;
  keys.split(".").forEach((key) => {
    if (!target) return;

    if (target.hasOwnProperty(key)) {
      target = target[key];
    } else if (typeof target[key] === "function") {
      target = target[key].call(target);
    } else {
      target = null;
    }
  });
  return target;
}

export function isNode<T>(node: T | PrimitiveTypes): boolean {
  if (node === null) {
    return false;
  }
  if (["string", "number", "boolean", "undefined"].includes(typeof node)) {
    return false;
  }
  return true;
}

export function toString<T>(node: T | PrimitiveTypes): string {
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
