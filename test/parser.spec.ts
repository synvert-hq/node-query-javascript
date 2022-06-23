import ts from "typescript";
import { assertParser, parseCode, parseNql } from "./helper";

describe("Parser", () => {
  describe("#toString", () => {
    it("parses node type", () => {
      const source = ".ExpressionStatement";
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
      const source =
        ".ClassDeclaration .MethodDefinition[key=constructor] .AssignmentExpression";
      assertParser(source);
    });

    it("parses child selector", () => {
      const source = ".ClassDeclaration > .MethodDefinition[key=constructor]";
      assertParser(source);
    });

    it("parses next sibling selector", () => {
      const source = ".MethodDefinition[key=constructor] + .MethodDefinition";
      assertParser(source);
    });

    it("parses subsequent sibling selector", () => {
      const source = ".MethodDefinition[key=constructor] ~ .MethodDefinition";
      assertParser(source);
    });

    it("parses has pseudo class selector", () => {
      const source =
        ".ClassDeclaration :has(.MethodDefinition[key=constructor])";
      assertParser(source);
    });

    it("parses not_has pseudo class selector", () => {
      const source =
        ".ClassDeclaration :has(.MethodDefinition[key=constructor])";
      assertParser(source);
    });

    it("parses multiple attributes", () => {
      const source = ".MemberExpression[object=module][property=exports]";
      assertParser(source);
    });

    it("parses nested selector", () => {
      const source =
        ".VariableDeclaration[initializer=.NewExpression[name=UserAccount]]";
      assertParser(source);
    });

    it("parses ^= operator", () => {
      const source = ".NewExpression[expression^=Acc]";
      assertParser(source);
    });

    it("parses $= operator", () => {
      const source = ".NewExpression[expression$=Acc]";
      assertParser(source);
    });

    it("parses *= operator", () => {
      const source = ".NewExpression[expression*=Acc]";
      assertParser(source);
    });

    it("parses != operator", () => {
      const source = ".NewExpression[arguments.length!=1]";
      assertParser(source);
    });

    it("parses >= operator", () => {
      const source = ".NewExpression[arguments.length>=1]";
      assertParser(source);
    });

    it("parses > operator", () => {
      const source = ".NewExpression[arguments.length>1]";
      assertParser(source);
    });

    it("parses <= operator", () => {
      const source = ".NewExpression[arguments.length<=1]";
      assertParser(source);
    });

    it("parses < operator", () => {
      const source = ".NewExpression[arguments.length<1]";
      assertParser(source);
    });

    it("parses =~ operator", () => {
      const source = ".MemberExpression[object=~/^$/]";
      assertParser(source);
    });

    it("parses !~ operator", () => {
      const source = ".MemberExpression[object!~/^$/]";
      assertParser(source);
    });

    it("parses IN array value", () => {
      const source = ".MethodDefinition[key IN (foo bar $)]";
      assertParser(source);
    });

    it("parses NOT IN array value", () => {
      const source = ".MethodDefinition[key NOT IN (/foo/ /bar/)]";
      assertParser(source);
    });

    it("parses empty array", () => {
      const source = ".MethodDefinition[key NOT IN ()]";
      assertParser(source);
    });

    it("parsers dynamic attribte", () => {
      const source =
        ".VariableDeclaration[name!={{type.typeName.escapedText.toLowerCase}}]";
      assertParser(source);
    });

    it("parses goto scope", () => {
      const source = ".ClassDeclaration members .MethodDefinition";
      assertParser(source);
    });

    it("parses * in key", () => {
      const source = ".ObjectPattern[properties.*.key=.Identifier]";
      assertParser(source);
    });

    it("parses ,", () => {
      const source = ".JSXOpeningElement, .JSXClosingElement";
      assertParser(source);
    });
  });

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

    it("matches by node type", () => {
      const expression = parseNql(".ClassDeclaration");
      expect(expression.queryNodes(node)).toEqual([node.statements[1]]);
    });

    it("matches node type and one attribute", () => {
      const expression = parseNql(".NewExpression[expression=UserAccount]");
      expect(expression.queryNodes(node)).toEqual([
        (node.statements[2] as ts.VariableStatement).declarationList
          .declarations[0].initializer,
      ]);
    });

    it("matches node type and nested attribute", () => {
      const expression = parseNql(
        ".NewExpression[expression.escapedText=UserAccount]"
      );
      expect(expression.queryNodes(node)).toEqual([
        (node.statements[2] as ts.VariableStatement).declarationList
          .declarations[0].initializer,
      ]);
    });

    it("matches string literal", () => {
      const expression = parseNql('.NewExpression[arguments.0="Murphy"]');
      expect(expression.queryNodes(node)).toEqual([
        (node.statements[2] as ts.VariableStatement).declarationList
          .declarations[0].initializer,
      ]);
    });

    it("matches number literal", () => {
      const expression = parseNql(".NewExpression[arguments.1=1]");
      expect(expression.queryNodes(node)).toEqual([
        (node.statements[2] as ts.VariableStatement).declarationList
          .declarations[0].initializer,
      ]);
    });

    it("matches boolean literal", () => {
      const expression = parseNql(".NewExpression[arguments.2=true]");
      expect(expression.queryNodes(node)).toEqual([
        (node.statements[2] as ts.VariableStatement).declarationList
          .declarations[0].initializer,
      ]);
    });

    it("matches start with operator", () => {
      const expression = parseNql(".NewExpression[expression^=User]");
      expect(expression.queryNodes(node)).toEqual([
        (node.statements[2] as ts.VariableStatement).declarationList
          .declarations[0].initializer,
      ]);
    });

    it("matches end with operator", () => {
      const expression = parseNql(".NewExpression[expression$=Account]");
      expect(expression.queryNodes(node)).toEqual([
        (node.statements[2] as ts.VariableStatement).declarationList
          .declarations[0].initializer,
      ]);
    });

    it("matches contain operator", () => {
      const expression = parseNql(".NewExpression[expression*=Acc]");
      expect(expression.queryNodes(node)).toEqual([
        (node.statements[2] as ts.VariableStatement).declarationList
          .declarations[0].initializer,
      ]);
    });

    it("matches not equal operator", () => {
      const expression = parseNql(".NewExpression[arguments.2!=false]");
      expect(expression.queryNodes(node)).toEqual([
        (node.statements[2] as ts.VariableStatement).declarationList
          .declarations[0].initializer,
      ]);
    });

    it("matches not equal nested selector", () => {
      const node = parseCode(`const z: Array<string | number> = ['a', 'b']`);
      const expression = parseNql(
        ".TypeReference[typeName.escapedText=Array][typeArguments.0!=.UnionType]"
      );
      expect(expression.queryNodes(node)).toEqual([]);
    });

    it("matches =~ operator", () => {
      const expression = parseNql(".NewExpression[expression=~/^User/]");
      expect(expression.queryNodes(node)).toEqual([
        (node.statements[2] as ts.VariableStatement).declarationList
          .declarations[0].initializer,
      ]);
    });

    it("matches !~ operator", () => {
      const expression = parseNql(".NewExpression[expression!~/^Account/]");
      expect(expression.queryNodes(node)).toEqual([
        (node.statements[2] as ts.VariableStatement).declarationList
          .declarations[0].initializer,
      ]);
    });

    it("matches IN operator", () => {
      const expression = parseNql(
        ".ClassDeclaration[name IN (User Account UserAccount)]"
      );
      expect(expression.queryNodes(node)).toEqual([node.statements[1]]);
    });

    it("matches regexp IN array", () => {
      const expression = parseNql(
        ".ClassDeclaration[name IN (/User/ /Account/)]"
      );
      expect(expression.queryNodes(node)).toEqual([node.statements[1]]);
    });

    it("matches NOT IN operator", () => {
      const expression = parseNql(
        ".ClassDeclaration[name NOT IN (User Account)]"
      );
      expect(expression.queryNodes(node)).toEqual([node.statements[1]]);
    });

    it("matches multiple nodes", () => {
      const expression = parseNql(
        '.NewExpression[arguments=("Murphy" 1 true)]'
      );
      expect(expression.queryNodes(node)).toEqual([
        (node.statements[2] as ts.VariableStatement).declarationList
          .declarations[0].initializer,
      ]);
    });

    it("matches * in attribute key", () => {
      const expression = parseNql(
        `.Constructor[parameters.*.name IN (name id active)]`
      );
      expect(expression.queryNodes(node)).toEqual([
        (node.statements[1] as ts.ClassDeclaration).members[3],
      ]);
    });

    it("matches multiple nodes and  evaluated value", () => {
      const expression = parseNql(".NewExpression[arguments={{arguments}}]");
      expect(expression.queryNodes(node)).toEqual([
        (node.statements[2] as ts.VariableStatement).declarationList
          .declarations[0].initializer,
      ]);
    });

    it("matches nested selector", () => {
      const expression = parseNql(
        ".VariableDeclaration[initializer=.NewExpression[expression=UserAccount]]"
      );
      expect(expression.queryNodes(node)).toEqual([
        (node.statements[2] as ts.VariableStatement).declarationList
          .declarations[0],
      ]);
    });

    it("matches property", () => {
      const expression = parseNql(".NewExpression[arguments.length=3]");
      expect(expression.queryNodes(node)).toEqual([
        (node.statements[2] as ts.VariableStatement).declarationList
          .declarations[0].initializer,
      ]);
    });

    it("matches >= operator", () => {
      const expression = parseNql(".NewExpression[arguments.length>=3]");
      expect(expression.queryNodes(node)).toEqual([
        (node.statements[2] as ts.VariableStatement).declarationList
          .declarations[0].initializer,
      ]);
    });

    it("matches > operator", () => {
      const expression = parseNql(".NewExpression[arguments.length>2]");
      expect(expression.queryNodes(node)).toEqual([
        (node.statements[2] as ts.VariableStatement).declarationList
          .declarations[0].initializer,
      ]);
    });

    it("matches <= operator", () => {
      const expression = parseNql(".NewExpression[arguments.length<=3]");
      expect(expression.queryNodes(node)).toEqual([
        (node.statements[2] as ts.VariableStatement).declarationList
          .declarations[0].initializer,
      ]);
    });

    it("matches < operator", () => {
      const expression = parseNql(".NewExpression[arguments.length<4]");
      expect(expression.queryNodes(node)).toEqual([
        (node.statements[2] as ts.VariableStatement).declarationList
          .declarations[0].initializer,
      ]);
    });

    it("matches evaluated value", () => {
      const expression = parseNql(
        ".VariableDeclaration[name={{type.typeName.escapedText.toLowerCase}}]"
      );
      expect(expression.queryNodes(node)).toEqual([
        (node.statements[2] as ts.VariableStatement).declarationList
          .declarations[0],
      ]);
    });

    it("matches multiple attributes", () => {
      const expression = parseNql(
        '.NewExpression[arguments.0="Murphy"][arguments.1=1]'
      );
      expect(expression.queryNodes(node)).toEqual([
        (node.statements[2] as ts.VariableStatement).declarationList
          .declarations[0].initializer,
      ]);
    });

    it("matches multiple selectors", () => {
      const expression = parseNql(".ClassDeclaration .Constructor");
      expect(expression.queryNodes(node)).toEqual([
        (node.statements[1] as ts.ClassDeclaration).members[3],
      ]);
    });

    it("matches child selectors", () => {
      const expression = parseNql(".ClassDeclaration > .Constructor");
      expect(expression.queryNodes(node)).toEqual([
        (node.statements[1] as ts.ClassDeclaration).members[3],
      ]);
    });

    it("matches next sibling node", () => {
      const expression = parseNql(
        ".PropertyDeclaration[name=name] + .PropertyDeclaration"
      );
      expect(expression.queryNodes(node)).toEqual([
        (node.statements[1] as ts.ClassDeclaration).members[1],
      ]);
    });

    it("matches subsequent sibling nodes", () => {
      const expression = parseNql(
        ".PropertyDeclaration[name=name] ~ .PropertyDeclaration"
      );
      expect(expression.queryNodes(node)).toEqual(
        (node.statements[1] as ts.ClassDeclaration).members.slice(1, 3)
      );
    });

    it("matches :has pseudo selector", () => {
      const expression = parseNql(".ClassDeclaration:has(.Constructor)");
      expect(expression.queryNodes(node)).toEqual([node.statements[1]]);
    });

    it("matches :not_has pseudo selector", () => {
      const expression = parseNql(".ClassDeclaration:not_has(.Constructor)");
      expect(expression.queryNodes(node)).toEqual([]);
    });

    it("matches multiple nodes", () => {
      const expression = parseNql(".ClassDeclaration > .PropertyDeclaration");
      expect(expression.queryNodes(node)).toEqual(
        (node.statements[1] as ts.ClassDeclaration).members.slice(0, 3)
      );
    });

    it("matches goto scope", () => {
      const expression = parseNql(
        ".ClassDeclaration members .PropertyDeclaration"
      );
      expect(expression.queryNodes(node)).toEqual(
        (node.statements[1] as ts.ClassDeclaration).members.slice(0, 3)
      );
    });

    it("matches ,", () => {
      const expression = parseNql(".InterfaceDeclaration, .ClassDeclaration");
      expect(expression.queryNodes(node)).toEqual(node.statements.slice(0, 2));
    });
  });
});
