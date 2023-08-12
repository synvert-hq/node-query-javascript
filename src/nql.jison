%{
  const Compiler = require('./compiler')
%}

%%

expression_list
  : expression COMMA expression_list { $$ = new Compiler.ExpressionList({ expression: $1, rest: $3 }); yy.parser.yy.result = $$ }
  | expression { $$ = new Compiler.ExpressionList({ expression: $1 }); yy.parser.yy.result = $$ }
  ;

expression
  : selector expression { $$ = new Compiler.Expression({ selector: $1, rest: $2 }) }
  | selector { $$ = new Compiler.Expression({ selector: $1 }) }
  ;

selector
  : basic_selector POSITION { $$ = new Compiler.Selector({ basicSelector: $1, position: $2 }) }
  | basic_selector { $$ = new Compiler.Selector({ basicSelector: $1 }) }
  | PSEUDO_CLASS OPEN_SELECTOR selector CLOSE_SELECTOR { $$ = new Compiler.Selector({ pseudoClass: $1, pseudoSelector: $3 }) }
  | RELATIONSHIP selector { $$ = new Compiler.Selector({ relationship: $1, rest: $2 }) }
  | GOTO_SCOPE selector { $$ = new Compiler.Selector({ gotoScope: $1, rest: $2 }) }
  ;

basic_selector
  : NODE_TYPE attribute_list { $$ = new Compiler.BasicSelector({ nodeType: $1, attributeList: $2 }) }
  | NODE_TYPE { $$ = new Compiler.BasicSelector({ nodeType: $1 }) }
  ;

attribute_list
  : attribute attribute_list { $$ = new Compiler.AttributeList({ attribute: $1, rest: $2 }) }
  | attribute { $$ = new Compiler.AttributeList({ attribute: $1 }) }
  ;

attribute
  : OPEN_ATTRIBUTE KEY $OPERATOR OPEN_ARRAY array_value CLOSE_ARRAY CLOSE_ATTRIBUTE { $$ = new Compiler.Attribute({ key: $2, value: $5, operator: $3 }) }
  | OPEN_ATTRIBUTE KEY $OPERATOR OPEN_ARRAY CLOSE_ARRAY CLOSE_ATTRIBUTE { $$ = new Compiler.Attribute({ key: $2, value: new Compiler.ArrayValue({}), operator: $3 }) }
  | OPEN_ATTRIBUTE KEY OPERATOR value CLOSE_ATTRIBUTE { $$ = new Compiler.Attribute({ key: $2, value: $4, operator: $3 }) }
  ;

array_value
  : value array_value { $$ = new Compiler.ArrayValue({ value: $1, rest: $2 }) }
  | value { $$ = new Compiler.ArrayValue({ value: $1 }) }
  ;

value
  : selector
  | NULL { $$ = new Compiler.Null() }
  | UNDEFINED { $$ = new Compiler.Undefined() }
  | BOOLEAN { $$ = new Compiler.Boolean($1) }
  | NUMBER { $$ = new Compiler.Number($1) }
  | REGEXP { $$ = new Compiler.Regexp($1) }
  | STRING { $$ = new Compiler.String($1) }
  | IDENTIFIER_VALUE { $$ = new Compiler.Identifier($1) }
  ;

%%