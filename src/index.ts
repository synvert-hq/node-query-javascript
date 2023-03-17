import NodeQuery from "./node-query";
import Adapter from "./adapter";
import EspreeAdapter from "./adapter/espree";
import TypescriptAdapter from "./adapter/typescript";
import SyntaxError from "./syntax-error";
import type { QueryOptions } from "./compiler/types";

export default NodeQuery;
export { Adapter, EspreeAdapter, TypescriptAdapter, SyntaxError, QueryOptions };
