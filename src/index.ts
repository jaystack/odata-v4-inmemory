import { FilterVisitor } from './FilterVisitor'
import { filter as parseFilter } from 'odata-v4-parser'
import { Token } from 'odata-v4-parser/lib/lexer'

export interface ExpressionFunction {
  (entity: any): any
}

export interface FilterFunction {
  (entity: any): boolean
}

const filterVisitor = new FilterVisitor();

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
export function createFilter(filter:string);
export function createFilter(filter:Token);
export function createFilter(filter: string | Token): FilterFunction {
  let ast:Token = <Token>(typeof filter == "string" ? parseFilter(<string>filter) : filter);
  return filterVisitor.Visit(ast, {});
}

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
export function compileExpression(expression:string);
export function compileExpression(expression:Token);
export function compileExpression(expression: string | Token): ExpressionFunction {
  let ast:Token = <Token>(typeof expression == "string" ? parseFilter(<string>expression) : expression);
  return filterVisitor.Visit(ast, {})
}