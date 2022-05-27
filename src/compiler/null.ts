import Value from "./value";

class Null<T> extends Value<T> {
  // expected value is already 'null'
  expectedValue(): string {
    return "null";
  }
}

export default Null;
