NUMBER ([0-9]+("."[0-9]+)?)
SINGLE_QUOTE_STRING (\'.*?\')
DOUBLE_QUOTE_STRING (\".*?\")
REGEXP (\/.*?\/)
IDENTIFIER ([\*\.\w]*\w)
IDENTIFIER_VALUE ([\$\.\w]+)
%s key value array_value
%options case-insensitive

%%

"."[a-zA-Z]+
        %{
                yytext = yytext.substring(1);
                return 'NODE_TYPE';
        %}
":first-child"
        %{
                yytext = yytext.substring(1);
                return 'POSITION';
        %}
":last-child"
        %{
                yytext = yytext.substring(1);
                return 'POSITION';
        %}
"["
        %{
                this.begin('key');
                return 'OPEN_ATTRIBUTE';
        %}
<key>("=~")
        %{
                this.begin('value');
                return 'OPERATOR';
        %}
<key>("!~")
        %{
                this.begin('value');
                return 'OPERATOR';
        %}
<key>("^=")
        %{
                this.begin('value');
                return 'OPERATOR';
        %}
<key>("$=")
        %{
                this.begin('value');
                return 'OPERATOR';
        %}
<key>("*=")
        %{
                this.begin('value');
                return 'OPERATOR';
        %}
<key>("!=")
        %{
                this.begin('value');
                return 'OPERATOR';
        %}
<key>(">=")
        %{
                this.begin('value');
                return 'OPERATOR';
        %}
<key>("<=")
        %{
                this.begin('value');
                return 'OPERATOR';
        %}
<key>(">")
        %{
                this.begin('value');
                return 'OPERATOR';
        %}
<key>("<")
        %{
                this.begin('value');
                return 'OPERATOR';
        %}
<key>("=")
        %{
                yytext = '==';
                this.begin('value');
                return 'OPERATOR';
        %}
<key>("includes ")
        %{
                yytext = 'includes';
                this.begin('value');
                return 'OPERATOR';
        %}
<key>("not in ")
        %{
                yytext = 'not_in';
                this.begin('value');
                return 'OPERATOR';
        %}
<key>("in ")
        %{
                yytext = 'in';
                this.begin('value');
                return 'OPERATOR';
        %}
<key>({IDENTIFIER})       return 'KEY';
<value>("(")
        %{
                this.begin('array_value');
                return 'OPEN_ARRAY';
        %}
<value>("null")
        %{
                yytext = null;
                return 'NULL';
        %}
<value>("undefined")
        %{
                yytext = undefined;
                return 'UNDEFINED';
        %}
<value>("true")
        %{
                yytext = true;
                return 'BOOLEAN';
        %}
<value>("false")
        %{
                yytext = false;
                return 'BOOLEAN';
        %}
<value>({NUMBER})
        %{
                yytext = Number(yytext);
                return 'NUMBER';
        %}
<value>({SINGLE_QUOTE_STRING})
        %{
                yytext = yytext.substring(1, yytext.length - 1);
                return 'STRING';
        %}
<value>({DOUBLE_QUOTE_STRING})
        %{
                yytext = yytext.substring(1, yytext.length - 1);
                return 'STRING';
        %}
<value>({REGEXP})
        %{
                yytext = yytext.substring(1, yytext.length - 1);
                return 'REGEXP';
        %}
<value>("]")
        %{
                this.popState();
                this.popState();
                return 'CLOSE_ATTRIBUTE';
        %}
<value>({IDENTIFIER_VALUE})        return 'IDENTIFIER_VALUE';
<array_value>(")")
        %{
                this.popState();
                return 'CLOSE_ARRAY';
        %}
<array_value>("null")
        %{
                yytext = null;
                return 'NULL';
        %}
<array_value>("undefined")
        %{
                yytext = undefined;
                return 'UNDEFINED';
        %}
<array_value>("true")
        %{
                yytext = true;
                return 'BOOLEAN';
        %}
<array_value>("false")
        %{
                yytext = false;
                return 'BOOLEAN';
        %}
<array_value>({NUMBER})
        %{
                yytext = Number(yytext);
                return 'NUMBER';
        %}
<array_value>({SINGLE_QUOTE_STRING})
        %{
                yytext = yytext.substring(1, yytext.length - 1);
                return 'STRING';
        %}
<array_value>({DOUBLE_QUOTE_STRING})
        %{
                yytext = yytext.substring(1, yytext.length - 1);
                return 'STRING';
        %}
<array_value>({REGEXP})
        %{
                yytext = yytext.substring(1, yytext.length - 1);
                return 'REGEXP';
        %}
<array_value>({IDENTIFIER_VALUE})        return 'IDENTIFIER_VALUE';
\s+        /* skip whitespace */
","        return 'COMMA';
">"        return 'RELATIONSHIP';
"+"        return 'RELATIONSHIP';
"~"        return 'RELATIONSHIP';
":has"
        %{
                yytext = yytext.substring(1);
                return 'PSEUDO_CLASS';
        %}
":not_has"
        %{
                yytext = yytext.substring(1);
                return 'PSEUDO_CLASS';
        %}
"("        return 'OPEN_SELECTOR';
")"        return 'CLOSE_SELECTOR';
{IDENTIFIER}       return 'GOTO_SCOPE';