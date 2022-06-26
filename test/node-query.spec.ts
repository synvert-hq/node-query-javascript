import { Node } from "typescript";
import NodeQuery from "../src/node-query";
import TypescriptAdapter from "../src/typescript-adapter";
import SyntaxError from "../src/syntax-error";
import { parseCode } from "./test-helper";

describe("NodeQuery", () => {
  it("configure adapter", () => {
    const typescriptAdapter = new TypescriptAdapter();
    NodeQuery.configure({ adapter: typescriptAdapter });
    expect(NodeQuery<Node>.getAdapter()).toEqual(typescriptAdapter);
  });

  describe("parse", () => {
    const node = parseCode(`
      interface User {
        name: string;
        id: number;
        active: boolean;
      }

      class UserAccount {
        name: string;
        id: number;
        active: boolean;

        constructor(name: string, id: number, active: boolean) {
          this.name = name;
          this.id = id;
          this.active = active;
        }
      }

      const user: User = new UserAccount("Murphy", 1, true);
    `);

    it("parses nodes", () => {
      const nodeQuery = new NodeQuery<Node>(
        ".ClassDeclaration .PropertyDeclaration"
      );
      expect(nodeQuery.parse(node).length).toEqual(3);
    });

    it("raises SyntaxError", () => {
      expect(() => {
        new NodeQuery<Node>(".ClassDeclaration .");
      }).toThrow(SyntaxError);
    });
  });
});
