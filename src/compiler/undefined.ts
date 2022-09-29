import Value from "./value";

class Undefined<T> extends Value<T> {
  // expected value is already 'undefined'
  expectedValue(_baseNode: T): string {
    return "undefined";
  }
}

export default Undefined;
