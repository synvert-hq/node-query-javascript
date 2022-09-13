import debug from "debug";

import Value from "./value";
import { getTargetNode, toString } from "./helper";

class EvaluatedValue<T> extends Value<T> {
  public baseNode!: T;

  constructor(private value: string) {
    super();
  }

  expectedValue(): string {
    debug("node-query:evaluated-value")(this.value);
    const node = getTargetNode(this.baseNode, this.value);
    return toString<T>(node);
  }

  toString(): string {
    return `{{${this.value}}}`;
  }
}

export default EvaluatedValue;
