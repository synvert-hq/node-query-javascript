[![npm version](https://badge.fury.io/js/@xinminlabs%2Fnode-query.svg)](https://badge.fury.io/js/@xinminlabs%2Fnode-query)
[![CI](https://github.com/xinminlabs/node-query-typescript/actions/workflows/main.yml/badge.svg)](https://github.com/xinminlabs/node-query-typescript/actions/workflows/main.yml)

# NodeQuery

NodeQuery defines a Typescript AST node query language, which is a css like syntax for matching nodes.

## Install

Install NodeQuery using npm:

```
npm install --save @xinminlabs/node-query
```

Or yarn:

```
yarn add @xinminlabs/node-query
```

## Usage

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

## Features

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
