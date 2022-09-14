import type { Node } from "./types";
import Value from "./value";
import { evaluateNodeValue } from "./helper";

class String<T> extends Value<T> {
  // baseNode is used for evaluated value.
  public baseNode!: T;

  constructor(private value: string) {
    super();
  }

  // actual value strips the quotes, e.g. '"synvert"' => 'synvert'
  actualValue(node: Node<T>): string {
    const value = super.actualValue(node);
    if (value[0] === '"' || value[0] === '"') {
      return value.substring(1, value.length - 1);
    }
    return value;
  }

  // expected value returns the value.
  expectedValue(): string {
    return evaluateNodeValue(this.baseNode, this.value);
  }

  toString(): string {
    return `"${this.value}"`;
  }
}

export default String;
