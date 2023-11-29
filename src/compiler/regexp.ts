import debug from "debug";
import Value from "./value";
import Adapter from "../adapter";

class Regexp<T> extends Value<T> {
  constructor(
    private value: string,
    adapter: Adapter<T>,
  ) {
    super(adapter);
  }

  match(node: T, baseNode: T, operator: string): boolean {
    const actual = this.actualValue(node);
    const expected = new RegExp(this.expectedValue(baseNode));
    debug("node-query:regexp")(`${actual} ${operator} ${expected}`);
    const result = this.matchRegExp(actual, expected, operator);
    debug("node-query:regexp")(`result: ${result}`);
    return result;
  }

  expectedValue(_baseNode: T): string {
    return this.value;
  }

  toString(): string {
    return `/${this.value}/`;
  }

  private matchRegExp(
    actual: string,
    expected: RegExp,
    operator: string,
  ): boolean {
    if (operator === "!~") {
      return !expected.test(actual);
    } else {
      return expected.test(actual);
    }
  }
}

export default Regexp;
