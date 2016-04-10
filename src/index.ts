import { FilterVisitor } from './FilterVisitor'
import { Parser } from 'odata-v4-parser/lib/parser'
import { Token } from 'odata-v4-parser/lib/lexer'
export { Token } from 'odata-v4-parser/lib/lexer'

interface ExpressionFunction {
  (entity: any): any
}

export interface FilterFunction {
  (entity: any): boolean
}
const filterVisitor = new FilterVisitor()



export namespace infrastructure {
  export function createFilterAst(odataFilter: string): Token {
    //does parser have state - its a question to ask tomorrow
    const p = new Parser()
    const ast = p.filter(odataFilter)
    return ast
  }
}

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
export function createFilter(odataFilter: string): FilterFunction {
  return filterVisitor.Visit(infrastructure.createFilterAst(odataFilter), {})
}

