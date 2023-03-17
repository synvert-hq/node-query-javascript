import dedent from "dedent";
import mock from "mock-fs";
import EspreeAdapter from "../src/espree-adapter";
import { parseCodeByEspree } from "./test-helper";

describe("EspreeAdapter", () => {
  const adapter = new EspreeAdapter();
  const code = dedent`
    class UserAccount {
      get name() {};
      get id() {};
      get active() {};
    }
  `;
  const node = parseCodeByEspree(code);

  beforeEach(() => {
    mock({ "code.js": code });
  });

  afterEach(() => {
    mock.restore();
  });

  it("getNodeType", () => {
    expect(adapter.getNodeType(node)).toEqual("ClassDeclaration");
  });

  it("getSource", () => {
    expect(adapter.getSource(node)).toEqual(code);
  });

  it("getChildren", () => {
    expect(adapter.getChildren((node as any)['body']).length).toEqual(3);
  });

  it("getSiblings", () => {
    expect(adapter.getSiblings(node)).toEqual([]);
  });
});
