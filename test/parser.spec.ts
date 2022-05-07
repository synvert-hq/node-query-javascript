import ts from 'typescript';
const { assertParser, parseCode, parseExpression } = require('./helper');

describe('Parser', () => {
  describe('#toString', () => {
    it("parses node type", () => {
      const source = '.ExpressionStatement';
      assertParser(source);
    });

    it("parses one selector", () => {
      const source = '.ExpressionStatement[directive="use strict"]';
      assertParser(source);
    });

    it("parses two selectors", () => {
      const source = ".ClassDeclaration .MethodDefinition[key=constructor]";
      assertParser(source);
    });

    it("parses three selectors", () => {
      const source = ".ClassDeclaration .MethodDefinition[key=constructor] .AssignmentExpression";
      assertParser(source);
    });

    it("parses child selector", () => {
      const source = ".ClassDeclaration > .MethodDefinition[key=constructor]";
      assertParser(source);
    });

    it("parses multiple attributes", () => {
      const source = '.MemberExpression[object=module][property=exports]';
      assertParser(source);
    });

    it("parses array value", () => {
      const source = ".MethodDefinition[key IN (foo bar)]"
      assertParser(source);
    });
  });

  describe("#query_nodes", () => {
    const node = parseCode( `
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

    it("matches by node type", () => {
      const expression = parseExpression(".ClassDeclaration");
      expect(expression.queryNodes(node)).toEqual([node.statements[1]]);
    });

    it("matches node type and one attribute", () => {
      const expression = parseExpression(".NewExpression[expression=UserAccount]")
      expect(expression.queryNodes(node)).toEqual([(node.statements[2] as ts.VariableStatement).declarationList.declarations[0].initializer]);
    });

    it("matches node type and nested attribute", () => {
      const expression = parseExpression(".NewExpression[expression.escapedText=UserAccount]")
      expect(expression.queryNodes(node)).toEqual([(node.statements[2] as ts.VariableStatement).declarationList.declarations[0].initializer]);
    });

    it("matches string literal", () => {
      const expression = parseExpression('.NewExpression[arguments.0="Murphy"]')
      expect(expression.queryNodes(node)).toEqual([(node.statements[2] as ts.VariableStatement).declarationList.declarations[0].initializer]);
    });

    it("matches number literal", () => {
      const expression = parseExpression('.NewExpression[arguments.1=1]')
      expect(expression.queryNodes(node)).toEqual([(node.statements[2] as ts.VariableStatement).declarationList.declarations[0].initializer]);
    });

    it("matches boolean literal", () => {
      const expression = parseExpression('.NewExpression[arguments.2=true]')
      expect(expression.queryNodes(node)).toEqual([(node.statements[2] as ts.VariableStatement).declarationList.declarations[0].initializer]);
    });

    it("matches not equal operator", () => {
      const expression = parseExpression('.NewExpression[arguments.2!=false]')
      expect(expression.queryNodes(node)).toEqual([(node.statements[2] as ts.VariableStatement).declarationList.declarations[0].initializer]);
    });

    it("matches IN operator", () => {
      const expression = parseExpression('.ClassDeclaration[name IN (User Account UserAccount)]')
      expect(expression.queryNodes(node)).toEqual([node.statements[1]]);
    });

    it("matches multiple attributes", () => {
      const expression = parseExpression('.NewExpression[arguments.0="Murphy"][arguments.1=1]')
      expect(expression.queryNodes(node)).toEqual([(node.statements[2] as ts.VariableStatement).declarationList.declarations[0].initializer]);
    });

    it("matches multiple selectors", () => {
      const expression = parseExpression(".ClassDeclaration .Constructor")
      expect(expression.queryNodes(node)).toEqual([(node.statements[1] as ts.ClassDeclaration).members[3]]);
    });

    it("matches child selectors", () => {
      const expression = parseExpression(".ClassDeclaration > .Constructor")
      expect(expression.queryNodes(node)).toEqual([(node.statements[1] as ts.ClassDeclaration).members[3]]);
    });
  });
});