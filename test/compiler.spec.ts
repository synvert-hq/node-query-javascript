const Compiler = require('../src/compiler');
const { parseCode } = require('./helper');

describe('Boolean', () => {
  it("matches true", () => {
    const value = new Compiler.Boolean(true);
    const node = parseCode('true').statements[0];
    expect(value.match(node, '==')).toBeTruthy();
  });

  it("matches false", () => {
    const value = new Compiler.Boolean(false);
    const node = parseCode('false').statements[0];
    expect(value.match(node, '==')).toBeTruthy();
  });

  it("matches not equal", () => {
    const value = new Compiler.Boolean(true);
    const node = parseCode('false').statements[0];
    expect(value.match(node, '!=')).toBeTruthy();
  });
});

describe('Identifier', () => {
  it("matches equal", () => {
    const value = new Compiler.Identifier('contructor');
    const node = parseCode('contructor').statements[0];
    expect(value.match(node, '==')).toBeTruthy();
  });

  it("matches not equal", () => {
    const value = new Compiler.Identifier('contructor');
    const node = parseCode('synvert').statements[0];
    expect(value.match(node, '!=')).toBeTruthy();
  });
});

describe('Null', () => {
  it("matches null", () => {
    const value = new Compiler.Null();
    const node = parseCode('null').statements[0];
    expect(value.match(node, '==')).toBeTruthy();
  });

  it("matches not null", () => {
    const value = new Compiler.Null();
    const node = parseCode('synvert').statements[0];
    expect(value.match(node, '!=')).toBeTruthy();
  });
});

describe('Number', () => {
  it("matches number", () => {
    const value = new Compiler.Number(1.1)
    const node = parseCode('1.1').statements[0];
    expect(value.match(node, '==')).toBeTruthy();
  });

  it("matches not equal", () => {
    const value = new Compiler.Number(1.1)
    const node = parseCode('1').statements[0];
    expect(value.match(node, '!=')).toBeTruthy();
  });
});

describe('String', () => {
  it("matches string", () => {
    const value = new Compiler.String('synvert')
    const node = parseCode('"synvert"').statements[0];
    expect(value.match(node, '==')).toBeTruthy();
  });

  it("matches not equal", () => {
    const value = new Compiler.String('synvert')
    const node = parseCode('"foobar"').statements[0];
    expect(value.match(node, '!=')).toBeTruthy();
  });
});

describe('Undefined', () => {
  it("matches undefined", () => {
    const value = new Compiler.Undefined();
    const node = parseCode('undefined').statements[0];
    expect(value.match(node, '==')).toBeTruthy();
  });

  it("matches not null", () => {
    const value = new Compiler.Undefined();
    const node = parseCode('synvert').statements[0];
    expect(value.match(node, '!=')).toBeTruthy();
  });
});

describe("ArrayValue", () => {
  it("matches equal", () => {
    const value = new Compiler.ArrayValue({ value: new Compiler.Identifier('foo'), rest: new Compiler.ArrayValue({ value: new Compiler.Identifier('bar') }) });
    const node = parseCode('[foo, bar]').statements[0].expression.elements;
    expect(value.match(node, '==')).toBeTruthy();
  });
});