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

  // check if the node matches the expression.
  match(node: T): boolean {
    return this.queryNodes(node).length !== 0;
  }

  queryNodes(node: T | T[]): T[] {
    const matchingNodes = this.expression.queryNodes(node);
    if (this.rest) {
      return matchingNodes.concat(this.rest.queryNodes(node));
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
