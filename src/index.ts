import Adapter from './adapter';
import { Node, adapter as typescriptAdapter } from './typescript-adapter';
import SyntaxError from './syntax-error';
const { parser } = require('./parser');
const { Expression } = require('./compiler');

class NodeQuery {
  private expression: InstanceType<typeof Expression>;

  private static adapter: Adapter;

  static configure(adapter: Adapter) {
    this.adapter = adapter;
  }

  static getAdapter(): Adapter {
    return this.adapter || typescriptAdapter;
  }

  constructor(nql: string) {
    try {
      parser.parse(nql)
      this.expression = parser.yy.result;
    } catch (error) {
      if (error instanceof Error && error.message.startsWith("Parse error")) {
        throw new SyntaxError(error.message.split("\n").slice(0, 3).join("\n"));
      } else {
        throw error;
      }
    }
  }

  parse(node: Node): Node[] {
    return this.expression.queryNodes(node);
  }
}

export default NodeQuery;