%{
  const Compiler = require('./compiler')
%}

%%

expression
  : CHILD expression { $$ = new Compiler.Expression({ rest: $2, relationship: 'child' }); yy.parser.yy.result = $$ }
  | selector expression { $$ = new Compiler.Expression({ selector: $1, rest: $2 }); yy.parser.yy.result = $$ }
  | selector { $$ = new Compiler.Expression({ selector: $1 }); yy.parser.yy.result = $$ }
  ;

selector
  : NODE_TYPE attribute_list { $$ = new Compiler.Selector({ nodeType: $1, attributeList: $2 }) }
  | NODE_TYPE { $$ = new Compiler.Selector({ nodeType: $1 }) }
  ;

attribute_list
  : OPEN_ATTRIBUTE attribute CLOSE_ATTRIBUTE attribute_list { $$ = new Compiler.AttributeList({ attribute: $2, rest: $4 }) }
  | OPEN_ATTRIBUTE attribute CLOSE_ATTRIBUTE { $$ = new Compiler.AttributeList({ attribute: $2 }) }
  ;

attribute
  : KEY EQUAL value { $$ = new Compiler.Attribute({ key: $1, value: $3, operator: $2 }) }
  | KEY NOT_EQUAL value
  ;

value
  : selector
  | NULL
  | UNDEFINED
  | BOOLEAN
  | NUMBER
  | STRING { $$ = new Compiler.String({ value: $1 }) }
  | IDENTIFIER_VALUE { $$ = new Compiler.Identifier({ value: $1 }) }
  ;

%%