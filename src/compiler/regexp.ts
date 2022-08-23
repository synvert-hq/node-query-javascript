import debug from "debug";
import Value from "./value";

class Regexp<T> extends Value<T> {
  constructor(private value: string) {
    super();
  }

  match(node: T, operator: string): boolean {
    const actual = this.actualValue(node);
    const expected = new RegExp(this.expectedValue());
    const result = this.matchRegExp(actual, expected, operator);
    debug("node-query:attribute")(`${actual} ${operator} ${expected} ${result}`);
    return result;
  }

  expectedValue(): string {
    return this.value;
  }

  toString(): string {
    return `/${this.value}/`;
  }

  private matchRegExp(actual: string, expected: RegExp, operator: string): boolean {
    if (operator === "!~") {
      return !expected.test(actual);
    } else {
      return expected.test(actual);
    }
  }
}

export default Regexp;
