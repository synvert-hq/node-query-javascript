import NodeQuery from "./node-query";
import Adapter from "./adapter";
import EspreeAdapter from "./espree-adapter";
import TypescriptAdapter from "./typescript-adapter";
import SyntaxError from "./syntax-error";
import type { QueryOptions } from "./compiler/types";

export default NodeQuery;
export { Adapter, EspreeAdapter, TypescriptAdapter, SyntaxError, QueryOptions };
