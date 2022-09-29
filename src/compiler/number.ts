import debug from "debug";

import Value from "./value";

class Number<T> extends Value<T> {
  constructor(private value: number) {
    super();
  }

  match(node: T, baseNode: T, operator: string): boolean {
    const actual = this.actualValue(node);
    const expected = this.expectedValue(baseNode);
    const result = this.matchNumber(actual, expected, operator);
    debug("node-query:attribute")(
      `${actual} ${operator} ${expected} ${result}`
    );
    return result;
  }

  // expected value returns a number.
  expectedValue(_baseNode: T): string {
    return this.value.toString();
  }

  toString(): string {
    return this.value.toString();
  }

  private matchNumber(
    actual: string,
    expected: string,
    operator: string
  ): boolean {
    switch (operator) {
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

export default Number;
