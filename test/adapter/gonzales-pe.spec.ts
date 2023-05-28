import dedent from "dedent";
import mock from "mock-fs";
import GonzalesPeAdapter from "../../src/adapter/gonzales-pe";
import { parseCodeByGonzalesPe } from "../test-helper";

describe("EspreeAdapter", () => {
  const adapter = new GonzalesPeAdapter();
  const code = dedent`
    a { color: white }
  `;
  const node = parseCodeByGonzalesPe(code);

  beforeEach(() => {
    mock({ "code.js": code });
  });

  afterEach(() => {
    mock.restore();
  });

  it("getNodeType", () => {
    expect(adapter.getNodeType(node)).toEqual("stylesheet");
    const childNode = adapter.getChildren(adapter.getChildren(node)[0])[0];
    expect(adapter.getNodeType(childNode)).toEqual("selector");
  });

  it("getSource", () => {
    expect(adapter.getSource(node)).toEqual(code);
  });

  it("getChildren", () => {
    expect(adapter.getChildren(node).length).toEqual(1);
    const childNode = adapter.getChildren(node)[0];
    expect(adapter.getChildren(childNode).length).toEqual(3);
  });

  it("getSiblings", () => {
    expect(adapter.getSiblings(node)).toEqual([]);
  });
});
