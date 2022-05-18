import Adapter from './adapter';
import { Node, adapter as typescriptAdapter } from './typescript-adapter';
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
    parser.parse(nql)
    this.expression = parser.yy.result;
  }

  parse(node: Node): Node[] {
    return this.expression.queryNodes(node);
  }
}

export default NodeQuery;