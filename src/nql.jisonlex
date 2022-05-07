NUMBER ([0-9]+("."[0-9]+)?)
SINGLE_QUOTE_STRING (\'.*?\')
DOUBLE_QUOTE_STRING (\".*?\")
IDENTIFIER ([\.\w]+)
IDENTIFIER_VALUE ([\.\w]+)
%s key value array_value

%%

\s+        /* skip whitespace */
"."[a-zA-Z]+
        %{
                yytext = yytext.substring(1, yytext.length);
                return 'NODE_TYPE';
        %}
">"        return 'CHILD';
"["
        %{
                this.begin('key');
                return 'OPEN_ATTRIBUTE';
        %}
<key>(\s+)  /% skip whitespace */
<key>("!=")
        %{
                this.begin('value');
                return 'NOT_EQUAL';
        %}
<key>(">=")
        %{
                this.begin('value');
                return 'GREATER_THAN_AND_EQUAL';
        %}
<key>("<=")
        %{
                this.begin('value');
                return 'LESS_THAN_AND_EQUAL';
        %}
<key>(">")
        %{
                this.begin('value');
                return 'GREATER_THAN';
        %}
<key>("<")
        %{
                this.begin('value');
                return 'LESS_THAN';
        %}
<key>("=")
        %{
                this.begin('value');
                return 'EQUAL';
        %}
<key>({IDENTIFIER})       return 'KEY';
<value>(\s+)  /% skip whitespace */
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
<value>("]")
        %{
                this.popState();
                this.popState();
                return 'CLOSE_ATTRIBUTE';
        %}
<value>({IDENTIFIER_VALUE})        return 'IDENTIFIER_VALUE';
<array_value>(\s+)  /% skip whitespace */
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
<array_value>({IDENTIFIER_VALUE})        return 'IDENTIFIER_VALUE';