import NodeQuery from "../src/index";
import typescriptAdapter from "../src/typescript-adapter";
import SyntaxError from "../src/syntax-error";
import { parseCode } from "./helper";

describe("NodeQuery", () => {
  it("configure adapter", () => {
    NodeQuery.configure(typescriptAdapter);
    expect(NodeQuery.getAdapter()).toEqual(typescriptAdapter);
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
      const nodeQuery = new NodeQuery(".ClassDeclaration .PropertyDeclaration");
      expect(nodeQuery.parse(node).length).toEqual(3);
    });

    it("raises SyntaxError", () => {
      expect(() => {
        new NodeQuery(".ClassDeclaration .");
      }).toThrow(SyntaxError);
    });
  });
});
