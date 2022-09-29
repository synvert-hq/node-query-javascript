import Value from "./value";

class Boolean<T> extends Value<T> {
  constructor(private value: boolean) {
    super();
  }

  // expected value returns string true or false.
  expectedValue(_baseNode: T): string {
    return this.value.toString();
  }

  toString(): string {
    return this.value.toString();
  }
}

export default Boolean;
