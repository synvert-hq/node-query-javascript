import ts from "typescript";
import { parseCode } from "./test-helper";
import NodeRules from "../src/node-rules";

describe("NodeRules", () => {
  describe("#queryNodes", () => {
    const node = parseCode(`
      interface User {
        name: string;
        id: number;
        active: boolean;
      }

      class UserAccount {
        name: string;
        id: number;
        active: boolean;

        constructor(name: string, id: number, active: boolean) {
          this.name = name;
          this.id = id;
          this.active = active;
        }
      }

      const user: User = new UserAccount("Murphy", 1, true);
    `);

    it("matches node type", () => {
      const nodeRules = new NodeRules({ nodeType: "ClassDeclaration" });
      expect(nodeRules.queryNodes(node)).toEqual([node.statements[1]]);
    });

    it("matches node type and one attribute", () => {
      const nodeRules = new NodeRules({
        nodeType: "NewExpression",
        expression: "UserAccount",
      });
      expect(nodeRules.queryNodes(node)).toEqual([
        (node.statements[2] as ts.VariableStatement).declarationList
          .declarations[0].initializer,
      ]);
    });

    it("matches node type and nested attribute", () => {
      const nodeRules = new NodeRules({
        nodeType: "NewExpression",
        expression: { escapedText: "UserAccount" },
      });
      expect(nodeRules.queryNodes(node)).toEqual([
        (node.statements[2] as ts.VariableStatement).declarationList
          .declarations[0].initializer,
      ]);
    });

    it("matches string literal", () => {
      const nodeRules = new NodeRules({
        nodeType: "NewExpression",
        arguments: { 0: "Murphy" },
      });
      expect(nodeRules.queryNodes(node)).toEqual([
        (node.statements[2] as ts.VariableStatement).declarationList
          .declarations[0].initializer,
      ]);
    });

    it("matches number literal", () => {
      const nodeRules = new NodeRules({
        nodeType: "NewExpression",
        arguments: { 1: 1 },
      });
      expect(nodeRules.queryNodes(node)).toEqual([
        (node.statements[2] as ts.VariableStatement).declarationList
          .declarations[0].initializer,
      ]);
    });

    it("matches boolean literal", () => {
      const nodeRules = new NodeRules({
        nodeType: "NewExpression",
        arguments: { 2: true },
      });
      expect(nodeRules.queryNodes(node)).toEqual([
        (node.statements[2] as ts.VariableStatement).declarationList
          .declarations[0].initializer,
      ]);
    });

    it("matches not operator", () => {
      const nodeRules = new NodeRules({
        nodeType: "NewExpression",
        arguments: { 2: { not: false } },
      });
      expect(nodeRules.queryNodes(node)).toEqual([
        (node.statements[2] as ts.VariableStatement).declarationList
          .declarations[0].initializer,
      ]);
    });

    it("matches regex operator", () => {
      const nodeRules = new NodeRules({
        nodeType: "NewExpression",
        expression: /^User/,
      });
      expect(nodeRules.queryNodes(node)).toEqual([
        (node.statements[2] as ts.VariableStatement).declarationList
          .declarations[0].initializer,
      ]);
    });

    it("matches regex not operator", () => {
      const nodeRules = new NodeRules({
        nodeType: "NewExpression",
        expression: { not: /^Account/ },
      });
      expect(nodeRules.queryNodes(node)).toEqual([
        (node.statements[2] as ts.VariableStatement).declarationList
          .declarations[0].initializer,
      ]);
    });

    it("matches INCLUDES operator", () => {
      const nodeRules = new NodeRules({
        nodeType: "NewExpression",
        arguments: { includes: "Murphy" },
      });
      expect(nodeRules.queryNodes(node)).toEqual([
        (node.statements[2] as ts.VariableStatement).declarationList
          .declarations[0].initializer,
      ]);
    });

    it("matches IN operator", () => {
      const nodeRules = new NodeRules({
        nodeType: "ClassDeclaration",
        name: { in: ["User", "Account", "UserAccount"] },
      });
      expect(nodeRules.queryNodes(node)).toEqual([node.statements[1]]);
    });

    it("matches regexp IN array", () => {
      const nodeRules = new NodeRules({
        nodeType: "ClassDeclaration",
        name: { in: [/User/, /Account/] },
      });
      expect(nodeRules.queryNodes(node)).toEqual([node.statements[1]]);
    });

    it("matches NOT IN operator", () => {
      const nodeRules = new NodeRules({
        nodeType: "ClassDeclaration",
        name: { notIn: ["User", "Account"] },
      });
      expect(nodeRules.queryNodes(node)).toEqual([node.statements[1]]);
    });

    it("matches multiple nodes", () => {
      const nodeRules = new NodeRules({
        nodeType: "NewExpression",
        arguments: ["Murphy", 1, true],
      });
      expect(nodeRules.queryNodes(node)).toEqual([
        (node.statements[2] as ts.VariableStatement).declarationList
          .declarations[0].initializer,
      ]);
    });

    it("matches multiple nodes and evaluated value", () => {
      const nodeRules = new NodeRules({
        nodeType: "NewExpression",
        arguments: "{{arguments}}",
      });
      expect(nodeRules.queryNodes(node)).toEqual([
        (node.statements[2] as ts.VariableStatement).declarationList
          .declarations[0].initializer,
      ]);
    });

    it("matches nested selector", () => {
      const nodeRules = new NodeRules({
        nodeType: "VariableDeclaration",
        initializer: { nodeType: "NewExpression", expression: "UserAccount" },
      });
      expect(nodeRules.queryNodes(node)).toEqual([
        (node.statements[2] as ts.VariableStatement).declarationList
          .declarations[0],
      ]);
    });

    it("matches property", () => {
      const nodeRules = new NodeRules({
        nodeType: "NewExpression",
        arguments: { length: 3 },
      });
      expect(nodeRules.queryNodes(node)).toEqual([
        (node.statements[2] as ts.VariableStatement).declarationList
          .declarations[0].initializer,
      ]);
    });

    it("matches gte operator", () => {
      const nodeRules = new NodeRules({
        nodeType: "NewExpression",
        arguments: { length: { gte: 3 } },
      });
      expect(nodeRules.queryNodes(node)).toEqual([
        (node.statements[2] as ts.VariableStatement).declarationList
          .declarations[0].initializer,
      ]);
    });

    it("matches gt operator", () => {
      const nodeRules = new NodeRules({
        nodeType: "NewExpression",
        arguments: { length: { gt: 2 } },
      });
      expect(nodeRules.queryNodes(node)).toEqual([
        (node.statements[2] as ts.VariableStatement).declarationList
          .declarations[0].initializer,
      ]);
    });

    it("matches lte operator", () => {
      const nodeRules = new NodeRules({
        nodeType: "NewExpression",
        arguments: { length: { lte: 3 } },
      });
      expect(nodeRules.queryNodes(node)).toEqual([
        (node.statements[2] as ts.VariableStatement).declarationList
          .declarations[0].initializer,
      ]);
    });

    it("matches lt operator", () => {
      const nodeRules = new NodeRules({
        nodeType: "NewExpression",
        arguments: { length: { lt: 4 } },
      });
      expect(nodeRules.queryNodes(node)).toEqual([
        (node.statements[2] as ts.VariableStatement).declarationList
          .declarations[0].initializer,
      ]);
    });

    it("matches evaluated value", () => {
      const nodeRules = new NodeRules({
        nodeType: "VariableDeclaration",
        name: "{{type.typeName.escapedText.toLowerCase}}",
      });
      expect(nodeRules.queryNodes(node)).toEqual([
        (node.statements[2] as ts.VariableStatement).declarationList
          .declarations[0],
      ]);
    });

    it("matches evaluated value from base node", () => {
      const node = parseCode("foo.slice(foo.length - 2, foo.length - 1)");
      const nodeRules = new NodeRules({
        nodeType: "CallExpression",
        expression: {
          nodeType: "PropertyAccessExpression",
          name: "slice",
        },
        arguments: {
          length: 2,
          0: {
            nodeType: "BinaryExpression",
            left: {
              nodeType: "PropertyAccessExpression",
              expression: "{{expression.expression}}",
              name: "length",
            },
            operatorToken: {
              nodeType: "MinusToken",
            },
            right: {
              nodeType: "FirstLiteralToken",
            },
          },
          1: {
            nodeType: "BinaryExpression",
            left: {
              nodeType: "PropertyAccessExpression",
              expression: "{{expression.expression}}",
              name: "length",
            },
            operatorToken: {
              nodeType: "MinusToken",
            },
            right: {
              nodeType: "FirstLiteralToken",
            },
          },
        },
      });
      expect(nodeRules.queryNodes(node).length).toEqual(1);
    });

    it("matches multiple attributes", () => {
      const nodeRules = new NodeRules({
        nodeType: "NewExpression",
        arguments: { 0: "Murphy", 1: 1 },
      });
      expect(nodeRules.queryNodes(node)).toEqual([
        (node.statements[2] as ts.VariableStatement).declarationList
          .declarations[0].initializer,
      ]);
    });

    it("sets option includingSelf to false", () => {
      const nodeRules = new NodeRules({ nodeType: "ClassDeclaration" });
      expect(
        nodeRules.queryNodes(node.statements[1], { includingSelf: false })
      ).toEqual([]);

      expect(nodeRules.queryNodes(node.statements[1])).toEqual([
        node.statements[1],
      ]);
    });

    it("sets option stopAtFirstMatch to true", () => {
      const nodeRules = new NodeRules({ nodeType: "BinaryExpression" });
      expect(
        nodeRules.queryNodes(node, { stopAtFirstMatch: true }).length
      ).toEqual(1);

      expect(nodeRules.queryNodes(node).length).toEqual(3);
    });

    it("sets option recursive to false", () => {
      const nodeRules = new NodeRules({ nodeType: "ClassDeclaration" });
      expect(nodeRules.queryNodes(node, { recursive: false }).length).toEqual(
        0
      );

      expect(nodeRules.queryNodes(node).length).toEqual(1);
    });
  });
});
