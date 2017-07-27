import { TokenType, Token } from 'odata-v4-parser/lib/lexer'



export interface VisitorFuncRes {
  (a: any): any
}

export interface VisitorFunc {
  (node: Token, context: any): VisitorFuncRes | Array<VisitorFuncRes>
}

export interface VisitorMap {
  [key: string]: VisitorFunc
}

const minDateTime = new Date(-8640000000000000)
const maxDateTime = new Date(8640000000000000)
export const ODataMethodMap = {
  round: v => Math.round(v),
  indexof: (v, i) => v.indexOf && v.indexOf(i),
  substring: (v, i) => v.substr(i - 1),
  contains: (v, i) => v.includes(i),
  endswith: (v, i) => v.endsWith(i),
  startswith: (v, i) => v.startsWith(i),
  length: v => v.length,
  tolower: v => v.toLowerCase(),
  toupper: v => v.toUpperCase(),
  trim: v => v.trim(),
  concat: (v,i) => typeof v == 'number' ? v.toString().concat(i) : v.concat(i),
  year: v => v.getFullYear(),
  month: v => v.getMonth() + 1,
  day: v => v.getDate(),
  hour: v => v.getHours(),
  minute: v => v.getMinutes(),
  second: v => v.getSeconds(),
  now: () => new Date(),
  maxdatetime: () => maxDateTime,
  mindatetime: () => minDateTime,
  floor: v => Math.floor(v),
  ceiling: v => Math.ceil(v),
  //isof: (v, i) => return v
}

export class FilterVisitor implements VisitorMap {
  [k: string]: VisitorFunc;


