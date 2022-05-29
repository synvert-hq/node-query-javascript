import Adapter from "./adapter";
import SyntaxError from "./syntax-error";
import TypescriptAdapter from "./typescript-adapter";
const { parser } = require("./parser");
const { Expression } = require("./compiler");

const typescriptAdapter = new TypescriptAdapter();

class NodeQuery<T> {
  private expression: InstanceType<typeof Expression>;

  private static adapter?: Adapter<any>;

  static configure(adapter: Adapter<any>) {
    this.adapter = adapter;
  }

  static getAdapter(): Adapter<any> {
    return this.adapter || typescriptAdapter;
  }

  constructor(nql: string) {
    try {
      parser.parse(nql);
      this.expression = parser.yy.result;
    } catch (error) {
      if (
        error instanceof Error &&
        (error.message.startsWith("Lexical error") ||
          error.message.startsWith("Parse error"))
      ) {
        throw new SyntaxError(error.message.split("\n").slice(0, 3).join("\n"));
      } else {
        throw error;
      }
    }
  }

  parse(node: T): T[] {
    return this.expression.queryNodes(node);
  }
}

export default NodeQuery;
