import Expression from "./expression";
import { QueryOptions } from "./types";

interface ExpressionListParameters<T> {
  expression: Expression<T>;
  rest?: ExpressionList<T>;
}

class ExpressionList<T> {
  private expression: Expression<T>;
  private rest?: ExpressionList<T>;

  constructor({ expression, rest }: ExpressionListParameters<T>) {
    this.expression = expression;
    this.rest = rest;
  }

  matchNode(node: T): boolean {
    return this.queryNodes(node).length !== 0;
  }

  queryNodes(node: T | T[], options: QueryOptions = {}): T[] {
    const matchingNodes = this.expression.queryNodes(node, options);
    if (this.rest) {
      return matchingNodes.concat(this.rest.queryNodes(node, options));
    }
    return matchingNodes;
  }

  toString(): string {
    if (this.rest) {
      return `${this.expression}, ${this.rest.toString()}`;
    }
    return this.expression.toString();
  }
}

export default ExpressionList;
