import { Token } from 'odata-v4-parser/lib/lexer';
export interface VisitorFuncRes {
    (a: any): any;
}
export interface VisitorFunc {
    (node: Token, context: any): VisitorFuncRes | Array<VisitorFuncRes>;
}
export interface VisitorMap {
    [key: string]: VisitorFunc;
}
export declare const ODataMethodMap: {
    round: (v: any) => number;
    indexof: (v: any, i: any) => any;
    substring: (v: any, i: any) => any;
    contains: (v: any, i: any) => any;
    endswith: (v: any, i: any) => any;
    startswith: (v: any, i: any) => any;
    length: (v: any) => any;
    tolower: (v: any) => any;
    toupper: (v: any) => any;
    trim: (v: any) => any;
    concat: (v: any, i: any) => any;
    year: (v: any) => any;
    month: (v: any) => any;
    day: (v: any) => any;
    hour: (v: any) => any;
    minute: (v: any) => any;
    second: (v: any) => any;
    now: () => Date;
    maxdatetime: () => Date;
    mindatetime: () => Date;
    floor: (v: any) => number;
    ceiling: (v: any) => number;
};
export declare class FilterVisitor implements VisitorMap {
    [k: string]: VisitorFunc;
    Visit(node: Token, context: any): any;
    private VisitFirstMemberExpression(node, context);
    private VisitBinaryExpression(node, context);
    protected VisitBoolParenExpression(node: Token, context: any): (a: any) => boolean;
    protected VisitLambdaVariableExpression(node: Token, context: any): (a: any) => any;
    protected VisitCountExpression(node: Token, context: any): (a: any) => any;
    protected VisitAllExpression(node: Token, context: any): (a: any) => any;
    protected VisitAnyExpression(node: Token, context: any): (a: any) => any;
    protected VisitFilter(node: Token, context: any): (a: any) => boolean;
    protected VisitNotExpression(node: Token, context: any): (a: any) => boolean;
    protected VisitEqualsExpression(node: Token, context: any): (a: any) => boolean;
    protected VisitNotEqualsExpression(node: Token, context: any): (a: any) => boolean;
    protected VisitGreaterThanExpression(node: Token, context: any): (a: any) => boolean;
    protected VisitLesserThanExpression(node: Token, context: any): (a: any) => boolean;
    protected VisitLesserOrEqualsExpression(node: Token, context: any): (a: any) => boolean;
    protected VisitGreaterOrEqualsExpression(node: Token, context: any): (a: any) => boolean;
    protected VisitImplicitVariableExpression(node: Token, context: any): (a: any) => any;
    protected VisitAndExpression(node: Token, context: any): (a: any) => any;
    protected VisitAddExpression(node: Token, context: any): (a: any) => any;
    protected VisitSubExpression(node: Token, context: any): (a: any) => number;
    protected VisitMulExpression(node: Token, context: any): (a: any) => number;
    protected VisitDivExpression(node: Token, context: any): (a: any) => number;
    protected VisitModExpression(node: Token, context: any): (a: any) => number;
    protected VisitParenExpression(node: Token, context: any): (a: any) => any;
    protected getLiteral(node: Token): any;
    protected VisitLiteral(node: Token, context: any): (a: any) => any;
    protected VisitMethodCallExpression(node: Token, context: any): (a: any) => any;
    protected VisitPropertyPathExpression(node: Token, context: any): any;
    protected VisitODataIdentifier(node: Token, context: any): (a: any) => any;
    protected VisitIsOfExpression(node: Token, context: any): (a: any) => boolean;
    protected VisitQualifiedEntityTypeName(node: Token, context: any): (a: any) => any;
    protected VisitEntityTypeName(node: Token, context: any): (a: any) => any;
    protected VisitOrExpression(node: Token, context: any): (a: any) => any;
    private resolveIdentifier(node);
    protected VisitIdentifier(node: any, context: any): (a: any) => any;
    protected VisitArray(node: Token, context: any): (a: any) => any[];
    protected VisitNegateExpression(node: Token, context: any): (a: any) => number;
}
