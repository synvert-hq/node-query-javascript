import SyntaxError from "./syntax-error";
import Adapter from "./adapter";
import TypescriptAdapter from "./adapter/typescript";
import EspreeAdapter from "./adapter/espree";
import GonzalesPeAdapter from "./adapter/gonzales-pe";
import NodeRules from "./node-rules";
import { QueryOptions } from "./compiler/types";
const { parser } = require("./parser");
const { ExpressionList } = require("./compiler");

class NodeQuery<T> {
  private expression?: InstanceType<typeof ExpressionList>;
  private rules?: NodeRules<any>;

  private static adapter?: Adapter<any>;

  /**
   * Configure NodeQuery
   * @static
   * @param options {Object}
   * @param options.adapter {Adapter} - adapter, default is TypescriptAdapter
   */
  static configure(options: { adapter: Adapter<any> }) {
    this.adapter = options.adapter;
  }

  /**
   * Get the adapter.
   * @returns {Aapter} the adapter
   */
  static getAdapter(): Adapter<any> {
    if (!this.adapter) {
      this.adapter = new TypescriptAdapter();
    }
    return this.adapter!;
  }

  /**
   * Create a NodeQuery
   * @param nqlOrRules {string | object} Node query language string or node rules
   */
  constructor(nqlOrRules: string | object, { adapter }: { adapter: string }) {
    const adapterInstance = this.getAdapterInstance(adapter);
    if (typeof nqlOrRules === "string") {
      try {
        parser.yy.adapter = adapterInstance;
        parser.parse(nqlOrRules);
        this.expression = parser.yy.result;
      } catch (error) {
        if (
          error instanceof Error &&
          (error.message.startsWith("Lexical error") ||
            error.message.startsWith("Parse error"))
        ) {
          throw new SyntaxError(
            error.message.split("\n").slice(0, 3).join("\n")
          );
        } else {
          throw error;
        }
      }
    } else {
      this.rules = new NodeRules(nqlOrRules, { adapter: adapterInstance });
    }
  }

  /**
   * check if the node matches the nql or rules.
   * @param node {T} ast node
   * @returns {boolean} if the node matches the nql or rules.
   */
  matchNode(node: T): boolean {
    if (this.expression) {
      return this.expression.matchNode(node);
    } else if (this.rules) {
      return this.rules.matchNode(node);
    } else {
      return false;
    }
  }

  /**
   * Query options
   * @typedef {Object} QueryOptions
   * @property {boolean} [includingSelf = true] - If query the node itself
   * @property {boolean} [stopAtFirstMatch = false] - If stop at first match
   * @property {boolean} [recursive = true] - If recursively query child nodes
   */

  /**
   * Query matching nodes.
   * @param node {T} ast node
   * @param options {QueryOptions}
   * @option
   * @returns {T[]} matching ast nodes
   */
  queryNodes(node: T, options: QueryOptions = {}): T[] {
    if (this.expression) {
      return this.expression.queryNodes(node, options);
    } else if (this.rules) {
      return this.rules.queryNodes(node, options);
    } else {
      return [];
    }
  }

  private getAdapterInstance(adapter: string): Adapter<any> {
    switch (adapter) {
      case "espree":
        return new EspreeAdapter();
      case "typescript":
        return new TypescriptAdapter();
      case "gonzales-pe":
        return new GonzalesPeAdapter();
      default:
        throw new Error(`Adapter "${adapter}" is not supported.`);
    }
  }
}

export default NodeQuery;
