const { parse } = require('../src/parser');

describe('Parser', () => {
  test("parse", () => {
    parse(".ExpressionStatement[directive='use strict']")
  });
});