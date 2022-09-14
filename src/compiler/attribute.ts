import Value from "./value";
import ArrayValue from "./array-value";
import String from "./string";
import Selector from "./selector";
import { getTargetNode } from "../helper";

interface AttributeParameters<T> {
  key: string;
  value: Value<T> | ArrayValue<T> | Selector<T>;
  operator: string;
}

class Attribute<T> {
  private key: string;
  private value: Value<T> | ArrayValue<T> | Selector<T>;
  private operator: string;

  constructor({ key, value, operator }: AttributeParameters<T>) {
    this.key = key;
    this.value = value;
    this.operator = operator;
  }

  // check if the node matches the attribute.
  match(node: T): boolean {
    if (this.value instanceof String) {
      this.value.baseNode = node;
    }
    const actualValue = getTargetNode(node, this.key);
    return this.value.match(actualValue as T, this.operator);
  }

  toString(): string {
    switch (this.operator) {
      case "not_in":
        return `${this.key} NOT IN (${this.value})`;
      case "in":
        return `${this.key} IN (${this.value})`;
      case "^=":
      case "$=":
      case "*=":
      case "!=":
      case ">=":
      case ">":
      case "<=":
      case "<":
      case "=~":
      case "!~":
        return `${this.key}${this.operator}${this.value}`;
      default:
        return `${this.key}=${this.value}`;
    }
  }
}

export default Attribute;
