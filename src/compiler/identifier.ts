import Value from "./value";

class Identifier<T> extends Value<T> {
  constructor(private value: string) {
    super();
  }

  // expected value returns the value.
  expectedValue(): string {
    return this.value;
  }

  toString(): string {
    return this.value;
  }
}

export default Identifier;