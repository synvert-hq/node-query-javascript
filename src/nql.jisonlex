NUMBER ([0-9]+("."[0-9]+)?)
SINGLE_QUOTE_STRING (\'.*?\')
DOUBLE_QUOTE_STRING (\".*?\")
IDENTIFIER ([\.\w]+)
IDENTIFIER_VALUE ([\.\w]+)
%s key value

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
<key>({IDENTIFIER})       return 'KEY';
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
<value>(\s+)  /% skip whitespace */
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
                return 'STRING';
        %}
<value>({DOUBLE_QUOTE_STRING})
        %{
                return 'STRING';
        %}
<value>("]")
        %{
                this.popState();
                this.popState();
                return 'CLOSE_ATTRIBUTE';
        %}
<value>({IDENTIFIER_VALUE})        return 'IDENTIFIER_VALUE';