  Visit(node: Token, context: any) {
    //console.log("Visiting: ", node.type)
    if (!node) {
      throw new Error("Node cannot be empty")
    }
    switch (node.type) {
      //these are auto handled by visitor bubbling
      case TokenType.CollectionPathExpression:
      case TokenType.LambdaPredicateExpression:
      case TokenType.MemberExpression:
      case TokenType.SingleNavigationExpression:
      case TokenType.CommonExpression:
      case TokenType.ArrayOrObject:
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

  protected VisitNotExpression(node: Token, context: any) {
    var expression = this.Visit(node.value, context)
    return a => !expression(a)
  }

  protected VisitEqualsExpression(node: Token, context: any) {
    var [left, right] = this.VisitBinaryExpression(node, context)
    return a => left(a) === right(a)
  }

  protected VisitNotEqualsExpression(node: Token, context: any) {
    var [left, right] = this.VisitBinaryExpression(node, context)
    return a => left(a) !== right(a)
  }

  protected VisitGreaterThanExpression(node: Token, context: any) {
    var [left, right] = this.VisitBinaryExpression(node, context)
    return a => left(a) > right(a)
  }

  protected VisitLesserThanExpression(node: Token, context: any) {
    var [left, right] = this.VisitBinaryExpression(node, context)
    return a => left(a) < right(a)
  }

  protected VisitLesserOrEqualsExpression(node: Token, context: any) {
    var [left, right] = this.VisitBinaryExpression(node, context)
    return a => left(a) <= right(a)
  }

  protected VisitGreaterOrEqualsExpression(node: Token, context: any) {
    var [left, right] = this.VisitBinaryExpression(node, context)
    return a => left(a) >= right(a)
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
  protected VisitSubExpression(node: Token, context: any) {
    var [left, right] = this.VisitBinaryExpression(node, context)
    return a => left(a) - right(a)
  }
  protected VisitMulExpression(node: Token, context: any) {
    var [left, right] = this.VisitBinaryExpression(node, context)
    return a => left(a) * right(a)
  }
  protected VisitDivExpression(node: Token, context: any) {
    var [left, right] = this.VisitBinaryExpression(node, context)
    return a => left(a) / right(a)
  }
  protected VisitModExpression(node: Token, context: any) {
    var [left, right] = this.VisitBinaryExpression(node, context)
    return a => left(a) % right(a)
  }

  protected VisitParenExpression(node: Token, context: any) {
    var fn = this.Visit(node.value, context)
    return a => fn(a)
  }

  protected getLiteral(node: Token): any {
    switch(node.value) {
      case 'null':          return  null
      case "Edm.SByte":     return  parseInt(node.raw)
      case "Edm.Decimal":   return  parseFloat(node.raw)
      case "Edm.Double":    switch(node.raw) {
        case 'INF': return Infinity
        default: return parseFloat(node.raw)
      }
      case "Edm.Boolean":   return  node.raw === "true"
      //todo: check if string is actually a valid literal type
      case "string":
      case "Edm.String":
        return decodeURIComponent(node.raw).replace(/'/g,'').replace(/\"/g,"");
      case "Edm.DateTimeOffset":
      case "Edm.Date":
        return  new Date(node.raw)
      case "Edm.TimeOfDay":
        return new Date(`1970-01-01T${node.raw}Z`)
      case "Edm.Duration":
        var m = node.raw.match(/P([0-9]*D)?T?([0-9]{1,2}H)?([0-9]{1,2}M)?([\.0-9]*S)?/)
        if (m) {
          var d = new Date(0);
          for(var i = 1; i < m.length; i++) {
            switch(m[i].slice(-1)) {
              case 'D': d.setDate(parseInt(m[i])); continue;
              case 'H': d.setHours(parseInt(m[i])); continue;
              case 'M': d.setMinutes(parseInt(m[i])); continue;
              case 'S': d.setSeconds(parseInt(m[i])); continue;
            }
          }
          return d;
        }
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
    var params = (node.value.parameters || []).map(p => this.Visit(p, context))
    if (!method) {
      console.log(`Unknown method ${node.value.method}`)
      return a => a
    }
    return a => method.apply(this, params.map(p => p(a)))
  }

  protected VisitPropertyPathExpression(node: Token, context: any) {
      if (node.value.name) {
        return a => a[node.value.name]
      }
      if (node.value.current && node.value.next){
          const current = this.Visit(node.value.current, context)
          const next = this.Visit(node.value.next, context)
          return a => next(current(a) || {})
      }
      return this.Visit(node.value, context);
  }

  protected VisitODataIdentifier(node: Token, context: any) {
    if (node.value.name) {
      return a => a[node.value.name]
    }
    const current = this.Visit(node.value.current, context)
    const next = this.Visit(node.value.next, context)
    return a => next(current(a) || {})
  }

  protected VisitIsOfExpression(node: Token, context: any) {
    var type = this.Visit(node.value.typename, context)
    if (!node.value.target) {
      return a => {
        return a.constructor.name === type(a)
      }
    }
    var target = this.Visit(node.value.target, context)
    return a => target(a).constructor.name === type(a)
  }

  protected VisitQualifiedEntityTypeName(node: Token, context: any) {
    return a => this.Visit(node.value, context)(a);
  }

  protected VisitEntityTypeName(node: Token, context: any) {
    return a => node.value.name;
  }

  protected VisitOrExpression(node: Token, context: any) {
    var [left, right] = this.VisitBinaryExpression(node, context)
    return a => left(a) || right(a)
  }

  private resolveIdentifier(node) {
    switch(node.value) {
      case 'EntityTypeName':
        return node.raw.split(".").slice(-1)[0]
    }
  }
  //this needs double check. why is model type model as 'identifier'
  protected VisitIdentifier(node, context) {
    return a => this.resolveIdentifier(node)
  }


  protected VisitArray(node: Token, context: any) {
    var items = (node.value.items || []).map( item => this.Visit(item, context))
    return a => [...items.map(item => item(a))]
  }

  protected VisitNegateExpression(node: Token, context: any) {
    var exp = this.Visit(node.value, context)
    return a => -exp(a)
  }
}
