"use strict";
var FilterVisitor_1 = require('./FilterVisitor');
var odata_v4_parser_1 = require('odata-v4-parser');
var filterVisitor = new FilterVisitor_1.FilterVisitor();
function createFilter(filter) {
    var ast = (typeof filter == "string" ? odata_v4_parser_1.filter(filter) : filter);
    return filterVisitor.Visit(ast, {});
}
exports.createFilter = createFilter;
function compileExpression(expression) {
    var ast = (typeof expression == "string" ? odata_v4_parser_1.filter(expression) : expression);
    return filterVisitor.Visit(ast, {});
}
exports.compileExpression = compileExpression;
