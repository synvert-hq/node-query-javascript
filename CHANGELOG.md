# NodeQuery

## 1.19.1 (2023-12-02)

* Expose `TypescriptAdapter`, `EspreeAdapter` and `GonzalesAdapter`

## 1.19.0 (2023-12-01)

* Add `adapter` parameter to `NodeQuery`
* Do not allow to configure an `adapter` globally
* Do not expose `TypescriptAdapter`, `EspreeAdapter` and `GonzalesAdapter`
* Expose `NodeQuery` `adapter` property

## 1.18.3 (2023-08-12)

* Update `nql.jison`

## 1.18.2 (2023-07-09)

* Update `@xinminlabs/gonzales-pe` to 1.1.0

## 1.18.1 (2023-06-04)

* Export `GonzalesPeAdapter`

## 1.18.0 (2023-05-28)

* Add `GonzalesPeAdapter`

## 1.17.0 (2023-03-17)

* Add `EspreeAdapter`

## 1.16.0 (2022-12-09)

* Support negative index to fetch array element
* Parse negative number

## 1.15.1 (2022-10-30)

* Matches `null` and `undefined` for node rules

## 1.15.0 (2022-10-21)

* Support `not includes` operator
* Support `includes` a selector
* Add more debug info

## 1.14.0 (2022-10-20)

* Support `includes` operator

## 1.13.1 (2022-10-15)

* Fix `filterByPosition` with empty nodes

## 1.13.0 (2022-10-14)

* Support `:first-child` and `:last-child`

## 1.12.0 (2022-10-01)

* Better regexp to match evaluated value
* Make baseNode as the root matching node

## 1.11.1 (2022-09-15)

* Export `QueryOptions`

## 1.11.0 (2022-09-15)

* Add `includingSelf`, `stopAtFirstMatch` and `recursive` options

## 1.10.0 (2022-09-14)

* Drop `EvaluatedValue`, use `String` instead

## 1.9.2 (2022-08-23)

* Fix "typescript getText() may contain trailing whitespace and newlines"
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
