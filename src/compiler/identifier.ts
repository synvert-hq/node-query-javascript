import Adapter from "../adapter";
import Value from "./value";

class Identifier<T> extends Value<T> {
  constructor(private value: string, adapter: Adapter<T>) {
    super(adapter);
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
