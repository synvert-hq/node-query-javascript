import debug from "debug";

import type { Node } from "./types";
import { toString } from "../helper";

// Value is an atom value,
// it can be a Boolean, Null, Number, Undefined, String or Identifier.
abstract class Value<T> {
  // check if the actual value matches the expected value.
  match(node: Node<T>, baseNode: T, operator: string): boolean {
    debug("node-query:value")(`"${this.actualValue(node)}" ${operator} "${this.expectedValue(baseNode)}"`);
    const result = this.matchString(node, baseNode, operator);
    debug("node-query:value")(`result: ${result}`);
    return result;
  }

  // actual value can be a string or the source code of a typescript node.
  actualValue(node: any): string {
    return toString(node);
  }

  abstract expectedValue(baseNode: T): string;

  private matchString(
    actualNode: Node<T>,
    baseNode: T,
    operator: string
  ): boolean {
    const actual = this.actualValue(actualNode);
    const expected = this.expectedValue(baseNode);
    switch (operator) {
      case "includes":
        return Array.isArray(actualNode)
          ? actualNode.some((actualItem) => this.match(actualItem, baseNode, "=="))
          : actual == expected;
      case "^=":
        return actual.startsWith(expected);
      case "$=":
        return actual.endsWith(expected);
      case "*=":
        return actual.includes(expected);
      case "!=":
        return actual !== expected;
      case ">=":
        return actual >= expected;
      case ">":
        return actual > expected;
      case "<=":
        return actual <= expected;
      case "<":
        return actual < expected;
      default:
        return actual === expected;
    }
  }
}

export default Value;
