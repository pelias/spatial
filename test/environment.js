const semver = require('semver')

module.exports.tests = {}

module.exports.tests.compile_options = (test, common) => {
  test('compile_options', (t) => {
    let db = common.tempDatabase()
    let pragmas = db.prepare(`PRAGMA compile_options`).all().reduce((obj, row) => {
      let part = row.compile_options.split('=')
      obj[part[0]] = part[1]
      return obj
    }, {})

    t.equals(pragmas.THREADSAFE, '0', 'THREADSAFE')
    // t.equals(pragmas.ENABLE_RTREE, '1', 'ENABLE_RTREE')
    // t.equals(pragmas.ENABLE_JSON1, '1', 'ENABLE_JSON1')
    // t.equals(pragmas.SOUNDEX, '1', 'SOUNDEX')
    t.end()
  })
}

module.exports.tests.dependencies = (test, common) => {
  test('dependencies', (t) => {
    let db = common.tempSpatialDatabase()
    let res, actual, expected

    res = db.prepare(`SELECT sqlite_version()`).get()
    t.equals(res['sqlite_version()'], '3.28.0', 'sqlite_version')

    res = db.prepare(`SELECT spatialite_version()`).get()
    actual = semver.coerce(res['spatialite_version()'])
    expected = semver.coerce('5.0.0')
    t.true(semver.gte(actual, expected), 'spatialite_version')

    res = db.prepare(`SELECT spatialite_target_cpu()`).get()
    t.true(res['spatialite_target_cpu()'].startsWith('x86_64'), 'spatialite_target_cpu')

    res = db.prepare(`SELECT freexl_version()`).get()
    t.equals(res['freexl_version()'], '1.0.5', 'freexl_version')

    res = db.prepare(`SELECT proj4_version()`).get()
    actual = semver.coerce(res['proj4_version()'])
    expected = semver.coerce('Rel. 4.9.3, 15 August 2016')
    t.true(semver.gte(actual, expected), 'proj4_version')

    res = db.prepare(`SELECT geos_version()`).get()
    actual = semver.coerce(res['geos_version()'])
    expected = semver.coerce('3.6.2-CAPI-1.10.2 4d2925d6')
    t.true(semver.gte(actual, expected), 'geos_version')

    res = db.prepare(`SELECT rttopo_version()`).get()
    actual = semver.coerce(res['rttopo_version()'])
    expected = semver.coerce('1.1.0')
    t.true(semver.gte(actual, expected), 'rttopo_version')

    res = db.prepare(`SELECT libxml2_version()`).get()
    actual = semver.coerce(res['libxml2_version()'])
    expected = semver.coerce('2.9.7')
    t.true(semver.gte(actual, expected), 'libxml2_version')

    t.end()
  })
}

module.exports.tests.features = (test, common) => {
  test('features', (t) => {
    let db = common.tempSpatialDatabase()
    let res

    t.doesNotThrow(() => {
      res = db.prepare(`SELECT HasIconv()`).get()
      t.equals(res['HasIconv()'], 1, 'HasIconv')
    }, 'HasIconv', 'HasIconv')

    t.doesNotThrow(() => {
      res = db.prepare(`SELECT HasMathSQL()`).get()
      t.equals(res['HasMathSQL()'], 1, 'HasMathSQL')
    }, 'HasMathSQL')

    // I don't believe this is required
    // t.doesNotThrow(() => {
    //   res = db.prepare(`SELECT HasGeoCallbacks()`).get()
    //   t.equals(res['HasGeoCallbacks()'], 1, 'HasGeoCallbacks')
    // }, 'HasGeoCallbacks')

    t.doesNotThrow(() => {
      res = db.prepare(`SELECT HasProj()`).get()
      t.equals(res['HasProj()'], 1, 'HasProj')
    }, 'HasProj')

    t.doesNotThrow(() => {
      res = db.prepare(`SELECT HasGeos()`).get()
      t.equals(res['HasGeos()'], 1, 'HasGeos')
    }, 'HasGeos')

    t.doesNotThrow(() => {
      res = db.prepare(`SELECT HasGeosAdvanced()`).get()
      t.equals(res['HasGeosAdvanced()'], 1, 'HasGeosAdvanced')
    }, 'HasGeosAdvanced')

    t.doesNotThrow(() => {
      res = db.prepare(`SELECT HasGeosTrunk()`).get()
      t.equals(res['HasGeosTrunk()'], 0, 'HasGeosTrunk')
    }, 'HasGeosTrunk')

    // t.doesNotThrow(() => {
    //   res = db.prepare(`SELECT HasGeosReentrant()`).get()
    //   t.equals(res['HasGeosReentrant()'], 1, 'HasGeosReentrant')
    // }, 'HasGeosReentrant')

    // t.doesNotThrow(() => {
    //   res = db.prepare(`SELECT HasGeosOnlyReentrant()`).get()
    //   t.equals(res['HasGeosOnlyReentrant()'], 1, 'HasGeosOnlyReentrant')
    // }, 'HasGeosOnlyReentrant')

    // t.doesNotThrow(() => {
    //   res = db.prepare(`SELECT HasLwGeom()`).get()
    //   t.equals(res['HasLwGeom()'], 0, 'HasLwGeom')
    // }, 'HasLwGeom')

    // t.doesNotThrow(() => {
    //   res = db.prepare(`SELECT HasRtTopo()`).get()
    //   t.equals(res['HasRtTopo()'], 1, 'HasRtTopo')
    // }, 'HasRtTopo')

    t.doesNotThrow(() => {
      res = db.prepare(`SELECT HasLibXML2()`).get()
      t.equals(res['HasLibXML2()'], 1, 'HasLibXML2')
    }, 'HasLibXML2')

    t.doesNotThrow(() => {
      res = db.prepare(`SELECT HasEpsg()`).get()
      t.equals(res['HasEpsg()'], 1, 'HasEpsg')
    }, 'HasEpsg')

    t.doesNotThrow(() => {
      res = db.prepare(`SELECT HasFreeXL()`).get()
      t.equals(res['HasFreeXL()'], 1, 'HasFreeXL')
    }, 'HasFreeXL')

    t.doesNotThrow(() => {
      res = db.prepare(`SELECT HasGeoPackage()`).get()
      t.equals(res['HasGeoPackage()'], 1, 'HasGeoPackage')
    }, 'HasGeoPackage')

    // t.doesNotThrow(() => {
    //   res = db.prepare(`SELECT HasGCP()`).get()
    //   t.equals(res['HasGCP()'], 1, 'HasGCP')
    // }, 'HasGCP')

    // t.doesNotThrow(() => {
    //   res = db.prepare(`SELECT HasTopology()`).get()
    //   t.equals(res['HasTopology()'], 1, 'HasTopology')
    // }, 'HasTopology')

    t.end()
  })
}

module.exports.all = (tape, common) => {
  function test (name, testFunction) {
    return tape(`environment: ${name}`, testFunction)
  }

  for (var testCase in module.exports.tests) {
    module.exports.tests[testCase](test, common)
  }
}
