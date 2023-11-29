import ts from "typescript";
import { assertParser, parseCode, parseNql } from "./test-helper";
import TypescriptAdapter from "../src/adapter/typescript";

describe("Parser", () => {
  const adapter = new TypescriptAdapter();

  describe("#toString", () => {
    it("parses node type", () => {
      const source = ".ExpressionStatement";
      assertParser(source, adapter);
    });

    it("parses negative number", () => {
      const source = ".NewExpression[arguments.1=-1]";
      assertParser(source, adapter);
    });

    it("parses one selector", () => {
      const source = '.ExpressionStatement[directive="use strict"]';
      assertParser(source, adapter);
    });

    it("parses two selectors", () => {
      const source = ".ClassDeclaration .MethodDefinition[key=constructor]";
      assertParser(source, adapter);
    });

    it("parses three selectors", () => {
      const source =
        ".ClassDeclaration .MethodDefinition[key=constructor] .AssignmentExpression";
      assertParser(source, adapter);
    });

    it("parses child selector", () => {
      const source = ".ClassDeclaration > .MethodDefinition[key=constructor]";
      assertParser(source, adapter);
    });

    it("parses next sibling selector", () => {
      const source = ".MethodDefinition[key=constructor] + .MethodDefinition";
      assertParser(source, adapter);
    });

    it("parses subsequent sibling selector", () => {
      const source = ".MethodDefinition[key=constructor] ~ .MethodDefinition";
      assertParser(source, adapter);
    });

    it("parses has pseudo class selector", () => {
      const source =
        ".ClassDeclaration :has(.MethodDefinition[key=constructor])";
      assertParser(source, adapter);
    });

    it("parses not_has pseudo class selector", () => {
      const source =
        ".ClassDeclaration :has(.MethodDefinition[key=constructor])";
      assertParser(source, adapter);
    });

    it("parses multiple attributes", () => {
      const source = ".MemberExpression[object=module][property=exports]";
      assertParser(source, adapter);
    });

    it("parses nested selector", () => {
      const source =
        ".VariableDeclaration[initializer=.NewExpression[name=UserAccount]]";
      assertParser(source, adapter);
    });

    it("parses ^= operator", () => {
      const source = ".NewExpression[expression^=Acc]";
      assertParser(source, adapter);
    });

    it("parses $= operator", () => {
      const source = ".NewExpression[expression$=Acc]";
      assertParser(source, adapter);
    });

    it("parses *= operator", () => {
      const source = ".NewExpression[expression*=Acc]";
      assertParser(source, adapter);
    });

    it("parses != operator", () => {
      const source = ".NewExpression[arguments.length!=1]";
      assertParser(source, adapter);
    });

    it("parses >= operator", () => {
      const source = ".NewExpression[arguments.length>=1]";
      assertParser(source, adapter);
    });

    it("parses > operator", () => {
      const source = ".NewExpression[arguments.length>1]";
      assertParser(source, adapter);
    });

    it("parses <= operator", () => {
      const source = ".NewExpression[arguments.length<=1]";
      assertParser(source, adapter);
    });

    it("parses < operator", () => {
      const source = ".NewExpression[arguments.length<1]";
      assertParser(source, adapter);
    });

    it("parses =~ operator", () => {
      const source = ".MemberExpression[object=~/^$/]";
      assertParser(source, adapter);
    });

    it("parses !~ operator", () => {
      const source = ".MemberExpression[object!~/^$/]";
      assertParser(source, adapter);
    });

    it("parses NOT INCLUDES value", () => {
      const source = '.NewExpression[arguments NOT INCLUDES "Murphy"]';
      assertParser(source, adapter);
    });

    it("parses INCLUDES value", () => {
      const source = '.NewExpression[arguments INCLUDES "Murphy"]';
      assertParser(source, adapter);
    });

    it("parses NOT IN array value", () => {
      const source = ".MethodDefinition[key NOT IN (/foo/ /bar/)]";
      assertParser(source, adapter);
    });

    it("parses IN array value", () => {
      const source = ".MethodDefinition[key IN (foo bar $)]";
      assertParser(source, adapter);
    });

    it("parses empty array", () => {
      const source = ".MethodDefinition[key NOT IN ()]";
      assertParser(source, adapter);
    });

    it("parsers evaluated value", () => {
      const source =
        '.VariableDeclaration[name!="{{type.typeName.escapedText.toLowerCase}}"]';
      assertParser(source, adapter);
    });

    it("parses goto scope", () => {
      const source = ".ClassDeclaration members .MethodDefinition";
      assertParser(source, adapter);
    });

    it("parses * in key", () => {
      const source = ".ObjectPattern[properties.*.key=.Identifier]";
      assertParser(source, adapter);
    });

    it("parses ,", () => {
      const source = ".JSXOpeningElement, .JSXClosingElement";
      assertParser(source, adapter);
    });

    it("parses :first-child", () => {
      const source = ".MethodDefinition:first-child";
      assertParser(source, adapter);
    });

    it("parses :last-child", () => {
      const source = ".MethodDefinition:last-child";
      assertParser(source, adapter);
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

    it("matches node type", () => {
      const expression = parseNql(".ClassDeclaration", adapter);
      expect(expression.queryNodes(node)).toEqual([node.statements[1]]);
    });

    it("matches node type and one attribute", () => {
      const expression = parseNql(".NewExpression[expression=UserAccount]", adapter);
      expect(expression.queryNodes(node)).toEqual([
        (node.statements[2] as ts.VariableStatement).declarationList
          .declarations[0].initializer,
      ]);
    });

    it("matches node type and nested attribute", () => {
      const expression = parseNql(
        ".NewExpression[expression.escapedText=UserAccount]", adapter
      );
      expect(expression.queryNodes(node)).toEqual([
        (node.statements[2] as ts.VariableStatement).declarationList
          .declarations[0].initializer,
      ]);
    });

    it("matches string literal", () => {
      const expression = parseNql('.NewExpression[arguments.0="Murphy"]', adapter);
      expect(expression.queryNodes(node)).toEqual([
        (node.statements[2] as ts.VariableStatement).declarationList
          .declarations[0].initializer,
      ]);
    });

    it("matches number literal", () => {
      const expression = parseNql(".NewExpression[arguments.1=1]", adapter);
      expect(expression.queryNodes(node)).toEqual([
        (node.statements[2] as ts.VariableStatement).declarationList
          .declarations[0].initializer,
      ]);
    });

    it("matches boolean literal", () => {
      const expression = parseNql(".NewExpression[arguments.-1=true]", adapter);
      expect(expression.queryNodes(node)).toEqual([
        (node.statements[2] as ts.VariableStatement).declarationList
          .declarations[0].initializer,
      ]);
    });

    it("matches ^= operator", () => {
      const expression = parseNql(".NewExpression[expression^=User]", adapter);
      expect(expression.queryNodes(node)).toEqual([
        (node.statements[2] as ts.VariableStatement).declarationList
          .declarations[0].initializer,
      ]);
    });

    it("matches $= operator", () => {
      const expression = parseNql(".NewExpression[expression$=Account]", adapter);
      expect(expression.queryNodes(node)).toEqual([
        (node.statements[2] as ts.VariableStatement).declarationList
          .declarations[0].initializer,
      ]);
    });

    it("matches *= operator", () => {
      const expression = parseNql(".NewExpression[expression*=Acc]", adapter);
      expect(expression.queryNodes(node)).toEqual([
        (node.statements[2] as ts.VariableStatement).declarationList
          .declarations[0].initializer,
      ]);
    });

    it("matches != operator", () => {
      const expression = parseNql(".NewExpression[arguments.-1!=false]", adapter);
      expect(expression.queryNodes(node)).toEqual([
        (node.statements[2] as ts.VariableStatement).declarationList
          .declarations[0].initializer,
      ]);
    });

    it("matches != nested selector", () => {
      const node = parseCode(`const z: Array<string | number> = ['a', 'b']`);
      const expression = parseNql(
        ".TypeReference[typeName.escapedText=Array][typeArguments.0!=.UnionType]", adapter
      );
      expect(expression.queryNodes(node)).toEqual([]);
    });

    it("matches =~ operator", () => {
      const expression = parseNql(".NewExpression[expression=~/^User/]", adapter);
      expect(expression.queryNodes(node)).toEqual([
        (node.statements[2] as ts.VariableStatement).declarationList
          .declarations[0].initializer,
      ]);
    });

    it("matches !~ operator", () => {
      const expression = parseNql(".NewExpression[expression!~/^Account/]", adapter);
      expect(expression.queryNodes(node)).toEqual([
        (node.statements[2] as ts.VariableStatement).declarationList
          .declarations[0].initializer,
      ]);
    });

    it("matches INCLUDES operator", () => {
      const expression = parseNql(
        '.NewExpression[arguments INCLUDES "Murphy"]', adapter
      );
      expect(expression.queryNodes(node)).toEqual([
        (node.statements[2] as ts.VariableStatement).declarationList
          .declarations[0].initializer,
      ]);
    });

    it("matches INCLUDES operator with a selector", () => {
      const expression = parseNql(
        '.NewExpression[arguments INCLUDES .StringLiteral[text="Murphy"]]', adapter
      );
      expect(expression.queryNodes(node)).toEqual([
        (node.statements[2] as ts.VariableStatement).declarationList
          .declarations[0].initializer,
      ]);
    });

    it("matches NOT INCLUDES operator", () => {
      const expression = parseNql(
        '.NewExpression[arguments NOT INCLUDES "Richard"]', adapter
      );
      expect(expression.queryNodes(node)).toEqual([
        (node.statements[2] as ts.VariableStatement).declarationList
          .declarations[0].initializer,
      ]);
    });

    it("matches NOT INCLUDES operator with a selector", () => {
      const expression = parseNql(
        '.NewExpression[arguments NOT INCLUDES .StringLiteral[text="Richard"]]', adapter
      );
      expect(expression.queryNodes(node)).toEqual([
        (node.statements[2] as ts.VariableStatement).declarationList
          .declarations[0].initializer,
      ]);
    });

    it("matches IN operator", () => {
      const expression = parseNql(
        ".ClassDeclaration[name IN (User Account UserAccount)]", adapter
      );
      expect(expression.queryNodes(node)).toEqual([node.statements[1]]);
    });

    it("matches regexp IN array", () => {
      const expression = parseNql(
        ".ClassDeclaration[name IN (/User/ /Account/)]", adapter
      );
      expect(expression.queryNodes(node)).toEqual([node.statements[1]]);
    });

    it("matches NOT IN operator", () => {
      const expression = parseNql(
        ".ClassDeclaration[name NOT IN (User Account)]", adapter
      );
      expect(expression.queryNodes(node)).toEqual([node.statements[1]]);
    });

    it("matches multiple nodes", () => {
      const expression = parseNql(
        '.NewExpression[arguments=("Murphy" 1 true)]', adapter
      );
      expect(expression.queryNodes(node)).toEqual([
        (node.statements[2] as ts.VariableStatement).declarationList
          .declarations[0].initializer,
      ]);
    });

    it("matches * in attribute key", () => {
      const expression = parseNql(
        `.Constructor[parameters.*.name IN (name id active)]`, adapter
      );
      expect(expression.queryNodes(node)).toEqual([
        (node.statements[1] as ts.ClassDeclaration).members[3],
      ]);
    });

    it("matches multiple nodes and evaluated value", () => {
      const expression = parseNql(".NewExpression[arguments='{{arguments}}']", adapter);
      expect(expression.queryNodes(node)).toEqual([
        (node.statements[2] as ts.VariableStatement).declarationList
          .declarations[0].initializer,
      ]);
    });

    it("matches nested selector", () => {
      const expression = parseNql(
        ".VariableDeclaration[initializer=.NewExpression[expression=UserAccount]]", adapter
      );
      expect(expression.queryNodes(node)).toEqual([
        (node.statements[2] as ts.VariableStatement).declarationList
          .declarations[0],
      ]);
    });

    it("matches property", () => {
      const expression = parseNql(".NewExpression[arguments.length=3]", adapter);
      expect(expression.queryNodes(node)).toEqual([
        (node.statements[2] as ts.VariableStatement).declarationList
          .declarations[0].initializer,
      ]);
    });

    it("matches >= operator", () => {
      const expression = parseNql(".NewExpression[arguments.length>=3]", adapter);
      expect(expression.queryNodes(node)).toEqual([
        (node.statements[2] as ts.VariableStatement).declarationList
          .declarations[0].initializer,
      ]);
    });

    it("matches > operator", () => {
      const expression = parseNql(".NewExpression[arguments.length>2]", adapter);
      expect(expression.queryNodes(node)).toEqual([
        (node.statements[2] as ts.VariableStatement).declarationList
          .declarations[0].initializer,
      ]);
    });

    it("matches <= operator", () => {
      const expression = parseNql(".NewExpression[arguments.length<=3]", adapter);
      expect(expression.queryNodes(node)).toEqual([
        (node.statements[2] as ts.VariableStatement).declarationList
          .declarations[0].initializer,
      ]);
    });

    it("matches < operator", () => {
      const expression = parseNql(".NewExpression[arguments.length<4]", adapter);
      expect(expression.queryNodes(node)).toEqual([
        (node.statements[2] as ts.VariableStatement).declarationList
          .declarations[0].initializer,
      ]);
    });

    it("matches evaluated value", () => {
      const expression = parseNql(
        ".VariableDeclaration[name='{{type.typeName.escapedText.toLowerCase}}']", adapter
      );
      expect(expression.queryNodes(node)).toEqual([
        (node.statements[2] as ts.VariableStatement).declarationList
          .declarations[0],
      ]);
    });

    it("matches evaluated value from base node", () => {
      const node = parseCode("foo.slice(foo.length - 2, foo.length - 1)");
      const expression = parseNql(
        `.CallExpression[expression=.PropertyAccessExpression[name=slice]][arguments.0=.BinaryExpression[left=.PropertyAccessExpression[expression="{{expression.expression}}"][name=length]][operatorToken=.MinusToken][right=.FirstLiteralToken]][arguments.1=.BinaryExpression[left=.PropertyAccessExpression[expression="{{expression.expression}}"][name=length]][operatorToken=.MinusToken][right=.FirstLiteralToken]][arguments.length=2]`, adapter
      );
      expect(expression.queryNodes(node).length).toEqual(1);
    });

    it("matches multiple attributes", () => {
      const expression = parseNql(
        '.NewExpression[arguments.0="Murphy"][arguments.1=1]', adapter
      );
      expect(expression.queryNodes(node)).toEqual([
        (node.statements[2] as ts.VariableStatement).declarationList
          .declarations[0].initializer,
      ]);
    });

    it("matches multiple selectors", () => {
      const expression = parseNql(".ClassDeclaration .Constructor", adapter);
      expect(expression.queryNodes(node)).toEqual([
        (node.statements[1] as ts.ClassDeclaration).members[3],
      ]);
    });

    it("matches child selectors", () => {
      const expression = parseNql(".ClassDeclaration > .Constructor", adapter);
      expect(expression.queryNodes(node)).toEqual([
        (node.statements[1] as ts.ClassDeclaration).members[3],
      ]);
    });

    it("matches next sibling node", () => {
      const expression = parseNql(
        ".PropertyDeclaration[name=name] + .PropertyDeclaration", adapter
      );
      expect(expression.queryNodes(node)).toEqual([
        (node.statements[1] as ts.ClassDeclaration).members[1],
      ]);
    });

    it("matches subsequent sibling nodes", () => {
      const expression = parseNql(
        ".PropertyDeclaration[name=name] ~ .PropertyDeclaration", adapter
      );
      expect(expression.queryNodes(node)).toEqual(
        (node.statements[1] as ts.ClassDeclaration).members.slice(1, 3)
      );
    });

    it("matches :has pseudo selector", () => {
      const expression = parseNql(".ClassDeclaration:has(.Constructor)", adapter);
      expect(expression.queryNodes(node)).toEqual([node.statements[1]]);
    });

    it("matches :not_has pseudo selector", () => {
      const expression = parseNql(".ClassDeclaration:not_has(.Constructor)", adapter);
      expect(expression.queryNodes(node)).toEqual([]);
    });

    it("matches multiple nodes", () => {
      const expression = parseNql(".ClassDeclaration > .PropertyDeclaration", adapter);
      expect(expression.queryNodes(node)).toEqual(
        (node.statements[1] as ts.ClassDeclaration).members.slice(0, 3)
      );
    });

    it("matches goto scope", () => {
      const expression = parseNql(
        ".ClassDeclaration members .PropertyDeclaration", adapter
      );
      expect(expression.queryNodes(node)).toEqual(
        (node.statements[1] as ts.ClassDeclaration).members.slice(0, 3)
      );
    });

    it("matches ,", () => {
      const expression = parseNql(".InterfaceDeclaration, .ClassDeclaration", adapter);
      expect(expression.queryNodes(node)).toEqual(node.statements.slice(0, 2));
    });

    it("matches first node", () => {
      let expression = parseNql(".PropertyDeclaration:first-child", adapter);
      expect(expression.queryNodes(node)).toEqual(
        (node.statements[1] as ts.ClassDeclaration).members.slice(0, 1)
      );

      expression = parseNql(
        ".ClassDeclaration > .PropertyDeclaration:first-child", adapter
      );
      expect(expression.queryNodes(node)).toEqual(
        (node.statements[1] as ts.ClassDeclaration).members.slice(0, 1)
      );

      expression = parseNql(`.FunctionDeclaration:first-child`, adapter);
      // compare length to avoid equal [undefined]
      expect(expression.queryNodes(node).length).toEqual(0);
    });

    it("matches last node", () => {
      let expression = parseNql(".PropertyDeclaration:last-child", adapter);
      expect(expression.queryNodes(node)).toEqual(
        (node.statements[1] as ts.ClassDeclaration).members.slice(2, 3)
      );

      expression = parseNql(
        ".ClassDeclaration > .PropertyDeclaration:last-child", adapter
      );
      expect(expression.queryNodes(node)).toEqual(
        (node.statements[1] as ts.ClassDeclaration).members.slice(2, 3)
      );

      expression = parseNql(`.FunctionDeclaration:last-child`, adapter);
      // compare length to avoid equal [undefined]
      expect(expression.queryNodes(node).length).toEqual(0);
    });

    it("sets option includingSelf to false", () => {
      const expression = parseNql(".ClassDeclaration", adapter);
      expect(
        expression.queryNodes(node.statements[1], { includingSelf: false })
      ).toEqual([]);

      expect(expression.queryNodes(node.statements[1])).toEqual([
        node.statements[1],
      ]);
    });

    it("sets option stopAtFirstMatch to true", () => {
      const expression = parseNql(".BinaryExpression", adapter);
      expect(
        expression.queryNodes(node, { stopAtFirstMatch: true }).length
      ).toEqual(1);

      expect(expression.queryNodes(node).length).toEqual(3);
    });

    it("sets option recursive to false", () => {
      const expression = parseNql(".ClassDeclaration", adapter);
      expect(expression.queryNodes(node, { recursive: false }).length).toEqual(
        0
      );

      expect(expression.queryNodes(node).length).toEqual(1);
    });
  });
});
