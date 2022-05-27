import BasicSelector from "./basic-selector";
import { getAdapter, getTargetNode, isNode } from "./helpers";

interface SelectorParameters<T> {
  gotoScope?: string;
  rest?: Selector<T>;
  basicSelector?: BasicSelector<T>;
  relationship?: string;
  pseudoClass?: string;
  pseudoSelector?: Selector<T>;
}

class Selector<T> {
  private gotoScope?: string;
  private rest?: Selector<T>;
  private basicSelector?: BasicSelector<T>;
  private relationship?: string;
  private pseudoClass?: string;
  private pseudoSelector?: Selector<T>;

  constructor({
    gotoScope,
    rest,
    basicSelector,
    relationship,
    pseudoClass,
    pseudoSelector,
  }: SelectorParameters<T>) {
    this.gotoScope = gotoScope;
    this.rest = rest;
    this.basicSelector = basicSelector;
    this.relationship = relationship;
    this.pseudoClass = pseudoClass;
    this.pseudoSelector = pseudoSelector;
  }

  // check if the node matches the selector.
  match(node: T): boolean {
    // node can be any value if it is a nested selector, e.g. .VariableDeclaration[initializer=.NewExpression[name=UserAccount]]
    return (
      isNode(node) &&
      (!this.basicSelector || this.basicSelector.match(node)) &&
      this.matchPseudoClass(node)
    );
  }

  queryNodes(node: T | T[]): T[] {
    if (this.relationship && !Array.isArray(node)) {
      return this.findNodesByRelationship(node);
    }

    if (Array.isArray(node)) {
      return node.flatMap((childNode) => this.queryNodes(childNode));
    }

    if (this.gotoScope) {
      const targetNode = getTargetNode(node, this.gotoScope);
      // TODO: handle if this.rest is undefined
      if (this.rest) {
        if (isNode(targetNode)) {
          // targetNode is Node or Node[]
          return this.rest.queryNodes(targetNode as T | T[]);
        }
      }
    }

    const nodes: T[] = [];
    if (this.match(node)) {
      nodes.push(node);
    }
    if (this.basicSelector) {
      this.handleRecursiveChild(node, (childNode) => {
        if (this.match(childNode)) {
          nodes.push(childNode);
        }
      });
    }
    return nodes;
  }

  toString(): string {
    const result = [];
    if (this.gotoScope) {
      result.push(`${this.gotoScope} `);
    }
    if (this.relationship) {
      result.push(`${this.relationship} `);
    }
    if (this.rest) {
      result.push(this.rest.toString());
    }
    if (this.basicSelector) {
      result.push(this.basicSelector.toString());
    }
    if (this.pseudoClass) {
      result.push(`:${this.pseudoClass}(${this.pseudoSelector})`);
    }
    return result.join("");
  }

  private findNodesByRelationship(node: T): T[] {
    const nodes: T[] = [];
    switch (this.relationship) {
      case ">":
        getAdapter<T>()
          .getChildren(node)
          .forEach((childNode) => {
            if (this.match(childNode)) {
              nodes.push(childNode);
            }
          });
        break;
      case "+":
        const nextSibling = getAdapter<T>().getSiblings(node)[0];
        if (nextSibling && this.match(nextSibling)) {
          nodes.push(nextSibling);
        }
        break;
      case "~":
        getAdapter<T>()
          .getSiblings(node)
          .forEach((siblingNode) => {
            if (this.match(siblingNode)) {
              nodes.push(siblingNode);
            }
          });
        break;
      default:
        break;
    }
    return nodes;
  }

  private handleRecursiveChild(node: T, handler: (childNode: T) => void): void {
    getAdapter<T>()
      .getChildren(node)
      .forEach((childNode) => {
        handler(childNode);
        this.handleRecursiveChild(childNode, handler);
      });
  }

  private matchPseudoClass(node: T): boolean {
    switch (this.pseudoClass) {
      case "has":
        return this.pseudoSelector!.queryNodes(node).length !== 0;
      case "not_has":
        return this.pseudoSelector!.queryNodes(node).length === 0;
      default:
        return true;
    }
  }
}

export default Selector;
