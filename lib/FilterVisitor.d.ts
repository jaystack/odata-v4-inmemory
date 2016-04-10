import { Token } from '../node_modules/odata-v4-parser/lib/lexer';
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
    protected VisitEqualsExpression(node: Token, context: any): (a: any) => boolean;
    protected VisitGreaterThanExpression(node: Token, context: any): (a: any) => boolean;
    protected VisitLesserThanExpression(node: Token, context: any): (a: any) => boolean;
    protected VisitImplicitVariableExpression(node: Token, context: any): (a: any) => any;
    protected VisitAndExpression(node: Token, context: any): (a: any) => any;
    protected VisitAddExpression(node: Token, context: any): (a: any) => any;
    protected VisitParenExpression(node: Token, context: any): (a: any) => any;
    protected getLiteral(node: Token): any;
    protected VisitLiteral(node: Token, context: any): (a: any) => any;
    protected VisitMethodCallExpression(node: Token, context: any): (a: any) => any;
    protected VisitODataIdentifier(node: Token, context: any): (a: any) => any;
    protected VisitOrExpression(node: Token, context: any): (a: any) => any;
}
