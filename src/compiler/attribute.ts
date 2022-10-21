import Value from "./value";
import ArrayValue from "./array-value";
import Selector from "./selector";
import { getTargetNode } from "../helper";
import debug from "debug";

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
  match(node: T, baseNode: T): boolean {
    const actualValue = getTargetNode(node, this.key);
    debug("node-query:attribute")(`${this.key} ${this.operator} ${this.value}`);
    const result = this.value.match(actualValue as T, baseNode, this.operator);
    debug("node-query:attribute")(`result: ${result}`);
    return result;
  }

  toString(): string {
    switch (this.operator) {
      case "not_includes":
        return `${this.key} NOT INCLUDES ${this.value}`;
      case "includes":
        return `${this.key} INCLUDES ${this.value}`;
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
