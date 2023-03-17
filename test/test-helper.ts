import { Node } from "acorn";
import ts from "typescript";
import * as espree from "@xinminlabs/espree";
const { parser } = require("../src/parser");
const Compiler = require("../src/compiler");

// Parse source code and return typescript SourceFile.
// @param code [String] source code.
// @return [ts.SourceFile] typescrpt SourceFile node.
export const parseCode = (code: string): ts.SourceFile => {
  return ts.createSourceFile("code.ts", code, ts.ScriptTarget.Latest, true);
};

export const parseCodeByEspree = (code: string): any => {
  return espree.parse(code, {
    ecmaVersion: "latest",
    loc: true,
    sourceFile: "code.js",
  });
};

// Parse nql string and return the Compiler.Expression.
// @param nql [String] nql string
// @return [Compiler.Expression]
export const parseNql = (
  nql: string
): InstanceType<typeof Compiler.ExpressionList> => {
  parser.parse(nql);
  return parser.yy.result;
};

// Assert the parser can parse the nsql string.
// @param nql [String] nql string
export const assertParser = (nql: string): void => {
  const expression = parseNql(nql);
  expect(expression.toString()).toEqual(nql);
};
