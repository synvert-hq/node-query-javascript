import debug from "debug";

import { type PrimitiveTypes } from "./types";
import { toSource } from "./helpers";

// Value is an atom value,
// it can be a Boolean, Null, Number, Undefined, String or Identifier.
abstract class Value<T> {
  // check if the actual value matches the expected value.
  match(node: T | PrimitiveTypes, operator: string): boolean {
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
  actualValue(node: T | PrimitiveTypes): string {
    return toSource<T>(node);
  }

  abstract expectedValue(): string;
}

export default Value;
