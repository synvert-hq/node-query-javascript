import ts from "typescript";
import { Node as AcornNode } from "acorn";
import * as espree from "@synvert-hq/espree";
import gonzales from "@synvert-hq/gonzales-pe";
import Adapter from "../src/adapter";
const { parser } = require("../src/parser");
const Compiler = require("../src/compiler");

// Parse source code and return typescript SourceFile.
// @param code [String] source code.
// @return [ts.SourceFile] typescript SourceFile node.
export const parseCode = (code: string): ts.SourceFile => {
  return ts.createSourceFile("code.ts", code, ts.ScriptTarget.Latest, true);
};

export const parseCodeByEspree = (code: string): AcornNode => {
  return espree.parse(code, {
    ecmaVersion: "latest",
    loc: true,
    sourceFile: "code.js",
  });
};

export const parseCodeByGonzalesPe = (code: string): gonzales.Node => {
  return gonzales.parse(code);
};

// Parse nql string and return the Compiler.Expression.
// @param nql [String] nql string
// @return [Compiler.Expression]
export const parseNql = (
  nql: string,
  adapter: Adapter<any>,
): InstanceType<typeof Compiler.ExpressionList> => {
  parser.yy.adapter = adapter;
  parser.parse(nql);
  return parser.yy.result;
};

// Assert the parser can parse the nql string.
// @param nql [String] nql string
export const assertParser = (nql: string, adapter: Adapter<any>): void => {
  const expression = parseNql(nql, adapter);
  expect(expression.toString()).toEqual(nql);
};
