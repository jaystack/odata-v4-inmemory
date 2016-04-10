import { Token } from 'odata-v4-parser/lib/lexer';
export { Token } from 'odata-v4-parser/lib/lexer';
export interface FilterFunction {
    (entity: any): boolean;
}
export declare namespace infrastructure {
    function createFilterAst(odataFilter: string): Token;
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
export declare function createFilter(odataFilter: string): FilterFunction;
