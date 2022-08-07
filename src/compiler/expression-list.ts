import Expression from "./expression";

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

  queryNodes(node: T | T[], includingSelf = true): T[] {
    const matchingNodes = this.expression.queryNodes(node, includingSelf);
    if (this.rest) {
      return matchingNodes.concat(this.rest.queryNodes(node, includingSelf));
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
