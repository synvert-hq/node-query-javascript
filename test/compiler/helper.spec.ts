import * as Helper from "../../src/compiler/helper";
import { Node } from "typescript";
import { parseCode } from "../test-helper";

describe("Compiler::Helper", () => {
  describe("getTargetNode", () => {
    const node = (parseCode("Array.isArray(foobar)").statements[0] as any)['expression'];

    it("checks nodeType", () => {
      const targetNode = Helper.getTargetNode<Node>(node, "nodeType");
      expect(targetNode).toEqual("CallExpression");
    });

    it("checks attribute", () => {
      const targetNode = Helper.getTargetNode<Node>(node, "expression.expression");
      expect(Helper.getAdapter().getSource(targetNode)).toEqual("Array");
    });

    it("checks array by index", () => {
      const targetNode = Helper.getTargetNode<Node>(node, "arguments.0");
      expect(Helper.getAdapter().getSource(targetNode)).toEqual("foobar");
    });

    it("checks array by method", () => {
      const targetNode = Helper.getTargetNode<Node>(node, "arguments.length");
      expect(targetNode).toEqual(1);
    });
  });

  describe("handleRecursiveChild", () => {
    const node = (parseCode("Array.isArray(foobar)").statements[0] as any)['expression'];

    it("recursively handle all children", () => {
      const children: string[] = [];
      Helper.handleRecursiveChild<Node>(node, (childNode) => {
        children.push(Helper.getAdapter().getNodeType(childNode));
      });
      expect(children).toEqual(["PropertyAccessExpression", "Identifier", "Identifier", "Identifier"]);
    });
  });

  describe("evaluateNodeValue", () => {
    const node = (parseCode("Array.isArray(foobar)").statements[0] as any)['expression'];

    it("returns an evaluated string", () => {
      const value = Helper.evaluateNodeValue(node, "this.{{expression.name}}");
      expect(value).toEqual("this.isArray");
    });
  });
});