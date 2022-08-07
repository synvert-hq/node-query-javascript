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

  queryNodes(node: T | T[], includingSelf = true): T[] {
    const matchingNodes = this.selector.queryNodes(node, includingSelf);
    if (!this.rest) {
      return matchingNodes;
    }
    return matchingNodes.flatMap((matchingNode) =>
      this.findNodesByRest(matchingNode, includingSelf)
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

  private findNodesByRest(node: T | T[], includingSelf = true): T[] {
    if (!this.rest) {
      return [];
    }
    return this.rest.queryNodes(node, includingSelf);
  }
}

export default Expression;
