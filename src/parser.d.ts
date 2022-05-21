import { Expression } from "./compiler";

declare namespace parser {
  function parse(input: string): Expression;
}
