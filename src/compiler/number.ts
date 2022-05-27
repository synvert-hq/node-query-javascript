import Value from "./value";

class Number<T> extends Value<T> {
  constructor(private value: number) {
    super();
  }

  match(node: T, operator: string): boolean {
    const actual = this.actualValue(node);
    const expected = this.expectedValue();
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

  // expected value returns a number.
  expectedValue(): string {
    return this.value.toString();
  }

  toString(): string {
    return this.value.toString();
  }
}

export default Number;