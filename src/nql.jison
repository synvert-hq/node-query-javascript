
%%

expression
  : selector expression
  | selector { new Compiler.Expression($1) }
  ;

selector
  : NODE_TYPE attribute_list { new Compiler.Selector($1, $2) }
  | NODE_TYPE
  ;

attribute_list
  : OPEN_ATTRIBUTE attribute CLOSE_ATTRIBUTE attribute_list
  | OPEN_ATTRIBUTE attribute CLOSE_ATTRIBUTE { new Compiler.AttributeList($2) }
  ;

attribute
  : KEY EQUAL value { new Compiler.Attribute($1, $3, $2) }
  | KEY NOT_EQUAL value
  ;

value
  : selector
  | NULL
  | UNDEFINED
  | BOOLEAN
  | NUMBER
  | STRING { new Compiler.String($1) }
  ;

%%

const Compiler = require('./compiler')