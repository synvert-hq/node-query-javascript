import debug from "debug";
import Adapter from "../adapter";
import Value from "./value";

class Identifier<T> extends Value<T> {
  constructor(
    private value: string,
    adapter: Adapter<T>,
  ) {
    super(adapter);
  }

  match(node: T, baseNode: T, operator: string): boolean {
    const actual = this.actualValue(node);
    const expected = this.expectedValue(baseNode);

    debug("node-query:identifier")(
      `"${actual}" ${operator} "${expected}"`,
    );

    // If actual is a numeric string, try to convert it to a named value
    const actualNum = Number(actual);
    if (!isNaN(actualNum) && this.adapter.getNamedValue) {
      const namedValue = this.adapter.getNamedValue("", actualNum);
      if (namedValue) {
        debug("node-query:identifier")(`converted "${actual}" to "${namedValue}"`);
        // Compare using the named value
        const result = this.compare(namedValue, expected, operator);
        debug("node-query:identifier")(`result: ${result}`);
        return result;
      }
    }

    const result = this.compare(actual, expected, operator);
    debug("node-query:identifier")(`result: ${result}`);
    return result;
  }

  private compare(actual: string, expected: string, operator: string): boolean {
    switch (operator) {
      case "!=":
        return actual !== expected;
      case "^=":
        return actual.startsWith(expected);
      case "$=":
        return actual.endsWith(expected);
      case "*=":
        return actual.includes(expected);
      default:
        return actual === expected;
    }
  }

  // expected value returns the value.
  expectedValue(_baseNode: T): string {
    return this.value;
  }

  toString(): string {
    return this.value;
  }
}

export default Identifier;
