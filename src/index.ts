import { Node } from './typescript-adapter';
const { parser } = require('./parser');
const { Expression } = require('./compiler');

class NodeQuery {
  private expression: InstanceType<typeof Expression>;

  constructor(nql: string) {
    parser.parse(nql)
    this.expression = parser.yy.result;
  }

  parse(node: Node): Node[] {
    return this.expression.queryNodes(node);
  }
}

export default NodeQuery;