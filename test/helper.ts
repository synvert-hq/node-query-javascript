import ts from "typescript";
const { parser } = require("../src/parser");
const Compiler = require("../src/compiler");

// Parse source code and return typescript SourceFile.
// @param code [String] source code.
// @return [ts.SourceFile] typescrpt SourceFile node.
export const parseCode = (code: string): ts.SourceFile => {
  return ts.createSourceFile("code.ts", code, ts.ScriptTarget.Latest, true);
};

// Parse nql string and return the Compiler.Expression.
// @param nql [String] nql string
// @return [Compiler.Expression]
export const parseExpression = (
  nql: string
): InstanceType<typeof Compiler.Expression> => {
  parser.parse(nql);
  return parser.yy.result;
};

// Assert the parser can parse the nsql string.
// @param nql [String] nql string
export const assertParser = (nql: string): void => {
  const expression = parseExpression(nql);
  expect(expression.toString()).toEqual(nql);
};
