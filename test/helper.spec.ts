import * as Helper from "../src/helper";
import { Node } from "typescript";
import { parseCode } from "./test-helper";
import TypescriptAdapter from "../src/adapter/typescript";

describe("Compiler::Helper", () => {
  const adapter = new TypescriptAdapter();

  describe("getTargetNode", () => {
    const node = (parseCode("Array.isArray(foobar)").statements[0] as any)[
      "expression"
    ];

    it("checks nodeType", () => {
      const targetNode = Helper.getTargetNode<Node>(node, "nodeType", adapter);
      expect(targetNode).toEqual("CallExpression");
    });

    it("checks attribute", () => {
      const targetNode = Helper.getTargetNode<Node>(
        node,
        "expression.expression",
        adapter
      );
      expect(adapter.getSource(targetNode as Node)).toEqual("Array");
    });

    it("checks array by index", () => {
      const targetNode = Helper.getTargetNode<Node>(node, "arguments.0", adapter);
      expect(adapter.getSource(targetNode as Node)).toEqual("foobar");
    });

    it("checks array by method", () => {
      const targetNode = Helper.getTargetNode<Node>(node, "arguments.length", adapter);
      expect(targetNode).toEqual(1);
    });
  });

  describe("handleRecursiveChild", () => {
    const node = (parseCode("Array.isArray(foobar)").statements[0] as any)[
      "expression"
    ];

    it("recursively handle all children", () => {
      const children: string[] = [];
      Helper.handleRecursiveChild<Node>(node, adapter, (childNode) => {
        children.push(adapter.getNodeType(childNode));
      });
      expect(children).toEqual([
        "PropertyAccessExpression",
        "Identifier",
        "Identifier",
        "Identifier",
      ]);
    });
  });

  describe("evaluateNodeValue", () => {
    const node = (parseCode("Array.isArray(foobar)").statements[0] as any)[
      "expression"
    ];

    it("returns an evaluated string", () => {
      const value = Helper.evaluateNodeValue(node, "this.{{expression.name}}", adapter);
      expect(value).toEqual("this.isArray");
    });
  });

  describe("toString", () => {
    it("get source for null", () => {
      expect(Helper.toString(null, adapter)).toEqual("null");
    });

    it("get source for undefined", () => {
      expect(Helper.toString(undefined, adapter)).toEqual("undefined");
    });

    it("get source for boolean", () => {
      expect(Helper.toString(true, adapter)).toEqual("true");
      expect(Helper.toString(false, adapter)).toEqual("false");
    });

    it("get source for number", () => {
      expect(Helper.toString(0, adapter)).toEqual("0");
      expect(Helper.toString(1, adapter)).toEqual("1");
    });

    it("get source for string", () => {
      expect(Helper.toString("foobar", adapter)).toEqual("foobar");
    });

    it("get source for node", () => {
      const node = (parseCode("Array.isArray(foobar)").statements[0] as any)[
        "expression"
      ];
      expect(Helper.toString(node.expression.expression, adapter)).toEqual("Array");
    });

    it("get source for nodes", () => {
      const node = (parseCode("Array.isArray(foobar)").statements[0] as any)[
        "expression"
      ];
      expect(Helper.toString(node.arguments, adapter)).toEqual("(foobar)");
    });
  });
});
