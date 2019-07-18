const format = require('../import/format')
const Place = require('./Place')
const Identity = require('./Identity')
const Ontology = require('./Ontology')
const Property = require('./Property')
const Name = require('./Name')
const Hierarchy = require('./Hierarchy')

module.exports.tests = {}

const fixture = {
  identity: new Identity('A', '1'),
  ontology: new Ontology('B', '2'),
  property: new Property('A', 'B'),
  name: new Name('EN', 'test', false, 'example'),
  hierarchy: new Hierarchy(
    new Identity('A', '1'),
    new Identity('B', '2'),
    'branch'
  ),
  geometry: format.from('polygon', 'geojson', require('../test/fixture/geojson.triangle'))
}

module.exports.tests.constructor = (test) => {
  test('constructor: empty', (t) => {
    let p = new Place()
    t.equals(p.identity, undefined)
    t.equals(p.ontology, undefined)
    t.end()
  })
  test('constructor: identity only', (t) => {
    let p = new Place(fixture.identity)
    t.equals(p.identity, fixture.identity)
    t.equals(p.ontology, undefined)
    t.end()
  })
  test('constructor: ontology only', (t) => {
    let p = new Place(undefined, fixture.ontology)
    t.equals(p.identity, undefined)
    t.equals(p.ontology, fixture.ontology)
    t.end()
  })
  test('constructor: identity & ontology', (t) => {
    let p = new Place(fixture.identity, fixture.ontology)
    t.equals(p.identity, fixture.identity)
    t.equals(p.ontology, fixture.ontology)
    t.end()
  })
}

module.exports.tests.setIdentity = (test) => {
  test('setIdentity: undefined', (t) => {
    let p = new Place()
    p.setIdentity(undefined)
    t.equals(p.identity, undefined)
    t.end()
  })
  test('setIdentity: array', (t) => {
    let p = new Place()
    p.setIdentity([])
    t.equals(p.identity, undefined)
    t.end()
  })
  test('setIdentity: object', (t) => {
    let p = new Place()
    p.setIdentity({})
    t.equals(p.identity, undefined)
    t.end()
  })
  test('setIdentity: nil object', (t) => {
    let p = new Place()
    p.setIdentity(null)
    t.equals(p.identity, undefined)
    t.end()
  })
  test('setIdentity: number', (t) => {
    let p = new Place()
    p.setIdentity(1)
    t.equals(p.identity, undefined)
    t.end()
  })
  test('setIdentity: nil number', (t) => {
    let p = new Place()
    p.setIdentity(NaN)
    t.equals(p.identity, undefined)
    t.end()
  })
  test('setIdentity: string', (t) => {
    let p = new Place()
    p.setIdentity('test')
    t.equals(p.identity, undefined)
    t.end()
  })
  test('setIdentity: nil string', (t) => {
    let p = new Place()
    p.setIdentity('')
    t.equals(p.identity, undefined)
    t.end()
  })
  test('setIdentity: instanceof Identity', (t) => {
    let p = new Place()
    p.setIdentity(fixture.identity)
    t.equals(p.identity, fixture.identity)
    t.end()
  })
}

module.exports.tests.setOntology = (test) => {
  test('setOntology: undefined', (t) => {
    let p = new Place()
    p.setOntology(undefined)
    t.equals(p.ontology, undefined)
    t.end()
  })
  test('setOntology: array', (t) => {
    let p = new Place()
    p.setOntology([])
    t.equals(p.ontology, undefined)
    t.end()
  })
  test('setOntology: object', (t) => {
    let p = new Place()
    p.setOntology({})
    t.equals(p.ontology, undefined)
    t.end()
  })
  test('setOntology: nil object', (t) => {
    let p = new Place()
    p.setOntology(null)
    t.equals(p.ontology, undefined)
    t.end()
  })
  test('setOntology: number', (t) => {
    let p = new Place()
    p.setOntology(1)
    t.equals(p.ontology, undefined)
    t.end()
  })
  test('setOntology: nil number', (t) => {
    let p = new Place()
    p.setOntology(NaN)
    t.equals(p.ontology, undefined)
    t.end()
  })
  test('setOntology: string', (t) => {
    let p = new Place()
    p.setOntology('test')
    t.equals(p.ontology, undefined)
    t.end()
  })
  test('setOntology: nil string', (t) => {
    let p = new Place()
    p.setOntology('')
    t.equals(p.ontology, undefined)
    t.end()
  })
  test('setOntology: instanceof Ontology', (t) => {
    let p = new Place()
    p.setOntology(fixture.ontology)
    t.equals(p.ontology, fixture.ontology)
    t.end()
  })
}

