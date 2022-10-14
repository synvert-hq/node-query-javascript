[![npm version](https://badge.fury.io/js/@xinminlabs%2Fnode-query.svg)](https://badge.fury.io/js/@xinminlabs%2Fnode-query)
[![CI](https://github.com/xinminlabs/node-query-javascript/actions/workflows/main.yml/badge.svg)](https://github.com/xinminlabs/node-query-javascript/actions/workflows/main.yml)

# NodeQuery

NodeQuery defines a NQL (node query language) and node rules to query AST nodes.

## Table of Contents

- [NodeQuery](#nodequery)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Node Query Language](#node-query-language)
    - [nql matches node type](#nql-matches-node-type)
    - [nql matches attribute](#nql-matches-attribute)
    - [nql matches nested attribute](#nql-matches-nested-attribute)
    - [nql matches evaluated value](#nql-matches-evaluated-value)
    - [nql matches nested selector](#nql-matches-nested-selector)
    - [nql matches property](#nql-matches-property)
    - [nql matches operators](#nql-matches-operators)
    - [nql matches array node attribute](#nql-matches-array-node-attribute)
    - [nql matches * in attribute key](#nql-matches--in-attribute-key)
    - [nql matches multiple selectors](#nql-matches-multiple-selectors)
      - [Descendant combinator](#descendant-combinator)
      - [Child combinator](#child-combinator)
      - [Adjacent sibling combinator](#adjacent-sibling-combinator)
      - [General sibling combinator](#general-sibling-combinator)
    - [nql matches goto scope](#nql-matches-goto-scope)
    - [nql matches :has and :not_has pseudo selector](#nql-matches-has-and-not_has-pseudo-selector)
    - [nql matches :first-child and :last-child selector](#nql-matches-first-child-and-last-child-selector)
    - [nql matches multiple expressions](#nql-matches-multiple-expressions)
  - [Node Rules](#node-rules)
    - [rules matches node type](#rules-matches-node-type)
    - [rules matches attribute](#rules-matches-attribute)
    - [rules matches nested attribute](#rules-matches-nested-attribute)
    - [rules matches evaluated value](#rules-matches-evaluated-value)
    - [rules matches nested selector](#rules-matches-nested-selector)
    - [rules matches property](#rules-matches-property)
    - [rules matches operators](#rules-matches-operators)
    - [rules matches array node attribute](#rules-matches-array-node-attribute)
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

It provides two apis: `queryNodes` and `matchNode`

```typescript
const nodeQuery = new NodeQuery<Node>(nqlOrRules: string | object) // Initialize NodeQuery
nodeQuery.queryNodes(node: Node, includingSelf = true): Node[] // Get the matching nodes.
nodeQuery.matchNode(node: Node): boolean // Check if the node matches nql or rules.
```

Here is an example for typescript ast node.

```typescript
import ts, { Node } from 'typescript';
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
new NodeQuery<Node>('.ClassDeclaration .PropertyDeclaration').queryNodes(node)
new NodeQuery<Node>({ nodeType: "PropertyDeclaration" }).queryNodes(node)
```

## Node Query Language

### nql matches node type

```
.ClassDeclaration
```

It matches ClassDeclaration node

### nql matches attribute

```
.NewExpression[expression=UserAccount]
```

It matches NewExpression node whose expression value is UserAccount

```
.NewExpression[arguments.0="Murphy"][arguments.1=1]
```

It matches NewExpression node whose first argument is "Murphy" and second argument is 1

### nql matches nested attribute

```
.NewExpression[expression.escapedText=UserAccount]
```

It matches NewExpression node whose escapedText of expression is UserAccount

### nql matches evaluated value

```
.PropertyAssignment[name="{{initializer}}"]
```

It matches PropertyAssignement node whose node value of name matches node value of intiailizer

### nql matches nested selector

```
.VariableDeclaration[initializer=.NewExpression[expression=UserAccount]]
```

It matches VariableDelclaration node whose initializer is a NewExpression node whose expression is UserAccount

### nql matches property

```
.NewExpression[arguments.length=2]
```

It matches NewExpression node whose arguments length is 2

### nql matches operators

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

### nql matches array node attribute

```
.NewExpression[arguments=("Murphy" 1)]
```

It matches NewExpressioin node whose arguments are ["Murphy", 1]

### nql matches * in attribute key

```
.Constructor[parameters.*.name IN (name id)]
```

It matches Constructor whose parameters' names are all in [name id]

### nql matches multiple selectors

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

### nql matches goto scope

```
.ClassDeclaration members .PropertyDeclaration
```

It matches PropertyDeclaration node who is in the members of ClassDeclaration node

### nql matches :has and :not_has pseudo selector

```
.ClassDeclaration:has(.Constructor)
```

It matches ClassDeclaration node if it has a Constructor node

```
.ClassDeclaration:not_has(.Constructor)
```

It matches ClassDeclaration node if it does not have a Constructor node

### nql matches :first-child and :last-child selector

```
.MethodDefinition:first-child
```

It matches the first MethodDefinition node

```
.MethodDefinition:last-child
```

It matches the last MethodDefinition node

### nql matches multiple expressions

```
.JSXOpeningElement[name=Fragment], .JSXClosingElement[name=Fragment]
```

It matches JSXOpeningElement node whose name is Fragment or JSXClosingElement node whose name is Fragment

## Node Rules

### rules matches node type

```
{ nodeType: "ClassDeclaration" }
```

It matches ClassDeclaration node

### rules matches attribute

```
{ nodeType: "NewExpression", expression: "UserAccount" }
```

It matches NewExpression node whose expression value is UserAccount

```
{ nodeType: "NewExpression", arguments: { 0: "Murphy", 1: 1 } }
```

It matches NewExpression node whose first argument is "Murphy" and second argument is 1

### rules matches nested attribute

```
{ nodeType: "NewExpression", expression: { escapedText: "UserAccount" } }
```

It matches NewExpression node whose escapedText of expression is UserAccount

### rules matches evaluated value

```
{ nodeType: "PropertyAssignment", name: "{{initializer}}" }
```

It matches PropertyAssignement node whose node value of name matches node value of intiailizer

### rules matches nested selector

```
{ nodeType: "VariableDeclaration", initializer: { nodeType: "NewExpression", expression: "UserAccount" } }
```

It matches VariableDelclaration node whose initializer is a NewExpression node whose expression is UserAccount

### rules matches property

```
{ nodeType: "NewExpression", arguments: { length: 2 } }
```

It matches NewExpression node whose arguments length is 2

### rules matches operators

```
{ nodeType: "NewExpression", expression: "UserAccount" }
```

Value of expression is equal to UserAccount

```
{ nodeType: "NewExpression", arguments: { length: { not: 0 } } }
```

Length of arguments is not equal to 0

```
{ nodeType: "NewExpression", arguments: { length: { gte: 2 } } }
```

Length of arguments is greater than or equal to 2

```
{ nodeType: "NewExpression", arguments: { length: { gt: 1 } } }
```

Length of arguments is greater than 1

```
{ nodeType: "NewExpression", arguments: { length: { lte: 2 } } }
```

Length of arguments is less than or equal to 2

```
{ nodeType: "NewExpression", arguments: { length: { lt: 3 } } }
```

Length of arguments is less than 3

```
{ nodeType: "ClassDeclaration", name: { in: [User Account UserAccount] } }
```

Value of name matches any of User, Account and UserAccount

```
{ nodeType: "ClassDeclaration", name: { notIn: [User Account] } }
```

Value of name does not match all of User and Account

```
{ nodeType: "ClassDeclaration", name: /^User/ }
```

Value of name starts with User

```
{ nodeType: "ClassDeclaration", name: { not: /^User/ } }
```

Value of name does not start with User

```
{ nodeType: "ClassDeclaration", name: { in: [/User/, /Account/] } }
```

Value of name matches any of /User/ and /Account/

### rules matches array node attribute

```
{ nodeType: "NewExpression", arguments: ["Murphy", 1] }
```

It matches NewExpressioin node whose arguments are ["Murphy", 1]

## Write Adapter

Different parsers, like typescript, espree, will generate different AST nodes, to make NodeQuery work for them all,
we define an [Adapter](https://github.com/xinminlabs/node-query-javascript/blob/main/src/adapter.ts) interface,
if you implement the Adapter interface, you can set it as NodeQuery's adapter.

```typescript
NodeQuery.configure({ adapter: new EspreeAdapter() })
```

Here are some examples:

1. [javascript version EspreeAdapter](https://github.com/xinminlabs/synvert-core-javascript/blob/javascript/lib/espree-adapter.js)

2. [typescript version EspreeAdapter](https://github.com/xinminlabs/synvert-core-javascript/blob/master/src/espree-adapter.ts)

3. [TypescriptAdapter](https://github.com/xinminlabs/node-query-javascript/blob/main/src/typescript-adapter.ts)

## Contributing Guide

1. Fork and clone the repo.

2. Run `npm install` to install dependencies.

3. Run `npm run generate` or `npm run watch:generate` to generate `src/parser.js`.

4. Run `npm run test` or `npm run watch:test` to run tests.

5. Make some changes and make tests all passed.

6. Push the changes to the repo.