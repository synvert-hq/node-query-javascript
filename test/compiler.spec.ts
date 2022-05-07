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

  it("matches not equal", () => {
    const value = new Compiler.ArrayValue({ value: new Compiler.Identifier('foo'), rest: new Compiler.ArrayValue({ value: new Compiler.Identifier('bar') }) });
    const node = parseCode('[synvert]').statements[0].expression.elements;
    expect(value.match(node, '!=')).toBeTruthy();
  });

  it("matches in", () => {
    const value = new Compiler.ArrayValue({ value: new Compiler.Identifier('foo'), rest: new Compiler.ArrayValue({ value: new Compiler.Identifier('bar') }) });
    const node = parseCode('foo').statements[0];
    expect(value.match(node, 'in')).toBeTruthy();
  });

  it("matches not_in", () => {
    const value = new Compiler.ArrayValue({ value: new Compiler.Identifier('foo'), rest: new Compiler.ArrayValue({ value: new Compiler.Identifier('bar') }) });
    const node = parseCode('synvert').statements[0];
    expect(value.match(node, 'not_in')).toBeTruthy();
  });
});

describe("Attribute", () => {
  it("matches node", () => {
    const attribute = new Compiler.Attribute({ key: 'name', value: new Compiler.Identifier('Synvert'), operator: '=='});
    const node = parseCode('class Synvert {}').statements[0];
    expect(attribute.match(node)).toBeTruthy();
  });

  it("does not match node", () => {
    const attribute = new Compiler.Attribute({ key: 'name', value: new Compiler.Identifier('Synvert'), operator: '=='});
    const node = parseCode('class Foobar {}').statements[0];
    expect(attribute.match(node)).toBeFalsy();
  });
});

describe("AttributeList", () => {
  it("matches node", () => {
    const attributeList = new Compiler.AttributeList({
      attribute: new Compiler.Attribute({ key: 'arguments.0', value: new Compiler.String('Murphy'), operator: '==' }),
      rest: new Compiler.AttributeList({
        attribute: new Compiler.Attribute({ key: 'arguments.1', value: new Compiler.Number(1), operator: '==' }),
        rest: new Compiler.AttributeList({
          attribute: new Compiler.Attribute({ key: 'arguments.2', value: new Compiler.Boolean(true), operator: '==' })
        })
      })
    });
    const node = parseCode('new UserAccount("Murphy", 1, true)').statements[0].expression;
    expect(attributeList.match(node)).toBeTruthy();
  });
});

describe("Selector", () => {
  it("matches node", () => {
    const selector = new Compiler.Selector({
      nodeType: 'NewExpression',
      attributeList: new Compiler.AttributeList({
        attribute: new Compiler.Attribute({ key: 'arguments.0', value: new Compiler.String('Murphy'), operator: '==' }),
        rest: new Compiler.AttributeList({
          attribute: new Compiler.Attribute({ key: 'arguments.1', value: new Compiler.Number(1), operator: '==' }),
          rest: new Compiler.AttributeList({
            attribute: new Compiler.Attribute({ key: 'arguments.2', value: new Compiler.Boolean(true), operator: '==' })
          })
        })
      })
    });
    const node = parseCode('new UserAccount("Murphy", 1, true)').statements[0].expression;
    expect(selector.match(node)).toBeTruthy();
  });
});