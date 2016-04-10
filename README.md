# OData V4 Service modules - InMemory Connector

Service OData v4 requests from an in memory data store.

## Synopsis
The OData V4 InMemory Connector provides functionality to convert the varios OData expressions
into runnable JavaScript functions, that you can execute over an inmemory graph of objects.

This connector is useful to create high speed, standard compliant data sharing apis
or can be used as a mock or swap-in for acceptance tests.

In most cases servicing data from memory is not possible - in this case you can use the
[OData V4 MongoDB Connector](https://github.com/jaystack/odata-server-example)


## Usage TS
```javascript
 import { createFilter } from 'odata-inmemory-connector'

 app.get("/api/products", (req: Request, res: Response) => {
   const data = getYourProductArray() //or similar :)
   const filterFn = createFilter(req.query.$filter)
   res.json(data.filter(filterFn))
 })
```

## Usage ES5
```javascript
 var createFilter = require('odata-inmemory-connector').createFilter

 app.get("/api/products", function(req, res) {
   var data = getYourProductArray() //or similar :)
   var filterFn = createFilter(req.query.$filter)
   res.json(data.filter(filterFn))
 })
```


## Supported OData segments


For now **$filter**, support for **$select** and **$expand** is next.


### Supported $filter expressions
The [OData v4 Parser](https://www.npmjs.com/package/odata-v4-parser) layer supports 100% of the specification.
The InMemory Connector is about 80% ready.

*We are into creating a comprehensive feature availability chart for V1 release*

    ✓ expression: 1 eq 1
    ✓ expression: A eq 1
    ✓ expression: A
    ✓ expression: A/b
    ✓ expression: A/b eq 1
    ✓ expression: A/b eq A/b
    ✓ expression: A/$count
    ✓ expression: A/$count eq 3
    ✓ expression: A/$count gt 2
    ✓ expression: A and B
    ✓ expression: (A and B)
    ✓ expression: A/$count gt 2 and A/$count lt 4
    ✓ expression: (A/$count gt 2) and A/$count lt 3
    ✓ expression: A add B
    ✓ expression: A add 'B'
    ✓ expression: 'A' add 'B'
    ✓ expression: A/$count add B/$count eq 7
    ✓ expression: $it eq 5
    ✓ expression: true eq false
    ✓ expression: true eq false
    ✓ expression: A/all(i:i eq 1)
    ✓ expression: A/all(i:$it eq 1)
    ✓ expression: A/all(i: i/a eq 1)
    ✓ expression: A/any(i: i/a eq 1)
    ✓ expression: substring(A, 2) eq 'BC'
    ✓ expression: substring('ABC', D) eq 'BC'
    ✓ expression: substring('ABC', 2) eq 'BC'




