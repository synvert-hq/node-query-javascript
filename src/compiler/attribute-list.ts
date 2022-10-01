import Attribute from "./attribute";

interface AttributeListParameters<T> {
  attribute: Attribute<T>;
  rest?: AttributeList<T>;
}

class AttributeList<T> {
  private attribute: Attribute<T>;
  private rest?: AttributeList<T>;

  constructor({ attribute, rest }: AttributeListParameters<T>) {
    this.attribute = attribute;
    this.rest = rest;
  }

  // check if the node matches the attribute list.
  match(node: T, baseNode: T): boolean {
    return (
      this.attribute.match(node, baseNode) &&
      (!this.rest || this.rest.match(node, baseNode))
    );
  }

  toString(): string {
    if (this.rest) {
      return `[${this.attribute}]${this.rest.toString()}`;
    }
    return `[${this.attribute}]`;
  }
}

export default AttributeList;
