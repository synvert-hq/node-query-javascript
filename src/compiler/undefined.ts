import Value from "./value";

class Undefined<T> extends Value<T> {
  // expected value is already 'undefined'
  expectedValue(): string {
    return "undefined";
  }
}

export default Undefined;
