import debug from "debug";

import type { Node } from "./types";
import { toString } from "./helpers";

// Value is an atom value,
// it can be a Boolean, Null, Number, Undefined, String or Identifier.
abstract class Value<T> {
  // check if the actual value matches the expected value.
  match(node: Node<T>, operator: string): boolean {
    const actual = this.actualValue(node);
    const expected = this.expectedValue();
    debug("node-query:attribute")(`${actual} ${operator} ${expected}`);
    switch (operator) {
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

  // actual value can be a string or the source code of a typescript node.
  actualValue(node: Node<T>): string {
    return toString(node);
  }

  abstract expectedValue(): string;
}

export default Value;
