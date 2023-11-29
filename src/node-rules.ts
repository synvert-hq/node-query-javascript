import flatten from "flat";
import { t } from "typy";
import {
  getTargetNode,
  handleRecursiveChild,
  evaluateNodeValue,
  toString,
} from "./helper";
import { QueryOptions } from "./compiler/types";
import Adapter from "./adapter";

const KEYWORDS = [
  "notIncludes",
  "includes",
  "not",
  "in",
  "notIn",
  "gt",
  "gte",
  "lt",
  "lte",
];

class NodeRules<T> {
  private adapter: Adapter<T>;

  constructor(private rules: object, { adapter }: { adapter: Adapter<T> }) {
    this.adapter = adapter;
  }

  queryNodes(node: T, options: QueryOptions = {}): T[] {
    options = Object.assign(
      { includingSelf: true, stopAtFirstMatch: false, recursive: true },
      options
    );
    if (options.includingSelf && !options.recursive) {
      return this.matchNode(node) ? [node] : [];
    }

    const matchingNodes: T[] = [];
    if (options.includingSelf && this.matchNode(node)) {
      matchingNodes.push(node);
      if (options.stopAtFirstMatch) {
        return matchingNodes;
      }
    }
    if (options.recursive) {
      handleRecursiveChild(node, this.adapter, (childNode) => {
        if (this.matchNode(childNode, childNode)) {
          matchingNodes.push(childNode);
          if (options.stopAtFirstMatch) {
            return { stop: true };
          }
        }
      });
    } else {
      this.adapter
        .getChildren(node)
        .forEach((childNode) => {
          if (this.matchNode(childNode, childNode)) {
            matchingNodes.push(childNode);
            if (options.stopAtFirstMatch) {
              return { stop: true };
            }
          }
        });
    }
    return matchingNodes;
  }

  matchNode(node: T, baseNode: T | undefined = undefined): boolean {
    return Object.keys(flatten(this.rules, { safe: true })).every(
      (multiKey) => {
        const keys = multiKey.split(".");
        const lastKey = keys[keys.length - 1];
        const actual = KEYWORDS.includes(lastKey)
          ? getTargetNode(node, keys.slice(0, -1).join("."), this.adapter)
          : getTargetNode(node, multiKey, this.adapter);
        let expected = t(this.rules, multiKey).safeObject;
        if (typeof expected === "string") {
          expected = evaluateNodeValue(baseNode, expected, this.adapter);
        }
        if (Array.isArray(actual) && Array.isArray(expected)) {
          return (
            actual.length === expected.length &&
            expected.every((expectedItem, index) =>
              this.matchValue(actual[index], expectedItem)
            )
          );
        }
        switch (lastKey) {
          case "includes":
            if (Array.isArray(actual)) {
              return actual.some((actualItem: any) =>
                this.matchValue(actualItem, expected)
              );
            } else {
              return this.matchValue(actual, expected);
            }
          case "notIncludes":
            if (Array.isArray(actual)) {
              return actual.every(
                (actualItem: any) => !this.matchValue(actualItem, expected)
              );
            } else {
              return !this.matchValue(actual, expected);
            }
          case "not":
            return !this.matchValue(actual, expected);
          case "in":
            return expected.some((expectedItem: any) =>
              this.matchValue(actual, expectedItem)
            );
          case "notIn":
            return expected.every(
              (expectedItem: any) => !this.matchValue(actual, expectedItem)
            );
          case "gt":
            return (actual as any) > expected;
          case "gte":
            return (actual as any) >= expected;
          case "lt":
            return (actual as any) < expected;
          case "lte":
            return (actual as any) <= expected;
          default:
            return this.matchValue(actual, expected);
        }
      }
    );
  }

  matchValue(actual: any, expected: any): boolean {
    if (actual === expected) return true;
    if (!actual && expected) return false;
    if (expected === null) return actual === null;
    if (typeof expected === "undefined") return typeof actual === "undefined";
    if (expected instanceof RegExp) {
      if (typeof actual === "string") return expected.test(actual);
      if (typeof actual === "number") return expected.test(actual.toString());
      return expected.test(this.adapter.getSource(actual));
    }
    if (Array.isArray(actual) && typeof expected === "string") {
      return expected === toString(actual, this.adapter);
    }
    if (typeof actual === "object") {
      // actual is a node
      const source = this.adapter.getSource(actual);
      return expected.toString() === source || `"${expected}"` === source;
    }
    return false;
  }
}

export default NodeRules;
