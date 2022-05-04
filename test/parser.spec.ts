const { parse } = require('../src/parser');

const assertParser = (source: string): void => {
  const expression = parse(source);
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
      const source = '.MemberExpression[object=module][property=exports]';
      assertParser(source);
    });
  });
});