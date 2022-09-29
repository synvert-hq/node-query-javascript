import BasicSelector from "./basic-selector";
import {
  getAdapter,
  handleRecursiveChild,
  getTargetNode,
  isNode,
} from "../helper";
import { QueryOptions } from "./types";
import NodeQuery from "../node-query";

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
  match(node: T, baseNode: T, operator: string = "="): boolean {
    // node can be any value if it is a nested selector, e.g. .VariableDeclaration[initializer=.NewExpression[name=UserAccount]]
    return (
      isNode(node) &&
      (!this.basicSelector ||
        (operator === "!="
          ? !this.basicSelector.match(node, baseNode)
          : this.basicSelector.match(node, baseNode))) &&
      this.matchPseudoClass(node)
    );
  }

  queryNodes(node: T | T[], options: QueryOptions = {}): T[] {
    options = Object.assign(
      { includingSelf: true, stopAtFirstMatch: false, recursive: true },
      options
    );

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

    if (options.includingSelf && !options.recursive) {
      return this.match(node, node) ? [node] : [];
    }

    const nodes: T[] = [];
    if (options.includingSelf && this.match(node, node)) {
      nodes.push(node);
      if (options.stopAtFirstMatch) {
        return nodes;
      }
    }
    if (this.basicSelector) {
      if (options.recursive) {
        handleRecursiveChild(node, (childNode) => {
          if (this.match(childNode, childNode)) {
            nodes.push(childNode);
            if (options.stopAtFirstMatch) {
              return { stop: true };
            }
          }
        });
      } else {
        NodeQuery.getAdapter()
          .getChildren(node)
          .forEach((childNode) => {
            if (this.match(childNode, childNode)) {
              nodes.push(childNode);
              if (options.stopAtFirstMatch) {
                return { stop: true };
              }
            }
          });
      }
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
            if (this.match(childNode, childNode)) {
              nodes.push(childNode);
            }
          });
        break;
      case "+":
        const nextSibling = getAdapter<T>().getSiblings(node)[0];
        if (nextSibling && this.match(nextSibling, nextSibling)) {
          nodes.push(nextSibling);
        }
        break;
      case "~":
        getAdapter<T>()
          .getSiblings(node)
          .forEach((siblingNode) => {
            if (this.match(siblingNode, siblingNode)) {
              nodes.push(siblingNode);
            }
          });
        break;
      default:
        break;
    }
    return nodes;
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
