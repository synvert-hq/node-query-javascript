import NodeQuery from '../src/index';
import { adapter } from '../src/typescript-adapter';
import { parseCode } from './helper';

describe("NodeQuery", () => {
  it("configure adapter", () => {
    NodeQuery.configure(adapter);
    expect(NodeQuery.getAdapter()).toEqual(adapter);
  });

  it("parse", () => {
    NodeQuery.configure(adapter);
    const node = parseCode( `
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
    const matchingNodes = new NodeQuery('.ClassDeclaration .PropertyDeclaration').parse(node);
    expect(matchingNodes.length).toEqual(3)
  });
});