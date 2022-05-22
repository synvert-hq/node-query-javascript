[![npm version](https://badge.fury.io/js/@xinminlabs%2Fnode-query.svg)](https://badge.fury.io/js/@xinminlabs%2Fnode-query)
[![CI](https://github.com/xinminlabs/node-query-javascript/actions/workflows/main.yml/badge.svg)](https://github.com/xinminlabs/node-query-javascript/actions/workflows/main.yml)

# NodeQuery

NodeQuery defines a Typescript AST node query language, which is a css like syntax for matching nodes,
it supports other ast parsers, like espree, if it implements `NodeQuery.Adapter`.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Node Query Language](#node-query-language)
- [Write Adapter](#write-adapter)
- [Contributing Guide](#contributing-guide)

## Installation

Install NodeQuery using npm:

```
npm install --save @xinminlabs/node-query
```

Or yarn:

```
yarn add @xinminlabs/node-query
```

## Usage

It provides only one api:

```typescript
new NodeQuery(nodeQueryString: string) // Initialize NodeQuery
  .parse(node: Node): Node[] // Get the matching nodes.
```

Here is an example for typescript ast node.

```typescript
import ts from 'typescript';
import NodeQuery from '@xinminlabs/node-query';

const source = `
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
`
const node = ts.createSourceFile('code.ts', source, ts.ScriptTarget.Latest, true)

// It will get the two nodes of property declaration in the class declaration.
new NodeQuery('.ClassDeclaration .PropertyDeclaration').parse(node)
```

## Node Query Language

### matches node type

```
.ClassDeclaration
```

It matches ClassDeclaration node

### matches attribute

```
.NewExpression[expression=UserAccount]
```

It matches NewExpression node whose expression value is UserAccount

```
.NewExpression[arguments.0="Murphy"][arguments.1=1]
```

It matches NewExpression node whose first argument is "Murphy" and second argument is 1

### matches nested attribute

```
.NewExpression[expression.escapedText=UserAccount]
```

It matches NewExpression node whose escapedText of expression is UserAccount

### matches nested selector

```
.VariableDeclaration[initializer=.NewExpression[expression=UserAccount]]
```

It matches VariableDelclaration node whose initializer is a NewExpression node whose expression is UserAccount

### matches function

```
.NewExpression[arguments.length=2]
```

It matches NewExpression node whose arguments length is 2

### matches operators

```
.NewExpression[expression=UserAccount]
```

Value of expression is equal to UserAccount

```
.NewExpression[expression^=User]
```

Value of expression starts with User

```
.NewExpression[expression$=Account]
```

Value of expression ends with Account

```
.NewExpression[expression*=Acc]
```

Value of expression contains Account

```
.NewExpression[arguments.length!=0]
```

Length of arguments is not equal to 0

```
.NewExpression[arguments.length>=2]
```

Length of arguments is greater than or equal to 2

```
.NewExpression[arguments.length>1]
```

Length of arguments is greater than 1

```
.NewExpression[arguments.length<=2]
```

Length of arguments is less than or equal to 2

```
.NewExpression[arguments.length<3]
```

Length of arguments is less than 3

```
.ClassDeclaration[name IN (User Account UserAccount)]
```

Value of name matches any of User, Account and UserAccount

```
.ClassDeclaration[name NOT IN (User Account)]
```

Value of name does not match all of User and Account

```
.ClassDeclaration[name=~/^User/]
```

Value of name starts with User

```
.ClassDeclaration[name!=~/^User/]
```

Value of name does not start with User

```
.ClassDeclaration[name IN (/User/ /Account/)]
```

Value of name matches any of /User/ and /Account/

### matches multiple selectors

#### Descendant combinator

```
.ClassDeclaration .Constructor
```

It matches Constructor node whose ancestor matches the ClassDeclaration node

#### Child combinator

```
.ClassDeclaration > .PropertyDeclaration
```

It matches PropertyDeclaration node whose parent matches the ClassDeclartion node

#### Adjacent sibling combinator

```
.PropertyDeclaration[name=name] + .PropertyDeclaration
```

It matches PropertyDeclaration node only if it immediately follows the PropertyDeclaration whose name is name

#### General sibling combinator

```
.PropertyDeclaration[name=name] ~ .PropertyDeclaration
```

It matches PropertyDeclaration node only if it follows the PropertyDeclaration whose name is name

### matches goto scope

```
.ClassDeclaration members .PropertyDeclaration
```

It matches PropertyDeclaration node whose ancestor matches one of the members of ClassDeclaration node

### matches pseudo selector

```
.ClassDeclaration:has(.Constructor)
```

It matches ClassDeclaration node if it has a Constructor node

```
.ClassDeclaration:not_has(.Constructor)
```

It matches ClassDeclaration node if it does not have a Constructor node

## Write Adapter

Different parsers, like typescript, espree, will generate different AST nodes, to make NodeQuery work for them all,
we define an [Adapter](https://github.com/xinminlabs/node-query-javascript/blob/main/src/adapter.ts) interface,
if you implement the Adapter interface, you can set it as NodeQuery's adapter.

```
NodeQuery.configure(new EspreeAdapter())
```

1. NodeQuery uses [TypescriptAdapter](https://github.com/xinminlabs/node-query-javascript/blob/main/src/typescript-adapter.ts) by default

2. We implements [EspreeAdapter](https://github.com/xinminlabs/synvert-core-javascript/blob/master/lib/espree-adapter.js) for eslint espree.

## Contributing Guide

1. Fork and clone the repo.

2. Run `npm install` to install dependencies.

3. Run `npm run generate` or `npm run watch:generate` to generate `src/parser.js`.

4. Run `npm run test` or `npm run watch:test` to run tests.

5. Do some changes and make tests all passed.

6. Push the changes to the repo.