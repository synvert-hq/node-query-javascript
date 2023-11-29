import TypescriptAdapter from "../src/adapter/typescript";

const Compiler = require("../src/compiler");
const { parseCode } = require("./test-helper");

describe("Compiler", () => {
  const adapter = new TypescriptAdapter();
  describe("Boolean", () => {
    it("matches true", () => {
      const value = new Compiler.Boolean(true, adapter);
      const node = parseCode("true").statements[0];
      expect(value.match(node, node, "==")).toBeTruthy();
    });

    it("matches false", () => {
      const value = new Compiler.Boolean(false, adapter);
      const node = parseCode("false").statements[0];
      expect(value.match(node, node, "==")).toBeTruthy();
    });

    it("matches not equal", () => {
      const value = new Compiler.Boolean(true, adapter);
      const node = parseCode("false").statements[0];
      expect(value.match(node, node, "!=")).toBeTruthy();
    });
  });

  describe("Identifier", () => {
    it("matches equal", () => {
      const value = new Compiler.Identifier("constructor", adapter);
      const node = parseCode("constructor").statements[0];
      expect(value.match(node, node, "==")).toBeTruthy();
    });

    it("matches not equal", () => {
      const value = new Compiler.Identifier("constructor", adapter);
      const node = parseCode("synvert").statements[0];
      expect(value.match(node, node, "!=")).toBeTruthy();
    });
  });

  describe("Null", () => {
    it("matches null", () => {
      const value = new Compiler.Null(adapter);
      const node = parseCode("null").statements[0];
      expect(value.match(node, node, "==")).toBeTruthy();
    });

    it("matches not null", () => {
      const value = new Compiler.Null(adapter);
      const node = parseCode("synvert").statements[0];
      expect(value.match(node, node, "!=")).toBeTruthy();
    });
  });

  describe("Number", () => {
    it("matches number", () => {
      const value = new Compiler.Number(1.1, adapter);
      const node = parseCode("1.1").statements[0];
      expect(value.match(node, node, "==")).toBeTruthy();
    });

    it("matches not equal", () => {
      const value = new Compiler.Number(1.1, adapter);
      const node = parseCode("1").statements[0];
      expect(value.match(node, node, "!=")).toBeTruthy();
    });
  });

  describe("Regexp", () => {
    it("matches regexp", () => {
      const value = new Compiler.Regexp(/\$/, adapter);
      const node = parseCode("$(body)").statements[0];
      expect(value.match(node, node, "=~")).toBeTruthy();
    });

    it("does not match regexp", () => {
      const value = new Compiler.Regexp(/\$/, adapter);
      const node = parseCode("foo bar").statements[0];
      expect(value.match(node, node, "!~")).toBeTruthy();
    });
  });

  describe("String", () => {
    it("matches string", () => {
      const value = new Compiler.String("synvert", adapter);
      const node = parseCode('"synvert"').statements[0];
      expect(value.match(node, node, "==")).toBeTruthy();
    });

    it("matches not equal", () => {
      const value = new Compiler.String("synvert", adapter);
      const node = parseCode('"foobar"').statements[0];
      expect(value.match(node, node, "!=")).toBeTruthy();
    });

    it("matches evaluated value", () => {
      const value = new Compiler.String("{{initializer.text}}", adapter);
      const baseNode = parseCode("const foo = { foo: 'foo' }").statements[0]
        .declarationList.declarations[0].initializer.properties[0];
      const node = baseNode.name;
      expect(value.match(node, baseNode, "==")).toBeTruthy();
    });
  });

  describe("Undefined", () => {
    it("matches undefined", () => {
      const value = new Compiler.Undefined(adapter);
      const node = parseCode("undefined").statements[0];
      expect(value.match(node, node, "==")).toBeTruthy();
    });

    it("matches not null", () => {
      const value = new Compiler.Undefined(adapter);
      const node = parseCode("synvert").statements[0];
      expect(value.match(node, node, "!=")).toBeTruthy();
    });
  });

  describe("ArrayValue", () => {
    it("matches equal", () => {
      const value = new Compiler.ArrayValue({
        value: new Compiler.Identifier("foo", adapter),
        rest: new Compiler.ArrayValue({
          value: new Compiler.Identifier("bar", adapter),
        }),
      });
      const node = parseCode("[foo, bar]").statements[0].expression.elements;
      expect(value.match(node, node, "==")).toBeTruthy();
    });

    it("matches not equal", () => {
      const value = new Compiler.ArrayValue({
        value: new Compiler.Identifier("foo", adapter),
        rest: new Compiler.ArrayValue({
          value: new Compiler.Identifier("bar", adapter),
        }),
      });
      const node = parseCode("[synvert]").statements[0].expression.elements;
      expect(value.match(node, node, "!=")).toBeTruthy();
    });

    it("matches in", () => {
      const value = new Compiler.ArrayValue({
        value: new Compiler.Identifier("foo", adapter),
        rest: new Compiler.ArrayValue({
          value: new Compiler.Identifier("bar", adapter),
        }),
      });
      const node = parseCode("foo").statements[0];
      expect(value.match(node, node, "in")).toBeTruthy();
    });

    it("matches not_in", () => {
      const value = new Compiler.ArrayValue({
        value: new Compiler.Identifier("foo", adapter),
        rest: new Compiler.ArrayValue({
          value: new Compiler.Identifier("bar", adapter),
        }),
      });
      const node = parseCode("synvert").statements[0];
      expect(value.match(node, node, "not_in")).toBeTruthy();
    });
  });

  describe("Attribute", () => {
    it("matches node", () => {
      const attribute = new Compiler.Attribute({
        key: "name",
        value: new Compiler.Identifier("Synvert", adapter),
        operator: "==",
      });
      const node = parseCode("class Synvert {}").statements[0];
      expect(attribute.match(node, node)).toBeTruthy();
    });

    it("does not match node", () => {
      const attribute = new Compiler.Attribute({
        key: "name",
        value: new Compiler.Identifier("Synvert", adapter),
        operator: "==",
      });
      const node = parseCode("class Foobar {}").statements[0];
      expect(attribute.match(node, node)).toBeFalsy();
    });

    it("matches nested key", () => {
      const attribute = new Compiler.Attribute({
        key: "name.escapedText",
        value: new Compiler.Identifier("Synvert", adapter),
        operator: "==",
      });
      const node = parseCode("class Synvert {}").statements[0];
      expect(attribute.match(node, node)).toBeTruthy();
    });

    it("matches nested key with array index", () => {
      const attribute = new Compiler.Attribute({
        key: "members.0",
        value: new Compiler.Undefined(),
        operator: "==",
      });
      const node = parseCode("class Synvert {}").statements[0];
      expect(attribute.match(node, node)).toBeTruthy();
    });

    it("matches nested key with function", () => {
      const attribute = new Compiler.Attribute({
        key: "members.length",
        value: new Compiler.Number(0),
        operator: "==",
      });
      const node = parseCode("class Synvert {}").statements[0];
      expect(attribute.match(node, node)).toBeTruthy();
    });
  });

  describe("AttributeList", () => {
    it("matches node", () => {
      const attributeList = new Compiler.AttributeList({
        attribute: new Compiler.Attribute({
          key: "arguments.0",
          value: new Compiler.String("Murphy", adapter),
          operator: "==",
          adapter,
        }),
        rest: new Compiler.AttributeList({
          attribute: new Compiler.Attribute({
            key: "arguments.1",
            value: new Compiler.Number(1, adapter),
            operator: "==",
            adapter,
          }),
          rest: new Compiler.AttributeList({
            attribute: new Compiler.Attribute({
              key: "arguments.2",
              value: new Compiler.Boolean(true, adapter),
              operator: "==",
              adapter,
            }),
          }),
        }),
      });
      const node = parseCode('new UserAccount("Murphy", 1, true)').statements[0]
        .expression;
      expect(attributeList.match(node, node)).toBeTruthy();
    });
  });

  describe("BasicSelector", () => {
    it("matches node", () => {
      const basicSelector = new Compiler.BasicSelector({
        nodeType: "NewExpression",
        attributeList: new Compiler.AttributeList({
          attribute: new Compiler.Attribute({
            key: "arguments.0",
            value: new Compiler.String("Murphy", adapter),
            operator: "==",
            adapter,
          }),
          rest: new Compiler.AttributeList({
            attribute: new Compiler.Attribute({
              key: "arguments.1",
              value: new Compiler.Number(1, adapter),
              operator: "==",
              adapter,
            }),
            rest: new Compiler.AttributeList({
              attribute: new Compiler.Attribute({
                key: "arguments.2",
                value: new Compiler.Boolean(true, adapter),
                operator: "==",
                adapter,
              }),
            }),
          }),
        }),
        adapter,
      });
      const node = parseCode('new UserAccount("Murphy", 1, true)').statements[0]
        .expression;
      expect(basicSelector.match(node, node)).toBeTruthy();
    });
  });

  describe("Selector", () => {
    it("matches node", () => {
      const selector = new Compiler.Selector({
        basicSelector: new Compiler.BasicSelector({
          nodeType: "NewExpression",
          adapter,
        }),
        pseudoClass: "has",
        pseudoSelector: new Compiler.Selector({
          basicSelector: new Compiler.BasicSelector({
            nodeType: "StringLiteral",
            text: "Murphy",
            adapter,
          }),
          adapter,
        }),
        adapter,
      });
      const node = parseCode('new UserAccount("Murphy", 1, true)').statements[0]
        .expression;
      expect(selector.match(node, node)).toBeTruthy();
    });
  });
});
