const { parser } = require('../src/parser');

const assertParser = (source: string): void => {
  parser.parse(source);
  const expression = parser.yy.result;
  expect(expression.toString()).toEqual(source);
}

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

    it("parses multiple attributes", () => {
      const source = '.MemberExpression[object=module][property=exports]';
      assertParser(source);
    });
  });
});