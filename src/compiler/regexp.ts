import debug from "debug";
import Value from "./value";

class Regexp<T> extends Value<T> {
  constructor(private value: string) {
    super();
  }

  match(node: T, operator: string): boolean {
    const actual = this.actualValue(node);
    const expected = new RegExp(this.expectedValue());
    debug("node-query:attribute")(`${actual} ${operator} ${expected}`);
    if (operator === "!~") {
      return !expected.test(actual);
    } else {
      return expected.test(actual);
    }
  }

  expectedValue(): string {
    return this.value;
  }

  toString(): string {
    return `/${this.value}/`;
  }
}

export default Regexp;