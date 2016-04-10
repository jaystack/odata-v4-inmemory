var createFilter = require('../lib').createFilter
var expect = require('chai').expect

describe("inmemory visitor", () => {
   var f

  beforeEach(function() {
    var match
     if (match = this.currentTest.title.match(/expression\:  ?(.*)/)) {
       f = createFilter(match[1])
     }
  })

  it("expression: 1 eq 1", () => {
      expect(f()).to.be.true
  })

  it("expression: A eq 1", () => {
      expect(f({A:1})).to.be.true
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

  it("expression: (A/b eq B/a) or (B/c lt 4) and ((E add 2) gt B add A)", () => {
      expect(f({A:{b:1}})).to.equal(false)
  })

  it("expression: A/$count", () => {
      expect(f({A:[1,2,3]})).to.equal(3)
  })

  it("expression: A/$count eq 3", () => {
      expect(f({A:[1,2,3]})).to.equal(true)
  })

  it("expression: A/$count gt 2", () => {
      expect(f({A:[1,2,3]})).to.equal(true)
  })

  it("expression: A and B", () => {
      expect(f({A:1, B:2})).to.equal(2)
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

  it("expression: A add B", () => {
      expect(f({A:1, B:2})).to.equal(3)
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

  it("expression: A/all(i: i/a eq 1)", () => {
      expect(f({A: [{a:1},{a:1}]})).to.equal(true)
      expect(f({A: [{a:1},{a:2}]})).to.equal(false)
  })

  it("expression: A/any(i: i/a eq 1)", () => {
      expect(f({A: [{a:1},{a:2}]})).to.equal(true)
      expect(f({A: [{a:3},{a:2}]})).to.equal(false)
  })

  it("expression: substring(A, 2) eq 'BC'", () => {
      expect(f({A:'ABC'})).to.equal(true)
  })

  it("expression: substring('ABC', D) eq 'BC'", () => {
      expect(f({D:2})).to.equal(true)
  })

  it("expression: substring('ABC', 2) eq 'BC'", () => {
      expect(f({})).to.equal(true)
  })
})
