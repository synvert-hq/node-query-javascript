import ts from "typescript";

describe("Test", () => {
  test("source to ast node", () => {
    const node: ts.SourceFile = ts.createSourceFile(
      "code.ts",
      `
        interface User {
          name: string;
          id: number;
        }

        class UserAccount {
          name: string;
          id: number;

          constructor(name: string, id: number) {
            this.name = name;
            this.id = id;
          }
        }

        const user: User = new UserAccount("Murphy", 1);
      `,
      ts.ScriptTarget.Latest,
      true
    );
    expect(ts.SyntaxKind[node.kind]).toEqual("SourceFile");
    expect(node.statements.length).toEqual(3);
    expect(ts.SyntaxKind[node.statements[0].kind]).toEqual("InterfaceDeclaration");
    expect(ts.SyntaxKind[node.statements[1].kind]).toEqual("ClassDeclaration");
    expect(ts.SyntaxKind[node.statements[2].kind]).toEqual("FirstStatement");
  });
});