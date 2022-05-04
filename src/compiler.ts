export module Compiler {
  export class Expression {
    constructor(selector: Selector, rest: Expression) {

    }
  }

  export class Selector {
    construcor(nodeType: string, attributeList: AttributeList) {

    }
  }

  export class AttributeList {
    constructor(attribute: Attribute, rest: AttributeList) {

    }
  }

  export class Attribute {
    constructor(key: string, value: string, operator: string) {

    }
  }
}