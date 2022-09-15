import Selector from "./selector";
import { QueryOptions } from "./types";

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

  queryNodes(node: T | T[], options: QueryOptions = {}): T[] {
    const matchingNodes = this.selector.queryNodes(node, options);
    if (!this.rest) {
      return matchingNodes;
    }
    return matchingNodes.flatMap((matchingNode) =>
      this.findNodesByRest(matchingNode, options)
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

  private findNodesByRest(node: T | T[], options = {}): T[] {
    if (!this.rest) {
      return [];
    }
    return this.rest.queryNodes(node, options);
  }
}

export default Expression;
