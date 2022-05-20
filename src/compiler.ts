import { Node } from "typescript";
import NodeQuery from "./index";

const getTargetNode = (node: Node, keys: string): Node => {
  let target = node as any;
  keys.split(".").forEach((key) => {
    if (!target) return;

    if (target.hasOwnProperty(key)) {
      target = target[key];
    } else if (typeof target[key] === "function") {
      target = target[key].call(target);
    } else {
      target = null;
    }
  });
  return target;
};

export namespace Compiler {
  interface ExpressionParameters {
    selector: Selector;
    rest?: Expression;
  }

  export class Expression {
    private selector: Selector;
    private rest?: Expression;

    constructor({ selector, rest }: ExpressionParameters) {
      this.selector = selector;
      this.rest = rest;
    }

    // check if the node matches the expression.
    match(node: Node) {
      return this.queryNodes(node).length !== 0;
    }

    queryNodes(node: Node | Node[], descendantMatch = true): Node[] {
      const matchingNodes = this.selector.queryNodes(node, descendantMatch);
      if (!this.rest) {
        return matchingNodes;
      }
      return matchingNodes.flatMap((matchingNode) =>
        this.findNodesByRest(matchingNode, descendantMatch)
      );
    }

    toString(): string {
      const result = [];
      if (this.selector) {
        result.push(this.selector.toString());
      }
      if (this.rest) {
        result.push(this.rest.toString());
      }
      return result.join(" ");
    }

    private findNodesByRest(
      node: Node | Node[],
      descendantMatch = true
    ): Node[] {
      if (!this.rest) {
        return [];
      }
      return this.rest.queryNodes(node, descendantMatch);
    }
  }

  interface SelectorParameters {
    gotoScope?: string;
    rest?: Selector;
    basicSelector?: BasicSelector;
    relationship?: string;
  }

  export class Selector {
    private gotoScope?: string;
    private rest?: Selector;
    private basicSelector?: BasicSelector;
    private relationship?: string;

    constructor({
      gotoScope,
      rest,
      basicSelector,
      relationship,
    }: SelectorParameters) {
      this.gotoScope = gotoScope;
      this.rest = rest;
      this.basicSelector = basicSelector;
      this.relationship = relationship;
    }

    // check if the node matches the selector.
    match(node: Node): boolean {
      return !this.basicSelector || this.basicSelector.match(node);
    }

    queryNodes(node: Node | Node[], descendantMatch = true): Node[] {
      if (this.relationship && !Array.isArray(node)) {
        return this.findNodesByRelationship(node);
      }

      if (Array.isArray(node)) {
        return node.flatMap((childNode) =>
          this.queryNodes(childNode, descendantMatch)
        );
      }

      if (this.gotoScope) {
        const targetNode = getTargetNode(node, this.gotoScope);
        if (this.rest) {
          return this.rest.queryNodes(targetNode, false);
        }
      }

      const nodes: Node[] = [];
      if (this.match(node)) {
        nodes.push(node);
      }
      if (descendantMatch) {
        this.handleRecursiveChild(node, (childNode) => {
          if (this.match(childNode)) {
            nodes.push(childNode);
          }
        });
      }
      return nodes;
    }

    toString(): string {
      const result = [];
      if (this.gotoScope) {
        result.push(`${this.gotoScope} `);
      }
      if (this.relationship) {
        result.push(`${this.relationship} `);
      }
      if (this.rest) {
        result.push(this.rest.toString());
      }
      if (this.basicSelector) {
        result.push(this.basicSelector.toString());
      }
      return result.join("");
    }

    private findNodesByRelationship(node: Node): Node[] {
      const nodes: Node[] = [];
      switch (this.relationship) {
        case ">":
          NodeQuery.getAdapter()
            .getChildren(node)
            .forEach((childNode) => {
              if (this.match(childNode)) {
                nodes.push(childNode);
              }
            });
          break;
        case "+":
          const nextSibling = NodeQuery.getAdapter().getSiblings(node)[0];
          if (nextSibling && this.match(nextSibling)) {
            nodes.push(nextSibling);
          }
          break;
        case "~":
          NodeQuery.getAdapter()
            .getSiblings(node)
            .forEach((siblingNode) => {
              if (this.match(siblingNode)) {
                nodes.push(siblingNode);
              }
            });
          break;
        default:
          break;
      }
      return nodes;
    }

