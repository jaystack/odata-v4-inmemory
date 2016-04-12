# OData V4 Service modules - InMemory Connector

Service OData v4 requests from an in memory data store.

## Synopsis
The OData V4 InMemory Connector provides functionality to convert the varios types of OData segments
into runnable JavaScript functions, that you can execute over an inmemory graph of objects.

In most cases servicing data from memory is not possible - in this case you can use the
[OData V4 MongoDB Connector](https://github.com/jaystack/odata-v4-mongodb)

The InMemory connector can be safely used in IoT devices.

## Potential usage scenarios

- Server: Create high speed, standard compliant data sharing apis
- Server: Use as a mock or swap-in for acceptance tests in place of the mongodb connector
- Client: use the OData syntax to define data queries or value returning expressions as strings (stored in a configuration) and compile and execute later as JS functions


## Usage as server - TypeScript
```javascript
 import { createFilter } from 'odata-v4-inmemory'

 //example request:  GET /api/products?$filter=category/id eq 5 or color eq 'Red'
 app.get("/api/products", (req: Request, res: Response) => {
   const data = getYourProductArray() //or similar :)
   const filterFn = createFilter(req.query.$filter)
   res.json(data.filter(filterFn))
 })
```

## Usage ES5
```javascript
 var createFilter = require('odata-v4-inmemory').createFilter

 app.get("/api/products", function(req, res) {
   var data = getYourProductArray() //or similar :)
   var filterFn = createFilter(req.query.$filter)
   res.json(data.filter(filterFn))
 })
```

## Using as expression engine
```javascript
 import { compileExpression } from 'odata-v4-inmemory'

 const expression = compileExpression("concat((Size add 12) mul 3,Name)")
 const item = {Size:1, Name:'Chai'}
 console.log(expression(item))
 >> 39Chai
```

## Supported OData segments


For now **$filter**

Support for **$select** and **$expand** is next.


### Supported $filter expressions
The [OData v4 Parser](https://www.npmjs.com/package/odata-v4-parser) layer supports 100% of the specification.
The Connector is about 90% ready on filters. Except for date arithmetic, and geo.* everything is supported.

*We are into creating a comprehensive feature availability chart for V1 release*

    ✓ expression 5.1.1.6.3: null
    ✓ expression 5.1.1.6.1: NullValue eq null
    ✓ expression 5.1.1.6.1: duration'P12DT23H59M59.999999999999S'
    ✓ expression 5.1.1.6.1: A eq INF
    ✓ expression 5.1.1.6.1: A eq 0.31415926535897931e1
    ✓ expression 5.1.1.6.1: A add B eq hour(07:59:59.999)
    ✓ expression 5.1.1.6.2: ["a","b"]
    ✓ expression 5.1.1.1.1: 1 eq 1
    ✓ expression 5.1.1.1.1: null eq null
    ✓ expression 5.1.1.1.2: A ne 1
    ✓ expression 5.1.1.1.3: A gt 2
    ✓ expression 5.1.1.1.4: A ge 3
    ✓ expression 5.1.1.1.5: A lt 2
    ✓ expression 5.1.1.1.6: A le 2
    ✓ expression 5.1.1.2.3: -A eq 1
    ✓ expression: A
    ✓ expression: A/b
    ✓ expression: A/b eq 1
    ✓ expression: A/b eq A/b
    ✓ expression 5.1.1.3: (A/b eq B/a) or (B/c lt 4) and ((E add 2) gt B add A)
    ✓ expression 5.1.1.1.9: not A ne 1
    - expression 5.1.1.1.10: A has enum'b
    ✓ expression 4.8: A/$count
    ✓ expression: A/$count eq 3
    ✓ expression: A le B
    ✓ expression: A ge B
    ✓ expression 5.1.1.1.7: A and B
    ✓ expression 5.1.1.1.8: A or B
    ✓ expression: (A and B)
    ✓ expression: A/$count gt 2 and A/$count lt 4
    ✓ expression: (A/$count gt 2) and A/$count lt 3
    ✓ expression 5.1.1.2.1: A add B
    - expression 5.1.1.2.1: '2016-01-01' add 'P4DT15H'
    - expression 5.1.1.2.1: '2016-01-01T12:00:00Z' add 'P4DT15H'
    - expression 5.1.1.2.1: duration'P4DT15H' add duration'P4DT15H'
    ✓ expression 5.1.1.2.1: A sub B
    - expression 5.1.1.2.1: '2016-01-01T12:00:00Z' sub 'P4DT15H'
    ✓ expression: 5 sub 10
    ✓ expression 5.1.1.2.4: A mul B
    ✓ expression 5.1.1.2.4: 5 mul 10
    ✓ expression 5.1.1.2.5: 10 div 3
    ✓ expression 5.1.1.2.5: (A mul B) div 10
    ✓ expression 5.1.1.2.6: (A mod B) div 10
    ✓ expression: A add 'B'
    ✓ expression: 'A' add 'B'
    ✓ expression: A/$count add B/$count eq 7
    ✓ expression: $it eq 5
    ✓ expression: true eq false
    ✓ expression: true eq false
    ✓ expression: A/all(i:i eq 1)
    ✓ expression: A/all(i:$it eq 1)
    ✓ expression 5.1.1.5.2: A/all(i: i/a eq 1)
    ✓ expression 5.1.1.5.1: A/any(i: i/a eq 1)
    ✓ expression 5.1.1.4.6: substring(A, 2) eq 'BC'
    ✓ expression: substring('ABC', D) eq 'BC'
    ✓ expression: substring('ABC', 2) eq 'BC'
    ✓ expression: A eq 1.5
    ✓ expression: A eq year(2016-01-01)
    ✓ expression 5.1.1.4.1: contains(A, 'BC')
    ✓ expression 5.1.1.4.2: endswith(A, 'CD')
    ✓ expression 5.1.1.4.3: startswith(A, 'CD')
    ✓ expression 5.1.1.4.4: length(A) eq 3
    ✓ expression 5.1.1.4.5: indexof(A, 'DE')
    ✓ expression 5.1.1.4.7: tolower(A) eq 'abc'
    ✓ expression 5.1.1.4.8: toupper(A) eq 'ABC'
    ✓ expression 5.1.1.4.9: trim(A) eq 'abc'
    ✓ expression 5.1.1.4.10: concat(A,B) eq 'fubar'
    ✓ expression 5.1.1.4.10: concat(A,concat(B,C)) eq 'fubardoh'
    ✓ expression 5.1.1.4.11: A eq year(2016-01-01T13:00Z)
    ✓ expression 5.1.1.4.12: A eq month(2016-01-01T13:00Z)
    ✓ expression 5.1.1.4.13: A eq day(2016-01-01T13:00Z)
    ✓ expression 5.1.1.4.14: A eq hour(2016-01-01T13:00Z)
    ✓ expression 5.1.1.4.15: A eq minute(2016-01-01T13:00Z)
    ✓ expression 5.1.1.4.16: A eq second(2016-01-01T13:00:02Z)
    ✓ expression 5.1.1.4.21: year(now())
    ✓ expression 5.1.1.4.22: year(maxdatetime())
    ✓ expression 5.1.1.4.23: year(mindatetime())
    - expression 5.1.1.4.24: totalseconds(A)
    ✓ expression 5.1.1.4.25: round(A) eq 42
    ✓ expression 5.1.1.4.26: floor(A) eq 42
    ✓ expression 5.1.1.4.27: ceiling(A) eq 42
    ✓ expression 5.1.1.4.28: isof(Model.Order)
    ✓ expression 5.1.1.4.28: isof($it, Model.Order)
    ✓ expression 5.1.1.4.28: Orders/all(item: isof(item, Model.Order))
    - expression 5.1.1.4.29: cast(A, Edm.String)
    - expression 5.1.1.4.30: geo.distance(A, B)
    - expression 5.1.1.4.31: geo.intersects(A, B)
    - expression 5.1.1.4.31: geo.length(A)
