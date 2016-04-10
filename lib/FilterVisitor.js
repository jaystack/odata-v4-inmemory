"use strict";
var lexer_1 = require('odata-v4-parser/lib/lexer');
exports.ODataMethodMap = {
    round: function (v) { return Math.round(v); },
    indexof: function (v, i) { return v.indexOf && v.indexOf(i); },
    substring: function (v, i) { return v.substr(i - 1); }
};
var FilterVisitor = (function () {
    function FilterVisitor() {
    }
    FilterVisitor.prototype.Visit = function (node, context) {
        //console.log("Visiting: ", node.type)
        switch (node.type) {
            //these are auto handled by visitor bubbling
            case lexer_1.TokenType.CollectionPathExpression:
            case lexer_1.TokenType.LambdaPredicateExpression:
            case lexer_1.TokenType.MemberExpression:
            case lexer_1.TokenType.PropertyPathExpression:
            case lexer_1.TokenType.SingleNavigationExpression:
            case lexer_1.TokenType.CommonExpression:
            case undefined:
                break;
            default:
                var fun = this[("Visit" + node.type)];
                if (fun) {
                    return fun.call(this, node, context);
                }
                console.log("Unhandled node type, falling back: " + node.type);
        }
        return this.Visit(node.value, context);
    };
    //todo fix AST so that we dont need this
    FilterVisitor.prototype.VisitFirstMemberExpression = function (node, context) {
        if (Array.isArray(node.value)) {
            var _a = node.value, current = _a[0], next = _a[1];
            return this.VisitODataIdentifier({ value: { current: current, next: next } }, context);
        }
        return this.Visit(node.value, context);
    };
    FilterVisitor.prototype.VisitBinaryExpression = function (node, context) {
        return [this.Visit(node.value.left, context), this.Visit(node.value.right, context)];
    };
    FilterVisitor.prototype.VisitBoolParenExpression = function (node, context) {
        var inner = this.Visit(node.value, context);
        return function (a) { return !!inner(a); };
    };
    FilterVisitor.prototype.VisitLambdaVariableExpression = function (node, context) {
        return function (a) { return a; };
    };
    FilterVisitor.prototype.VisitCountExpression = function (node, context) {
        return function (a) { return (a && a.length) || 0; };
    };
    FilterVisitor.prototype.VisitAllExpression = function (node, context) {
        var predicate = this.Visit(node.value.predicate, context);
        return function (a) { return a.every && a.every(predicate); };
    };
    FilterVisitor.prototype.VisitAnyExpression = function (node, context) {
        var predicate = this.Visit(node.value.predicate, context);
        return function (a) { return a.some && a.some(predicate); };
    };
    FilterVisitor.prototype.VisitFilter = function (node, context) {
        var predicate = this.Visit(node.value, context);
        return function (a) { return !!predicate(a); };
    };
    FilterVisitor.prototype.VisitEqualsExpression = function (node, context) {
        var _a = this.VisitBinaryExpression(node, context), left = _a[0], right = _a[1];
        return function (a) { return left(a) === right(a); };
    };
    FilterVisitor.prototype.VisitGreaterThanExpression = function (node, context) {
        var _a = this.VisitBinaryExpression(node, context), left = _a[0], right = _a[1];
        return function (a) { return left(a) > right(a); };
    };
    FilterVisitor.prototype.VisitLesserThanExpression = function (node, context) {
        var _a = this.VisitBinaryExpression(node, context), left = _a[0], right = _a[1];
        return function (a) { return left(a) < right(a); };
    };
    FilterVisitor.prototype.VisitImplicitVariableExpression = function (node, context) {
        return function (a) { return a; };
    };
    FilterVisitor.prototype.VisitAndExpression = function (node, context) {
        var _a = this.VisitBinaryExpression(node, context), left = _a[0], right = _a[1];
        return function (a) { return left(a) && right(a); };
    };
    FilterVisitor.prototype.VisitAddExpression = function (node, context) {
        var _a = this.VisitBinaryExpression(node, context), left = _a[0], right = _a[1];
        return function (a) { return left(a) + right(a); };
    };
    FilterVisitor.prototype.VisitParenExpression = function (node, context) {
        var fn = this.Visit(node.value, context);
        return function (a) { return fn(a); };
    };
    FilterVisitor.prototype.getLiteral = function (node) {
        switch (node.value) {
            case "Edm.SByte": return parseInt(node.raw);
            case "Edm.Boolean": return node.raw === "true";
            case "Edm.String": return node.raw.replace(/'/g, '');
            default:
                console.log("unknown value type:" + node.value);
        }
        return node.raw;
    };
    FilterVisitor.prototype.VisitLiteral = function (node, context) {
        var _this = this;
        return function (a) { return _this.getLiteral(node); };
    };
    FilterVisitor.prototype.VisitMethodCallExpression = function (node, context) {
        var _this = this;
        var method = exports.ODataMethodMap[node.value.method];
        var params = node.value.parameters.map(function (p) { return _this.Visit(p, context); });
        return function (a) { return method.apply(_this, params.map(function (p) { return p(a); })); };
    };
    FilterVisitor.prototype.VisitODataIdentifier = function (node, context) {
        if (node.value.name) {
            return function (a) { return a[node.value.name]; };
        }
        var current = this.Visit(node.value.current, context);
        var next = this.Visit(node.value.next, context);
        return function (a) { return next(current(a) || {}); };
    };
    FilterVisitor.prototype.VisitOrExpression = function (node, context) {
        var _a = this.VisitBinaryExpression(node, context), left = _a[0], right = _a[1];
        return function (a) { return left(a) || right(a); };
    };
    return FilterVisitor;
}());
exports.FilterVisitor = FilterVisitor;
