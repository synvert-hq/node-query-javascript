import { Node, SyntaxKind } from "typescript";

export namespace Compiler {
  interface ExpressionParameters {
    selector: Selector | null;
    rest: Expression | null;
    relationship: string | null;
  }

  export class Expression {
    private selector: Selector | null;
    private rest: Expression | null;
    private relationship: string | null;

    constructor({ selector, rest, relationship }: ExpressionParameters) {
      this.selector = selector;
      this.rest = rest;
      this.relationship = relationship;
    }

    // check if the node matches the expression.
    match(node: Node) {
      return this.queryNodes(node).length !== 0;
    }

    queryNodes(node: Node, descendantMatch: boolean = true): Node[] {
      if (this.relationship) {
        return this.findNodesByRelationship(node);
      }

      const matchingNodes = this.findNodesWithoutRelationship(node, descendantMatch);
      if (!this.rest) {
        return matchingNodes;
      }
      return matchingNodes.flatMap(matchingNode => this.findNodesByRest(matchingNode, descendantMatch));
    }

    toString(): string {
      const result = [];
      if (this.selector) {
        result.push(this.selector.toString());
      }
      if (this.rest) {
        switch (this.relationship) {
          case 'child':
            result.push(`> ${this.rest.toString()}`);
            break;
          default:
            result.push(this.rest.toString());
            break;
        }
      }
      return result.join(' ');
    }

    private findNodesByRelationship(node: Node): Node[] {
      switch (this.relationship) {
        case 'child':
          let nodes: Node[] = [];
          node.forEachChild(childNode => {
            nodes = nodes.concat(this.findNodesByRest(childNode))
          });
          return nodes;
        default:
          return [];
      }
    }

    private findNodesByRest(node: Node, descendantMatch: boolean = false): Node[] {
      if (!this.rest) {
        return [];
      }
      return this.rest.queryNodes(node, descendantMatch)
    }

    private findNodesWithoutRelationship(node: Node | Node[], descendantMatch: boolean = true): Node[] {
      if (Array.isArray(node)) {
        return node.flatMap((eachNode) => {
          return this.findNodesWithoutRelationship(eachNode, descendantMatch)
        });
      }

      if (!this.selector) {
        return [node];
      }

      const nodes = [];
      if (this.selector.match(node)) {
        nodes.push(node);
      }
      if (descendantMatch) {
        this.recusriveEachChild(node, (childNode) => {
          if (this.selector && this.selector.match(childNode)) {
            nodes.push(childNode);
          }
        });
      }
      return nodes;
    }

    private recusriveEachChild(node: Node, handler: (childNode: Node) => void): void {
      node.forEachChild(childNode => {
        handler(childNode);
        this.recusriveEachChild(childNode, handler);
      });
    }
  }

  interface SelectorParameters {
    nodeType: string;
    attributeList: AttributeList | null;
  }

  export class Selector {
    private nodeType: string;
    private attributeList: AttributeList | null;

    constructor({ nodeType, attributeList }: SelectorParameters) {
      this.nodeType = nodeType;
      this.attributeList = attributeList;
    }

    // check if the node matches the selector.
    match(node: Node): boolean {
      return this.nodeType == SyntaxKind[node.kind] &&
        (!this.attributeList || this.attributeList.match(node));
    }

    toString(): string {
      const result = [];
      if (this.nodeType) {
        result.push(`.${this.nodeType}`);
      }
      if (this.attributeList) {
        result.push(this.attributeList.toString());
      }
      return result.join('');
    }
  }

  interface AttributeListParameters {
    attribute: Attribute;
    rest: AttributeList | null;
  }

  export class AttributeList {
    private attribute: Attribute;
    private rest: AttributeList | null;

    constructor({ attribute, rest }: AttributeListParameters) {
      this.attribute = attribute;
      this.rest = rest;
    }

    // check if the node matches the attribute list.
    match(node: Node): boolean {
      return this.attribute.match(node) && (!this.rest || this.rest.match(node));
    }

    toString(): string {
      if (this.rest) {
        return `[${this.attribute}]${this.rest.toString()}`
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
      return this.value.match(this.getTargetNode(node), this.operator);
    }

    toString(): string {
      switch (this.operator) {
        case 'not_in':
          return `${this.key} NOT IN (${this.value})`;
        case 'in':
          return `${this.key} IN (${this.value})`;
        case '!=':
          return `${this.key}!=${this.value}`;
        case '>=':
          return `${this.key}>=${this.value}`;
        case '>':
          return `${this.key}>${this.value}`;
        case '<=':
          return `${this.key}<=${this.value}`;
        case '<':
          return `${this.key}<${this.value}`;
        default:
          return `${this.key}=${this.value}`;
      }
    }

    private getTargetNode(node: Node): Node {
      let target = node as any;
      this.key.split('.').forEach(key => {
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
        case '!=':
          return actual !== expected;
        case '>=':
          return actual >= expected;
        case '>':
          return actual > expected;
        case '<=':
          return actual <= expected;
        case '<':
          return actual < expected;
        default:
          return actual === expected;
      }
    }

    // actual value can be a string or the source code of a typescript node.
    actualValue(node: Node | string | number | boolean | null | undefined): string {
      if (node === null) {
        return 'null';
      }
      if (node === undefined) {
        return 'undefined';
      }
      if (typeof node === 'string') {
        return node;
      }
      if (typeof node === 'number') {
        return node.toString();
      }
      if (typeof node === 'boolean') {
        return node.toString();
      }
      return node.getFullText().trim();
    }

    abstract expectedValue(): string;
  }

  interface ArrayValueParameters {
    value: Value;
    rest: ArrayValue;
  }

  // ArrayValue is an array of Value.
  export class ArrayValue {
    private value: Value
    private rest: ArrayValue

    constructor({ value, rest }: ArrayValueParameters) {
      this.value = value;
      this.rest = rest;
    }

    // check if the actual value matches the expected value.
    match(node: Node | Node[], operator: string): boolean {
      const expected = this.expectedValue();
      switch (operator) {
        case "not_in":
          return !Array.isArray(node) && expected.every(expectedValue => expectedValue.match(node, "!="));
        case "in":
          return !Array.isArray(node) && expected.some(expectedValue => expectedValue.match(node, "=="));
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
        expected = expected.concat(this.rest.expectedValue())
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
        if (expected[index].match(actual[index], '!=')) {
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
        if (!expected[index].match(actual[index], '==')) {
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
      return 'null';
    }
  }

  export class Number extends Value {
    constructor(private value: number) {
      super();
    }

    // expected value as string number.
    expectedValue(): string {
      return this.value.toString();
    }

    toString(): string {
      return this.value.toString();
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
      return 'undefined';
    }
  }
}

module.exports = Compiler;