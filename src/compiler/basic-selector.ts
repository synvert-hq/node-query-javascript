import debug from "debug";

import AttributeList from "./attribute-list";
import { getAdapter } from "../helper";

interface BasicSelectorParameters<T> {
  nodeType: string;
  attributeList?: AttributeList<T>;
}

class BasicSelector<T> {
  private nodeType: string;
  private attributeList?: AttributeList<T>;

  constructor({ nodeType, attributeList }: BasicSelectorParameters<T>) {
    this.nodeType = nodeType;
    this.attributeList = attributeList;
  }

  // check if the node matches the selector.
  match(node: T, baseNode: T): boolean {
    const expectedNodeType = this.nodeType;
    const actualNodeType = getAdapter<T>().getNodeType(node);
    debug("node-query:node-type")(`${actualNodeType} == ${expectedNodeType}`);
    const result = (
      expectedNodeType === actualNodeType &&
      (!this.attributeList || this.attributeList.match(node, baseNode))
    );
    debug("node-query:node-type")(`result: ${result}`);
    return result;
  }

  toString(): string {
    const result = [`.${this.nodeType}`];
    if (this.attributeList) {
      result.push(this.attributeList.toString());
    }
    return result.join("");
  }
}

export default BasicSelector;
