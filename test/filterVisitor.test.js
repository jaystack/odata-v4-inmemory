var createFilter = require('../lib').createFilter
var expect = require('chai').expect

describe("inmemory visitor", () => {
   var f
   var e
  beforeEach(function() {
    var match
     if (match = this.currentTest.title.match(/expression[^\:]*\:  ?(.*)/)) {
       e = f = createFilter(match[1])
     }
  })

  //all numbers are referencing this:
  //http://docs.oasis-open.org/odata/odata/v4.0/errata02/os/complete/part2-url-conventions/odata-v4.0-errata02-os-part2-url-conventions-complete.html#_Toc406398116

  it("expression 5.1.1.6.3: null", () => {
      expect(e()).to.be.null
  })

  it("expression 5.1.1.6.1: NullValue eq null", () => {
      expect(f({NullValue: null})).to.be.true
  })

  it("expression 5.1.1.6.1: duration'P12DT23H59M59.999999999999S'", () => {
      expect(e({}).getTime()).to.eql(1036799000)
  })

  it("expression 5.1.1.6.1: A eq INF", () => {
      expect(f({A: Infinity})).to.be.true
  })

  it("expression 5.1.1.6.1: A eq 0.31415926535897931e1", () => {
      expect(f({A: 0.31415926535897931e1})).to.be.true
  })

  it("expression 5.1.1.6.1: A add B eq hour(07:59:59.999)", () => {
      expect(f({A: 3, B: 4})).to.be.true
  })

  it('expression 5.1.1.6.2: ["a","b"]', () => {
      expect(e({A: 3, B: 4})).to.eql(['a','b'])
  })

  it("expression 5.1.1.1.1: 1 eq 1", () => {
      expect(f()).to.be.true
  })

  it("expression 5.1.1.1.1: null eq null", () => {
      expect(f()).to.be.true
  })

  it("expression 5.1.1.1.2: A ne 1", () => {
      expect(f({A:1})).to.equal(false)
      expect(f({A:2})).to.equal(true)
  })

  it("expression 5.1.1.1.3: A gt 2", () => {
      expect(f({A: 3})).to.equal(true)
  })

  it("expression 5.1.1.1.4: A ge 3", () => {
      expect(f({A: 3})).to.equal(true)
  })

  it("expression 5.1.1.1.5: A lt 2", () => {
      expect(f({A: 1})).to.equal(true)
  })

  it("expression 5.1.1.1.6: A le 2", () => {
      expect(f({A: 2})).to.equal(true)
  })

  it("expression 5.1.1.2.3: -A eq 1", () => {
      expect(f({A:-1})).to.be.true
  })

  it("expression: A", () => {
      expect(f({A:1})).to.equal(1)
  })

  it("expression: A/b", () => {
      expect(f({A:{b:42}})).to.equal(42)
  })

  it("expression: A/b eq 1", () => {
      expect(f({A:{b:1}})).to.equal(true)
      expect(f({A:{b:2}})).to.equal(false)
  })

  it("expression: A/b eq A/b", () => {
      expect(f({A:{b:1}})).to.equal(true)
  })

  it("expression 5.1.1.3: (A/b eq B/a) or (B/c lt 4) and ((E add 2) gt B add A)", () => {
      expect(f({A:{b:1}})).to.equal(false)
  })

  it("expression 5.1.1.1.9: not A ne 1", () => {
      expect(f({A:1})).to.equal(true)
      expect(f({A:2})).to.equal(false)
  })

  xit("expression 5.1.1.1.10: A has enum'b", () => {

  })

  it("expression 4.8: A/$count", () => {
      expect(f({A:[1,2,3]})).to.equal(3)
  })

  it("expression: A/$count eq 3", () => {
      expect(f({A:[1,2,3]})).to.equal(true)
  })

  it("expression: A le B", () => {
      expect(f({A:1, B:2})).to.equal(true)
      expect(f({A:2, B:2})).to.equal(true)
      expect(f({A:3, B:2})).to.equal(false)
  })

  it("expression: A ge B", () => {
      expect(f({A:1, B:2})).to.equal(false)
      expect(f({A:2, B:2})).to.equal(true)
      expect(f({A:3, B:2})).to.equal(true)
  })

  it("expression 5.1.1.1.7: A and B", () => {
      expect(f({A:1, B:2})).to.equal(2)
  })

  it("expression 5.1.1.1.8: A or B", () => {
      expect(e({A:1, B:2})).to.equal(1)
  })

  it("expression: (A and B)", () => {
      expect(f({A:1, B:2})).to.equal(true)
  })


  it("expression: A/$count gt 2 and A/$count lt 4", () => {
      expect(f({A:[1,2,3]})).to.equal(true)
  })

  it("expression: (A/$count gt 2) and A/$count lt 3", () => {
      expect(f({A:[1,2,3]})).to.equal(false)
  })

  it("expression 5.1.1.2.1: A add B", () => {
      expect(f({A:1, B:2})).to.equal(3)
  })

  //undone
  xit("expression 5.1.1.2.1: '2016-01-01' add 'P4DT15H'", () => {
      expect(f({A:1, B:2})).to.equal(3)
  })

  //undone
  xit("expression 5.1.1.2.1: '2016-01-01T12:00:00Z' add 'P4DT15H'", () => {
      expect(f({A:1, B:2})).to.equal(3)
  })

  //undone
  xit("expression 5.1.1.2.1: duration'P4DT15H' add duration'P4DT15H'", () => {
      expect(f({A:1, B:2})).to.equal(3)
  })


  it("expression 5.1.1.2.1: A sub B", () => {
      expect(f({A:1, B:2})).to.equal(-1)
  })

  xit("expression 5.1.1.2.1: '2016-01-01T12:00:00Z' sub 'P4DT15H'", () => {
      expect(f({A:1, B:2})).to.equal(3)
  })

  it("expression: 5 sub 10", () => {
      expect(f({A:1, B:2})).to.equal(-5)
  })

  it("expression 5.1.1.2.4: A mul B", () => {
      expect(f({A:1, B:2})).to.equal(2)
  })

  it("expression 5.1.1.2.4: 5 mul 10", () => {
      expect(f({A:1, B:2})).to.equal(50)
  })

  it("expression 5.1.1.2.5: 10 div 3", () => {
      expect(f({A:1, B:2})).to.equal(3.3333333333333335)
  })

  it("expression 5.1.1.2.5: (A mul B) div 10", () => {
      expect(f({A:1, B:2})).to.equal(0.2)
  })
  it("expression 5.1.1.2.6: (A mod B) div 10", () => {
      expect(f({A:3, B:2})).to.equal(0.1)
  })

  it("expression: A add 'B'", () => {
      expect(f({A:1, B:2})).to.equal('1B')
  })

  it("expression: 'A' add 'B'", () => {
      expect(f({A:1, B:2})).to.equal('AB')
  })

  it("expression: A/$count add B/$count eq 7", () => {
      expect(f({A:[1,2,3], B:[1,2,3,4]})).to.equal(true)
  })

  it("expression: $it eq 5", () => {
      expect(f(5)).to.equal(true)
  })

  it("expression: true eq false", () => {
      expect(f(5)).to.equal(false)
  })

  it("expression: true eq false", () => {
      expect(f(5)).to.equal(false)
  })

  it("expression: A/all(i:i eq 1)", () => {
      expect(f({A: [1,1,1,1]})).to.equal(true)
      expect(f({A: [1,1,1,2]})).to.equal(false)
  })

  it("expression: A/all(i:$it eq 1)", () => {
      expect(f({A: [1,1,1,1]})).to.equal(true)
  })

  it("expression 5.1.1.5.2: A/all(i: i/a eq 1)", () => {
      expect(f({A: [{a:1},{a:1}]})).to.equal(true)
      expect(f({A: [{a:1},{a:2}]})).to.equal(false)
  })

  it("expression 5.1.1.5.1: A/any(i: i/a eq 1)", () => {
      expect(f({A: [{a:1},{a:2}]})).to.equal(true)
      expect(f({A: [{a:3},{a:2}]})).to.equal(false)
  })

  it("expression 5.1.1.4.6: substring(A, 2) eq 'BC'", () => {
      expect(f({A:'ABC'})).to.equal(true)
  })

  it("expression: substring('ABC', D) eq 'BC'", () => {
      expect(f({D:2})).to.equal(true)
  })

  it("expression: substring('ABC', 2) eq 'BC'", () => {
      expect(f({})).to.equal(true)
  })

  it("expression: A eq 1.5", () => {
      expect(f({A: 1.5})).to.equal(true)
  })

  it("expression: A eq year(2016-01-01)", () => {
      expect(f({A: 2016})).to.equal(true)
  })

  it("expression 5.1.1.4.1: contains(A, 'BC')", () => {
      expect(f({A: 'ABCD'})).to.equal(true)
  })

  it("expression 5.1.1.4.2: endswith(A, 'CD')", () => {
      expect(f({A: 'ABCD'})).to.equal(true)
      expect(f({A: 'ABCDE'})).to.equal(false)
  })

  it("expression 5.1.1.4.3: startswith(A, 'CD')", () => {
      expect(f({A: 'CDE'})).to.equal(true)
      expect(f({A: 'ABCDE'})).to.equal(false)
  })

  it("expression 5.1.1.4.4: length(A) eq 3", () => {
      expect(f({A: 'CDE'})).to.equal(true)
      expect(f({A: 'ABCDE'})).to.equal(false)
  })
  it("expression 5.1.1.4.5: indexof(A, 'DE')", () => {
      expect(f({A: 'CDE'})).to.equal(1)
      expect(f({A: 'ABCDE'})).to.equal(3)
  })

  it("expression 5.1.1.4.7: tolower(A) eq 'abc'", () => {
      expect(f({A: 'ABC'})).to.equal(true)
      expect(f({A: 'DEF'})).to.equal(false)
  })

  it("expression 5.1.1.4.8: toupper(A) eq 'ABC'", () => {
      expect(f({A: 'abc'})).to.equal(true)
      expect(f({A: 'def'})).to.equal(false)
  })

  it("expression 5.1.1.4.9: trim(A) eq 'abc'", () => {
      expect(f({A: ' abc '})).to.equal(true)
  })

  it("expression 5.1.1.4.10: concat(A,B) eq 'fubar'", () => {
      expect(f({A:'fu',B:'bar'})).to.equal(true)
  })

  it("expression 5.1.1.4.10: concat(A,concat(B,C)) eq 'fubardoh'", () => {
      expect(f({A:'fu',B:'bar', C:'doh'})).to.equal(true)
  })

  it("expression 5.1.1.4.11: A eq year(2016-01-01T13:00Z)", () => {
      expect(f({A: 2016})).to.equal(true)
  })

  it("expression 5.1.1.4.12: A eq month(2016-01-01T13:00Z)", () => {
      expect(f({A: 1})).to.equal(true)
  })

  it("expression 5.1.1.4.13: A eq day(2016-01-01T13:00Z)", () => {
      expect(f({A: 1})).to.equal(true)
  })

  it("expression 5.1.1.4.14: A eq hour(2016-01-01T13:00Z)", () => {
      expect(f({A: 13})).to.equal(true)
  })

  it("expression 5.1.1.4.15: A eq minute(2016-01-01T13:00Z)", () => {
      expect(f({A: 0})).to.equal(true)
  })

  it("expression 5.1.1.4.16: A eq second(2016-01-01T13:00:02Z)", () => {
      expect(f({A: 02})).to.equal(true)
  })

  it("expression 5.1.1.4.21: year(now())", () => {
      expect(f({})).to.equal(new Date().getFullYear())
  })

  it("expression 5.1.1.4.22: year(maxdatetime())", () => {
      expect(f({})).to.equal(275760)
  })

  it("expression 5.1.1.4.23: year(mindatetime())", () => {
      expect(f({})).to.equal(-271821)
  })

  //parser ok
  //undone
  xit("expression 5.1.1.4.24: totalseconds(A)", () => {
      expect(f({A: 'P6DT23H59M59.9999S'})).to.equal(-271821)
  })

  it("expression 5.1.1.4.25: round(A) eq 42", () => {
      expect(f({A: 41.9})).to.equal(true)
  })

  it("expression 5.1.1.4.26: floor(A) eq 42", () => {
      expect(f({A: 42.9})).to.equal(true)
  })

  it("expression 5.1.1.4.27: ceiling(A) eq 42", () => {
      expect(f({A: 41.3})).to.equal(true)
  })

  it("expression 5.1.1.4.28: isof(Model.Order)", () => {
      function Order() { }
      expect(f(new Order())).to.equal(true)
  })

  it("expression 5.1.1.4.28: isof($it, Model.Order)", () => {
      function Order() { }
      expect(f(new Order())).to.equal(true)
  })

  it("expression 5.1.1.4.28: Orders/all(item: isof(item, Model.Order))", () => {
      function Order() { }
      expect(f({Orders: [new Order()]})).to.equal(true)
      expect(f({Orders: [new Order(),{}]})).to.equal(false)
  })


  //parser error
  //undone
  xit("expression 5.1.1.4.29: cast(A, Edm.String)", () => {
      expect(f({A: 41.3})).to.equal(true)
  })

  //parser ok
  //undone
  xit("expression 5.1.1.4.30: geo.distance(A, B)", () => {
      expect(f({A: 41.3})).to.equal(true)
  })

  //parser ok
  //undone
  xit("expression 5.1.1.4.31: geo.intersects(A, B)", () => {
      expect(f({A: 41.3})).to.equal(true)
  })

  //parser ok
  //undone
  xit("expression 5.1.1.4.31: geo.length(A)", () => {
      expect(f({A: 41.3})).to.equal(true)
  })



})
