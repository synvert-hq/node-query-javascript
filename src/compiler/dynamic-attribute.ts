import debug from "debug";

import Value from "./value";
import { getAdapter, getTargetNode, toString } from "./helpers";

class DynamicAttribute<T> extends Value<T> {
  public baseNode!: T;

  constructor(private value: string) {
    super();
  }

  expectedValue(): string {
    debug("node-query:dynamic-attribute")(this.value);
    const node = getTargetNode(this.baseNode, this.value);
    return toString<T>(node);
  }

  toString(): string {
    return `{{${this.value}}}`;
  }
}

export default DynamicAttribute;