    private handleRecursiveChild(
      node: Node,
      handler: (childNode: Node) => void
    ): void {
      NodeQuery.getAdapter()
        .getChildren(node)
        .forEach((childNode) => {
          handler(childNode);
          this.handleRecursiveChild(childNode, handler);
        });
    }
  }

  interface BasicSelectorParameters {
    nodeType: string;
    attributeList?: AttributeList;
  }

  export class BasicSelector {
    private nodeType: string;
    private attributeList?: AttributeList;

    constructor({ nodeType, attributeList }: BasicSelectorParameters) {
      this.nodeType = nodeType;
      this.attributeList = attributeList;
    }

    // check if the node matches the selector.
    match(node: Node): boolean {
      return (
        this.nodeType == NodeQuery.getAdapter().getNodeType(node) &&
        (!this.attributeList || this.attributeList.match(node))
      );
    }

    toString(): string {
      const result = [`.${this.nodeType}`];
      if (this.attributeList) {
        result.push(this.attributeList.toString());
      }
      return result.join("");
    }
  }

  interface AttributeListParameters {
    attribute: Attribute;
    rest?: AttributeList;
  }

  export class AttributeList {
    private attribute: Attribute;
    private rest?: AttributeList;

    constructor({ attribute, rest }: AttributeListParameters) {
      this.attribute = attribute;
      this.rest = rest;
    }

    // check if the node matches the attribute list.
    match(node: Node): boolean {
      return (
        this.attribute.match(node) && (!this.rest || this.rest.match(node))
      );
    }

    toString(): string {
      if (this.rest) {
        return `[${this.attribute}]${this.rest.toString()}`;
      }
      return `[${this.attribute}]`;
    }
  }

  interface AttributeParameters {
    key: string;
    value: Value | ArrayValue | Selector;
    operator: string;
  }

  export class Attribute {
    private key: string;
    private value: Value | ArrayValue | Selector;
    private operator: string;

    constructor({ key, value, operator }: AttributeParameters) {
      this.key = key;
      this.value = value;
      this.operator = operator;
    }