module.exports.tests.addProperty = (test) => {
  test('addProperty: undefined', (t) => {
    let p = new Place()
    p.addProperty(undefined)
    t.equals(p.property.length, 0)
    t.end()
  })
  test('addProperty: array', (t) => {
    let p = new Place()
    p.addProperty([])
    t.equals(p.property.length, 0)
    t.end()
  })
  test('addProperty: object', (t) => {
    let p = new Place()
    p.addProperty({})
    t.equals(p.property.length, 0)
    t.end()
  })
  test('addProperty: nil object', (t) => {
    let p = new Place()
    p.addProperty(null)
    t.equals(p.property.length, 0)
    t.end()
  })
  test('addProperty: number', (t) => {
    let p = new Place()
    p.addProperty(1)
    t.equals(p.property.length, 0)
    t.end()
  })
  test('addProperty: nil number', (t) => {
    let p = new Place()
    p.addProperty(NaN)
    t.equals(p.property.length, 0)
    t.end()
  })
  test('addProperty: string', (t) => {
    let p = new Place()
    p.addProperty('test')
    t.equals(p.property.length, 0)
    t.end()
  })
  test('addProperty: nil string', (t) => {
    let p = new Place()
    p.addProperty('')
    t.equals(p.property.length, 0)
    t.end()
  })
  test('addProperty: instanceof Property', (t) => {
    let p = new Place()
    p.addProperty(fixture.property)
    t.equals(p.property.length, 1)
    t.equals(p.property[0], fixture.property)
    t.end()
  })
}

module.exports.tests.addName = (test) => {
  test('addName: undefined', (t) => {
    let p = new Place()
    p.addName(undefined)
    t.equals(p.name.length, 0)
    t.end()
  })
  test('addName: array', (t) => {
    let p = new Place()
    p.addName([])
    t.equals(p.name.length, 0)
    t.end()
  })
  test('addName: object', (t) => {
    let p = new Place()
    p.addName({})
    t.equals(p.name.length, 0)
    t.end()
  })
  test('addName: nil object', (t) => {
    let p = new Place()
    p.addName(null)
    t.equals(p.name.length, 0)
    t.end()
  })
  test('addName: number', (t) => {
    let p = new Place()
    p.addName(1)
    t.equals(p.name.length, 0)
    t.end()
  })
  test('addName: nil number', (t) => {
    let p = new Place()
    p.addName(NaN)
    t.equals(p.name.length, 0)
    t.end()
  })
  test('addName: string', (t) => {
    let p = new Place()
    p.addName('test')
    t.equals(p.name.length, 0)
    t.end()
  })
  test('addName: nil string', (t) => {
    let p = new Place()
    p.addName('')
    t.equals(p.name.length, 0)
    t.end()
  })
  test('addName: instanceof Name', (t) => {
    let p = new Place()
    p.addName(fixture.name)
    t.equals(p.name.length, 1)
    t.equals(p.name[0], fixture.name)
    t.end()
  })
}

