import { Token } from 'odata-v4-parser/lib/lexer';
export interface ExpressionFunction {
    (entity: any): any;
}
export interface FilterFunction {
    (entity: any): boolean;
}
/**
 * Creates a filter function from an OData filter expression string
 * @param {string} odataFilter - A filter expression in OData $filter format
 * @return {FilterFunction}  JavaScript function that implements the filter predicate
 * @example
 * const filterFn = createFilter("Size eq 4 and startswith(Name,'Ch')")
 * const items = [{Size:1, Name:'Chai'}, {Size:4, Name:'Childrens book' }]
 * console.log(items.filter(filterFn))
 * >> [{Size:4, Name:'Childrens book'}]
 */
export declare function createFilter(filter: string): any;
export declare function createFilter(filter: Token): any;
/**
 * Compiles a value returning function from an OData expression string
 * @param {string} odataExpression - An expression in OData expression format
 * @return {ExpressionFunction}  JavaScript function that implements the expression
 * @example
 * const expression = compileExpression("concat((Size add 12) mul 3,Name)")
 * const item = {Size:1, Name:'Chai'}
 * console.log(expression(item))
 * >> 39Chai
 */
export declare function compileExpression(expression: string): any;
export declare function compileExpression(expression: Token): any;
