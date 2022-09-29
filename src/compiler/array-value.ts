import debug from "debug";

import type { Node } from "./types";
import Value from "./value";

interface ArrayValueParameters<T> {
  value?: Value<T>;
  rest?: ArrayValue<T>;
}

// ArrayValue is an array of Value.
class ArrayValue<T> {
  private value?: Value<T>;
  private rest?: ArrayValue<T>;

  constructor({ value, rest }: ArrayValueParameters<T>) {
    this.value = value;
    this.rest = rest;
  }

  // check if the actual value matches the expected value.
  match(node: Node<T> | Node<T>[], baseNode: T, operator: string): boolean {
    const expected = this.expectedValue();
    const result = this.matchArray(expected, node, baseNode, operator);
    debug("node-query:array-value")(`${operator} ${expected} ${result}`);
    return result;
  }

  // expected value is an array of Value.
  expectedValue(): Value<T>[] {
    let expected: Value<T>[] = [];
    if (this.value) {
      expected.push(this.value);
    }
    if (this.rest) {
      expected = expected.concat(this.rest.expectedValue());
    }
    return expected;
  }

  toString(): string {
    if (this.rest) {
      return `${this.value} ${this.rest}`;
    }
    if (this.value) {
      return this.value.toString();
    }
    return "";
  }

  private matchArray(
    expected: Value<T>[],
    node: Node<T> | Node<T>[],
    baseNode: T,
    operator: string
  ): boolean {
    switch (operator) {
      case "not_in":
        return Array.isArray(node)
          ? node.every((n) =>
              expected.every((expectedValue) => expectedValue.match(n, baseNode, "!="))
            )
          : expected.every((expectedValue) => expectedValue.match(node, baseNode, "!="));
      case "in":
        return Array.isArray(node)
          ? node.every((n) =>
              expected.some((expectedValue) => expectedValue.match(n, baseNode, "=="))
            )
          : expected.some((expectedValue) => expectedValue.match(node, baseNode, "=="));
      case "!=":
        return Array.isArray(node) && this.compareNotEqual(node, expected, baseNode);
      default:
        return Array.isArray(node) && this.compareEqual(node, expected, baseNode);
    }
  }

  private compareNotEqual(actual: Node<T>[], expected: Value<T>[], baseNode: T) {
    if (expected.length !== actual.length) {
      return true;
    }

    for (let index = 0; index < actual.length; index++) {
      if (expected[index].match(actual[index], baseNode, "!=")) {
        return true;
      }
    }

    return false;
  }

  private compareEqual(actual: Node<T>[], expected: Value<T>[], baseNode: T) {
    if (expected.length !== actual.length) {
      return false;
    }

    for (let index = 0; index < actual.length; index++) {
      if (!expected[index].match(actual[index], baseNode, "==")) {
        return false;
      }
    }

    return true;
  }
}

export default ArrayValue;