    // check if the node matches the attribute.
    match(node: Node): boolean {
      return this.value.match(getTargetNode(node, this.key), this.operator);
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

  // Value is an atom value,
  // it can be a Boolean, Null, Number, Undefined, String or Identifier.
  abstract class Value {
    // check if the actual value matches the expected value.
    match(node: Node, operator: string): boolean {
      const actual = this.actualValue(node);
      const expected = this.expectedValue();
      switch (operator) {
        case "^=":
          return actual.startsWith(expected);
        case "$=":
          return actual.endsWith(expected);
        case "*=":
          return actual.includes(expected);
        case "!=":
          return actual !== expected;
        case ">=":
          return actual >= expected;
        case ">":
          return actual > expected;
        case "<=":
          return actual <= expected;
        case "<":
          return actual < expected;
        default:
          return actual === expected;
      }
    }

    // actual value can be a string or the source code of a typescript node.
    actualValue(
      node: Node | string | number | boolean | null | undefined
    ): string {
      if (node === null) {
        return "null";
      }
      if (node === undefined) {
        return "undefined";
      }
      if (typeof node === "string") {
        return node;
      }
      if (typeof node === "number") {
        return node.toString();
      }
      if (typeof node === "boolean") {
        return node.toString();
      }
      return NodeQuery.getAdapter().getSource(node);
    }

    abstract expectedValue(): string;
  }

  interface ArrayValueParameters {
    value: Value;
    rest: ArrayValue;
  }

  // ArrayValue is an array of Value.
  export class ArrayValue {
    private value: Value;
    private rest: ArrayValue;

    constructor({ value, rest }: ArrayValueParameters) {
      this.value = value;
      this.rest = rest;
    }

    // check if the actual value matches the expected value.
    match(node: Node | Node[], operator: string): boolean {
      const expected = this.expectedValue();
      switch (operator) {
        case "not_in":
          return (
            !Array.isArray(node) &&
            expected.every((expectedValue) => expectedValue.match(node, "!="))
          );
        case "in":
          return (
            !Array.isArray(node) &&
            expected.some((expectedValue) => expectedValue.match(node, "=="))
          );
        case "!=":
          return Array.isArray(node) && this.compareNotEqual(node, expected);
        default:
          return Array.isArray(node) && this.compareEqual(node, expected);
      }
    }

    // expected value is an array of Value.
    expectedValue(): Value[] {
      let expected: Value[] = [];
      if (this.value) {
        expected.push(this.value);
      }
      if (this.rest) {
        expected = expected.concat(this.rest.expectedValue());
      }
      return expected;
    }

    toString(): string {
      if (this.rest) {
        return `${this.value} ${this.rest}`;
      }
      return this.value.toString();
    }

    private compareNotEqual(actual: Node[], expected: Value[]) {
      if (expected.length !== actual.length) {
        return true;
      }

      for (let index = 0; index < actual.length; index++) {
        if (expected[index].match(actual[index], "!=")) {
          return true;
        }
      }

      return false;
    }

    private compareEqual(actual: Node[], expected: Value[]) {
      if (expected.length !== actual.length) {
        return false;
      }

      for (let index = 0; index < actual.length; index++) {
        if (!expected[index].match(actual[index], "==")) {
          return false;
        }
      }

      return true;
    }
  }

  export class Boolean extends Value {
    constructor(private value: boolean) {
      super();
    }

    // expected value returns string true or false.
    expectedValue(): string {
      return this.value.toString();
    }

    toString(): string {
      return this.value.toString();
    }
  }

  export class Identifier extends Value {
    constructor(private value: string) {
      super();
    }

    // expected value returns the value.
    expectedValue(): string {
      return this.value;
    }

    toString(): string {
      return this.value;
    }
  }

  export class Null extends Value {
    // expected value is already 'null'
    expectedValue(): string {
      return "null";
    }
  }

  export class Number extends Value {
    constructor(private value: number) {
      super();
    }

    match(node: Node, operator: string): boolean {
      const actual = this.actualValue(node);
      const expected = this.expectedValue();
      switch (operator) {
        case "!=":
          return actual !== expected;
        case ">=":
          return actual >= expected;
        case ">":
          return actual > expected;
        case "<=":
          return actual <= expected;
        case "<":
          return actual < expected;
        default:
          return actual === expected;
      }
    }

    // expected value returns a number.
    expectedValue(): string {
      return this.value.toString();
    }

    toString(): string {
      return this.value.toString();
    }
  }

  export class Regexp extends Value {
    constructor(private value: string) {
      super();
    }

    match(node: Node, operator: string): boolean {
      const actual = this.actualValue(node);
      const expected = new RegExp(this.expectedValue());
      if (operator === "=~") {
        return expected.test(actual);
      } else {
        return !expected.test(actual);
      }
    }

    expectedValue(): string {
      return this.value;
    }

    toString(): string {
      return `/${this.value}/`;
    }
  }

  export class String extends Value {
    constructor(private value: string) {
      super();
    }

    // actual value strips the quotes, e.g. '"synvert"' => 'synvert'
    actualValue(node: string | Node): string {
      const value = super.actualValue(node);
      return value.substring(1, value.length - 1);
    }

    // expected value returns the value.
    expectedValue(): string {
      return this.value;
    }

    toString(): string {
      return `"${this.value}"`;
    }
  }

  export class Undefined extends Value {
    // expected value is already 'undefined'
    expectedValue(): string {
      return "undefined";
    }
  }
}

module.exports = Compiler;
