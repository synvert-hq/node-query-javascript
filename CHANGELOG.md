# NodeQuery

## 1.9.2 (2022-08-23)

* Fix "typescript getText() may contain trailing whitespaces and newlines"
* Debug operation result

## 1.9.1 (2022-08-10)

* Export `TypescriptAdapter`

## 1.9.0 (2022-08-08)

* Rename `NodeQuery#parse` to `NodeQuery#queryNodes`
* `NodeQuery#queryNodes` accepts `includingSelf` arguments
* `NodeQuery#queryNodes` supports both `nql` and `rules`
* Add `NodeQuery#matchNode` method
* Do not export `handleRecursiveChild` and `getTargetNode` helpers

## 1.8.5 (2022-06-23)

* Match not equal nested selector

## 1.8.4 (2022-06-22)

* Import `TypescriptAdapter`

## 1.8.3 (2022-06-20)

* Export `handleRecursiveChild` and `getTargetNode`

## 1.8.2 (2022-06-19)

* Move `NodeQuery` from `index.ts` to `node-query.ts`
* Export `Adapter` and `SyntaxError`

## 1.8.1 (2022-06-03)

* Support empty array

## 1.8.0 (2022-06-02)

* Make typescript a devDependency
* Support comma in nql

## 1.7.0 (2022-05-29)

* Make dynamic attribute work with multiple nodes
* Support * in attribute key
* Rename dynamic attribute to evaluated value

## 1.6.0 (2022-05-28)

* Matches multiple nodes attribute
* Fix dynamic attribute in jison
* Add debug

## 1.5.0 (2022-05-27)

* Support dynamic attribute
* String can match without or without quotes

## 1.4.0 (2022-05-22)

* Make Node generic

## 1.3.0 (2022-05-21)

* Support Regexp in array value
* Support `:has` and `:not_has` pseudo selector
* Throw `SyntaxError` when query is invalid
* Check `isNode` for nested selector

## 1.2.0 (2022-05-20)

* Support Regexp
* Allow `$` in IDENTIFIER_VALUE

## 1.1.0 (2022-05-18)

* Make `adapter` configurable
* Rename `SimpleSelector` to `BasicSelector`

## 1.0.0 (2022-05-15)

* Initial release