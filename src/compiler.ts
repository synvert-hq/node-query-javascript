namespace Compiler {
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

    toString(): string {
      if (this.rest) {
        return `[${this.attribute}]${this.rest.toString()}`
      }
      return `[${this.attribute}]`;
    }
  }

  interface AttributeParameters {
    key: string;
    value: String
    operator: string;
  }

  export class Attribute {
    private key: string;
    private value: String
    private operator: string;

    constructor({ key, value, operator }: AttributeParameters) {
      this.key = key;
      this.value = value;
      this.operator = operator;
    }

    toString(): string {
      return `${this.key}=${this.value}`;
    }
  }

  export class String {
    private value: string;

    constructor({ value }: { value: string }) {
      this.value = value;
    }

    toString(): string {
      return `"${this.value}"`;
    }
  }

  export class Identifier {
    private value: string;

    constructor({ value }: { value: string }) {
      this.value = value;
    }

    toString(): string {
      return this.value;
    }
  }
}

module.exports = Compiler;