import { TokenType, Token } from '../node_modules/odata-v4-parser/lib/lexer'



export interface VisitorFuncRes {
  (a: any): any
}

export interface VisitorFunc {
  (node: Token, context: any): VisitorFuncRes | Array<VisitorFuncRes>
}

export interface VisitorMap {
  [key: string]: VisitorFunc
}

export const ODataMethodMap = {
  round: v => Math.round(v),
  indexof: (v, i) => v.indexOf && v.indexOf(i),
  substring: (v, i) => v.substr(i - 1)
}

export class FilterVisitor implements VisitorMap {
  [k: string]: VisitorFunc;


  Visit(node: Token, context: any) {
    //console.log("Visiting: ", node.type)
    switch (node.type) {
      //these are auto handled by visitor bubbling
      case TokenType.CollectionPathExpression:
      case TokenType.LambdaPredicateExpression:
      case TokenType.MemberExpression:
      case TokenType.PropertyPathExpression:
      case TokenType.SingleNavigationExpression:
      case TokenType.CommonExpression:
      case undefined:
        break;
      default:
        const fun = this[`Visit${node.type}`]
        if (fun) {
          return fun.call(this, node, context)
        }
        console.log(`Unhandled node type, falling back: ${node.type}`)
    }
    return this.Visit(node.value, context)
  }

  //todo fix AST so that we dont need this
  private VisitFirstMemberExpression(node: Token, context: any)  {
    if (Array.isArray(node.value)) {
      const [current, next] = node.value
      return this.VisitODataIdentifier(<Token>{value:{ current, next}}, context)
    }
    return this.Visit(node.value, context)
  }

  private VisitBinaryExpression(node: Token, context: any) {
    return [this.Visit(node.value.left, context), this.Visit(node.value.right, context)]
  }

  protected VisitBoolParenExpression(node: Token, context: any) {
    var inner = this.Visit(node.value, context)
    return a => !!inner(a)
  }

  protected VisitLambdaVariableExpression(node: Token, context: any) {
    return a => a
  }

  protected VisitCountExpression(node: Token, context: any) {
    return a => (a && a.length) || 0
  }

  protected VisitAllExpression(node: Token, context: any) {
    const predicate = this.Visit(node.value.predicate, context)
    return a => a.every && a.every(predicate)
  }

  protected VisitAnyExpression(node: Token, context: any) {
    const predicate = this.Visit(node.value.predicate, context)
    return a => a.some && a.some(predicate)
  }


  protected VisitFilter(node: Token, context: any) {
    var predicate = this.Visit(node.value, context)
    return a => !!predicate(a)
  }

  protected VisitEqualsExpression(node: Token, context: any) {
    var [left, right] = this.VisitBinaryExpression(node, context)
    return a => left(a) === right(a)
  }

  protected VisitGreaterThanExpression(node: Token, context: any) {
    var [left, right] = this.VisitBinaryExpression(node, context)
    return a => left(a) > right(a)
  }

  protected VisitLesserThanExpression(node: Token, context: any) {
    var [left, right] = this.VisitBinaryExpression(node, context)
    return a => left(a) < right(a)
  }

  protected VisitImplicitVariableExpression(node: Token, context: any) {
    return a => a
  }
  protected VisitAndExpression(node: Token, context: any) {
    var [left, right] = this.VisitBinaryExpression(node, context)
    return a => left(a) && right(a)
  }

  protected VisitAddExpression(node: Token, context: any) {
    var [left, right] = this.VisitBinaryExpression(node, context)
    return a => left(a) + right(a)
  }

  protected VisitParenExpression(node: Token, context: any) {
    var fn = this.Visit(node.value, context)
    return a => fn(a)
  }
  protected getLiteral(node: Token): any {
    switch(node.value) {
      case "Edm.SByte":     return  parseInt(node.raw)
      case "Edm.Boolean":   return  node.raw === "true"
      case "Edm.String":    return  node.raw.replace(/'/g,'')
      default:
        console.log("unknown value type:" + node.value)
    }
    return node.raw
  }
  protected VisitLiteral(node: Token, context: any) {
    return a => this.getLiteral(node)
  }

  protected VisitMethodCallExpression(node: Token, context: any) {
    var method = ODataMethodMap[node.value.method]
    var params = node.value.parameters.map(p => this.Visit(p, context))
    return a => method.apply(this, params.map(p => p(a)))
  }

  protected VisitODataIdentifier(node: Token, context: any) {
    if (node.value.name) {
      return a => a[node.value.name]
    }
    const current = this.Visit(node.value.current, context)
    const next = this.Visit(node.value.next, context)
    return a => next(current(a) || {})
  }

  protected VisitOrExpression(node: Token, context: any) {
    var [left, right] = this.VisitBinaryExpression(node, context)
    return a => left(a) || right(a)
  }


}



