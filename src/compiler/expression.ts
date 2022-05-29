import Selector from "./selector";

interface ExpressionParameters<T> {
  selector: Selector<T>;
  rest?: Expression<T>;
}

class Expression<T> {
  private selector: Selector<T>;
  private rest?: Expression<T>;

  constructor({ selector, rest }: ExpressionParameters<T>) {
    this.selector = selector;
    this.rest = rest;
  }

  // check if the node matches the expression.
  match(node: T) {
    return this.queryNodes(node).length !== 0;
  }

  queryNodes(node: T | T[]): T[] {
    const matchingNodes = this.selector.queryNodes(node);
    if (!this.rest) {
      return matchingNodes;
    }
    return matchingNodes.flatMap((matchingNode) =>
      this.findNodesByRest(matchingNode)
    );
  }

  toString(): string {
    const result = [];
    if (this.selector) {
      result.push(this.selector.toString());
    }
    if (this.rest) {
      result.push(this.rest.toString());
    }
    return result.join(" ");
  }

  private findNodesByRest(node: T | T[]): T[] {
    if (!this.rest) {
      return [];
    }
    return this.rest.queryNodes(node);
  }
}

export default Expression;
