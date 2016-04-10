"use strict";
var FilterVisitor_1 = require('./FilterVisitor');
var parser_1 = require('odata-v4-parser/lib/parser');
var lexer_1 = require('odata-v4-parser/lib/lexer');
exports.Token = lexer_1.Token;
var filterVisitor = new FilterVisitor_1.FilterVisitor();
var infrastructure;
(function (infrastructure) {
    function createFilterAst(odataFilter) {
        //does parser have state - its a question to ask tomorrow
        var p = new parser_1.Parser();
        var ast = p.filter(odataFilter);
        return ast;
    }
    infrastructure.createFilterAst = createFilterAst;
})(infrastructure = exports.infrastructure || (exports.infrastructure = {}));
/**
 * Creates a filter function from an OData filter expression string
 * @param {string} odataFilter - A filter expression in OData $filter format
 * @return {FilterFunction}  JavaScript function that implements the filter predicate
 * @example
 * //return true
 * const filterFn = createFilter("Size eq 4 and startswith(Name,'Ch')")
 * const items = [{Size:1, Name:'Chai'}, {Size:4, Name:'Childrens book' }]
 * console.log(items.filter(filterFn))
 * >> [{Size:4, Name:'Childrens book'}]
 */
function createFilter(odataFilter) {
    return filterVisitor.Visit(infrastructure.createFilterAst(odataFilter), {});
}
exports.createFilter = createFilter;
