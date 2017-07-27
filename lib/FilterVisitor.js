"use strict";
var lexer_1 = require('odata-v4-parser/lib/lexer');
var minDateTime = new Date(-8640000000000000);
var maxDateTime = new Date(8640000000000000);
exports.ODataMethodMap = {
    round: function (v) { return Math.round(v); },
    indexof: function (v, i) { return v.indexOf && v.indexOf(i); },
    substring: function (v, i) { return v.substr(i - 1); },
    contains: function (v, i) { return v.includes(i); },
    endswith: function (v, i) { return v.endsWith(i); },
    startswith: function (v, i) { return v.startsWith(i); },
    length: function (v) { return v.length; },
    tolower: function (v) { return v.toLowerCase(); },
    toupper: function (v) { return v.toUpperCase(); },
    trim: function (v) { return v.trim(); },
    concat: function (v, i) { return typeof v == 'number' ? v.toString().concat(i) : v.concat(i); },
    year: function (v) { return v.getFullYear(); },
    month: function (v) { return v.getMonth() + 1; },
    day: function (v) { return v.getDate(); },
    hour: function (v) { return v.getHours(); },
    minute: function (v) { return v.getMinutes(); },
    second: function (v) { return v.getSeconds(); },
    now: function () { return new Date(); },
    maxdatetime: function () { return maxDateTime; },
    mindatetime: function () { return minDateTime; },
    floor: function (v) { return Math.floor(v); },
    ceiling: function (v) { return Math.ceil(v); }
};
var FilterVisitor = (function () {
    function FilterVisitor() {
    }
    FilterVisitor.prototype.Visit = function (node, context) {
        //console.log("Visiting: ", node.type)
        if (!node) {
            throw new Error("Node cannot be empty");
        }
        switch (node.type) {
            //these are auto handled by visitor bubbling
            case lexer_1.TokenType.CollectionPathExpression:
            case lexer_1.TokenType.LambdaPredicateExpression:
            case lexer_1.TokenType.MemberExpression:
            case lexer_1.TokenType.SingleNavigationExpression:
            case lexer_1.TokenType.CommonExpression:
            case lexer_1.TokenType.ArrayOrObject:
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
    FilterVisitor.prototype.VisitNotExpression = function (node, context) {
        var expression = this.Visit(node.value, context);
        return function (a) { return !expression(a); };
    };
    FilterVisitor.prototype.VisitEqualsExpression = function (node, context) {
        var _a = this.VisitBinaryExpression(node, context), left = _a[0], right = _a[1];
        return function (a) { return left(a) === right(a); };
    };
    FilterVisitor.prototype.VisitNotEqualsExpression = function (node, context) {
        var _a = this.VisitBinaryExpression(node, context), left = _a[0], right = _a[1];
        return function (a) { return left(a) !== right(a); };
    };
    FilterVisitor.prototype.VisitGreaterThanExpression = function (node, context) {
        var _a = this.VisitBinaryExpression(node, context), left = _a[0], right = _a[1];
        return function (a) { return left(a) > right(a); };
    };
    FilterVisitor.prototype.VisitLesserThanExpression = function (node, context) {
        var _a = this.VisitBinaryExpression(node, context), left = _a[0], right = _a[1];
        return function (a) { return left(a) < right(a); };
    };
    FilterVisitor.prototype.VisitLesserOrEqualsExpression = function (node, context) {
        var _a = this.VisitBinaryExpression(node, context), left = _a[0], right = _a[1];
        return function (a) { return left(a) <= right(a); };
    };
    FilterVisitor.prototype.VisitGreaterOrEqualsExpression = function (node, context) {
        var _a = this.VisitBinaryExpression(node, context), left = _a[0], right = _a[1];
        return function (a) { return left(a) >= right(a); };
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
    FilterVisitor.prototype.VisitSubExpression = function (node, context) {
        var _a = this.VisitBinaryExpression(node, context), left = _a[0], right = _a[1];
        return function (a) { return left(a) - right(a); };
    };
    FilterVisitor.prototype.VisitMulExpression = function (node, context) {
        var _a = this.VisitBinaryExpression(node, context), left = _a[0], right = _a[1];
        return function (a) { return left(a) * right(a); };
    };
    FilterVisitor.prototype.VisitDivExpression = function (node, context) {
        var _a = this.VisitBinaryExpression(node, context), left = _a[0], right = _a[1];
        return function (a) { return left(a) / right(a); };
    };
    FilterVisitor.prototype.VisitModExpression = function (node, context) {
        var _a = this.VisitBinaryExpression(node, context), left = _a[0], right = _a[1];
        return function (a) { return left(a) % right(a); };
    };
    FilterVisitor.prototype.VisitParenExpression = function (node, context) {
        var fn = this.Visit(node.value, context);
        return function (a) { return fn(a); };
    };
    FilterVisitor.prototype.getLiteral = function (node) {
        switch (node.value) {
            case 'null': return null;
            case "Edm.SByte": return parseInt(node.raw);
            case "Edm.Decimal": return parseFloat(node.raw);
            case "Edm.Double": switch (node.raw) {
                case 'INF': return Infinity;
                default: return parseFloat(node.raw);
            }
            case "Edm.Boolean": return node.raw === "true";
            //todo: check if string is actually a valid literal type
            case "string":
            case "Edm.String":
                return decodeURIComponent(node.raw).replace(/'/g, '').replace(/\"/g, "");
            case "Edm.DateTimeOffset":
            case "Edm.Date":
                return new Date(node.raw);
            case "Edm.TimeOfDay":
                return new Date("1970-01-01T" + node.raw + "Z");
            case "Edm.Duration":
                var m = node.raw.match(/P([0-9]*D)?T?([0-9]{1,2}H)?([0-9]{1,2}M)?([\.0-9]*S)?/);
                if (m) {
                    var d = new Date(0);
                    for (var i = 1; i < m.length; i++) {
                        switch (m[i].slice(-1)) {
                            case 'D':
                                d.setDate(parseInt(m[i]));
                                continue;
                            case 'H':
                                d.setHours(parseInt(m[i]));
                                continue;
                            case 'M':
                                d.setMinutes(parseInt(m[i]));
                                continue;
                            case 'S':
                                d.setSeconds(parseInt(m[i]));
                                continue;
                        }
                    }
                    return d;
                }
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
        var params = (node.value.parameters || []).map(function (p) { return _this.Visit(p, context); });
        if (!method) {
            console.log("Unknown method " + node.value.method);
            return function (a) { return a; };
        }
        return function (a) { return method.apply(_this, params.map(function (p) { return p(a); })); };
    };
    FilterVisitor.prototype.VisitPropertyPathExpression = function (node, context) {
        if (node.value.name) {
            return function (a) { return a[node.value.name]; };
        }
        if (node.value.current && node.value.next) {
            var current_1 = this.Visit(node.value.current, context);
            var next_1 = this.Visit(node.value.next, context);
            return function (a) { return next_1(current_1(a) || {}); };
        }
        return this.Visit(node.value, context);
    };
    FilterVisitor.prototype.VisitODataIdentifier = function (node, context) {
        if (node.value.name) {
            return function (a) { return a[node.value.name]; };
        }
        var current = this.Visit(node.value.current, context);
        var next = this.Visit(node.value.next, context);
        return function (a) { return next(current(a) || {}); };
    };
    FilterVisitor.prototype.VisitIsOfExpression = function (node, context) {
        var type = this.Visit(node.value.typename, context);
        if (!node.value.target) {
            return function (a) {
                return a.constructor.name === type(a);
            };
        }
        var target = this.Visit(node.value.target, context);
        return function (a) { return target(a).constructor.name === type(a); };
    };
    FilterVisitor.prototype.VisitQualifiedEntityTypeName = function (node, context) {
        var _this = this;
        return function (a) { return _this.Visit(node.value, context)(a); };
    };
    FilterVisitor.prototype.VisitEntityTypeName = function (node, context) {
        return function (a) { return node.value.name; };
    };
    FilterVisitor.prototype.VisitOrExpression = function (node, context) {
        var _a = this.VisitBinaryExpression(node, context), left = _a[0], right = _a[1];
        return function (a) { return left(a) || right(a); };
    };
    FilterVisitor.prototype.resolveIdentifier = function (node) {
        switch (node.value) {
            case 'EntityTypeName':
                return node.raw.split(".").slice(-1)[0];
        }
    };
    //this needs double check. why is model type model as 'identifier'
    FilterVisitor.prototype.VisitIdentifier = function (node, context) {
        var _this = this;
        return function (a) { return _this.resolveIdentifier(node); };
    };
    FilterVisitor.prototype.VisitArray = function (node, context) {
        var _this = this;
        var items = (node.value.items || []).map(function (item) { return _this.Visit(item, context); });
        return function (a) { return items.map(function (item) { return item(a); }).slice(); };
    };
    FilterVisitor.prototype.VisitNegateExpression = function (node, context) {
        var exp = this.Visit(node.value, context);
        return function (a) { return -exp(a); };
    };
    return FilterVisitor;
}());
exports.FilterVisitor = FilterVisitor;