module.exports.tests.addHierarchy = (test) => {
  test('addHierarchy: undefined', (t) => {
    let p = new Place()
    p.addHierarchy(undefined)
    t.equals(p.hierarchy.length, 0)
    t.end()
  })
  test('addHierarchy: array', (t) => {
    let p = new Place()
    p.addHierarchy([])
    t.equals(p.hierarchy.length, 0)
    t.end()
  })
  test('addHierarchy: object', (t) => {
    let p = new Place()
    p.addHierarchy({})
    t.equals(p.hierarchy.length, 0)
    t.end()
  })
  test('addHierarchy: nil object', (t) => {
    let p = new Place()
    p.addHierarchy(null)
    t.equals(p.hierarchy.length, 0)
    t.end()
  })
  test('addHierarchy: number', (t) => {
    let p = new Place()
    p.addHierarchy(1)
    t.equals(p.hierarchy.length, 0)
    t.end()
  })
  test('addHierarchy: nil number', (t) => {
    let p = new Place()
    p.addHierarchy(NaN)
    t.equals(p.hierarchy.length, 0)
    t.end()
  })
  test('addHierarchy: string', (t) => {
    let p = new Place()
    p.addHierarchy('test')
    t.equals(p.hierarchy.length, 0)
    t.end()
  })
  test('addHierarchy: nil string', (t) => {
    let p = new Place()
    p.addHierarchy('')
    t.equals(p.hierarchy.length, 0)
    t.end()
  })
  test('addHierarchy: instanceof Hierarchy', (t) => {
    let p = new Place()
    p.addHierarchy(fixture.hierarchy)
    t.equals(p.hierarchy.length, 1)
    t.equals(p.hierarchy[0], fixture.hierarchy)
    t.end()
  })
}

module.exports.tests.addGeometry = (test) => {
  test('addGeometry: undefined', (t) => {
    let p = new Place()
    p.addGeometry(undefined)
    t.equals(p.geometry.length, 0)
    t.end()
  })
  test('addGeometry: array', (t) => {
    let p = new Place()
    p.addGeometry([])
    t.equals(p.geometry.length, 0)
    t.end()
  })
  test('addGeometry: object', (t) => {
    let p = new Place()
    p.addGeometry({})
    t.equals(p.geometry.length, 0)
    t.end()
  })
  test('addGeometry: nil object', (t) => {
    let p = new Place()
    p.addGeometry(null)
    t.equals(p.geometry.length, 0)
    t.end()
  })
  test('addGeometry: number', (t) => {
    let p = new Place()
    p.addGeometry(1)
    t.equals(p.geometry.length, 0)
    t.end()
  })
  test('addGeometry: nil number', (t) => {
    let p = new Place()
    p.addGeometry(NaN)
    t.equals(p.geometry.length, 0)
    t.end()
  })
  test('addGeometry: string', (t) => {
    let p = new Place()
    p.addGeometry('test')
    t.equals(p.geometry.length, 0)
    t.end()
  })
  test('addGeometry: nil string', (t) => {
    let p = new Place()
    p.addGeometry('')
    t.equals(p.geometry.length, 0)
    t.end()
  })
  test('addGeometry: instanceof Geometry', (t) => {
    let p = new Place()
    p.addGeometry(fixture.geometry)
    t.equals(p.geometry.length, 1)
    t.equals(p.geometry[0], fixture.geometry)
    t.end()
  })
}

module.exports.tests.isValid = (test) => {
  test('isValid: empty', (t) => {
    let p = new Place()
    t.false(p._isValid())
    t.end()
  })
  test('isValid: identity only', (t) => {
    let p = new Place(fixture.identity)
    t.false(p._isValid())
    t.end()
  })
  test('isValid: ontology only', (t) => {
    let p = new Place(undefined, fixture.ontology)
    t.false(p._isValid())
    t.end()
  })
  test('isValid: empty identity', (t) => {
    let p = new Place(undefined, fixture.ontology)
    t.false(p._isValid())
    t.end()
  })
  test('isValid: empty ontology', (t) => {
    let p = new Place(fixture.identity, undefined)
    t.false(p._isValid())
    t.end()
  })
  test('isValid: identity & ontology', (t) => {
    let p = new Place(fixture.identity, fixture.ontology)
    t.true(p._isValid())
    t.end()
  })
}

module.exports.all = (tape) => {
  function test (name, testFunction) {
    return tape(`Place: ${name}`, testFunction)
  }

  for (var testCase in module.exports.tests) {
    module.exports.tests[testCase](test)
  }
}
