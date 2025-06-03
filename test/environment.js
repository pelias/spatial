const tap = require('tap')
const common = require('./common')
const semver = require('semver')

tap.test('compile_options', (t) => {
  let db = common.tempDatabase()
  let pragmas = db.prepare(`PRAGMA compile_options`).all().reduce((obj, row) => {
    let part = row.compile_options.split('=')
    obj[part[0]] = part[1]
    return obj
  }, {})

  t.ok(pragmas.hasOwnProperty('ENABLE_RTREE'), 'ENABLE_RTREE')
  t.not(pragmas.ENABLE_RTREE, '0', 'ENABLE_RTREE != 0')
  t.ok(pragmas.hasOwnProperty('ENABLE_COLUMN_METADATA'), 'ENABLE_COLUMN_METADATA')
  t.not(pragmas.ENABLE_COLUMN_METADATA, '0', 'ENABLE_COLUMN_METADATA != 0')
  // t.ok(pragmas.hasOwnProperty('ENABLE_JSON1'), 'ENABLE_JSON1')
  // t.not(pragmas.ENABLE_JSON1, '0', 'ENABLE_JSON1 != 0')
  t.end()
})

// ICU disabled, @todo: figure out a way of installing sqlite with ICU on linux/darwin
// tap.test('unicode', (t) => {
//   // the ICU extension provides a bunch of goodies, we can test
//   // it's installed correctly by calling the lower with two
//   // arguments, this is not supported without the ICU extension
//   let db = common.tempDatabase()
//   let res = db.prepare(`SELECT lower('I', 'tr_tr') AS lowercase`).get()
//   t.equal(res.lowercase, 'ı', 'extension enabled') // (small dotless i)
//   t.end()
// })

tap.test('dependencies', (t) => {
  let db = common.tempSpatialDatabase()
  let res, actual, expected

  res = db.prepare(`SELECT sqlite_version()`).get()
  t.equal(res['sqlite_version()'].substr(0, 2), '3.', `sqlite_version: ${res['sqlite_version()']}`)

  res = db.prepare(`SELECT spatialite_version()`).get()
  t.equal(res['spatialite_version()'].substr(0, 2), '5.', 'spatialite 5 required')

  // res = db.prepare(`SELECT spatialite_target_cpu()`).get()
  // t.ok(res['spatialite_target_cpu()'].startsWith('x86_64'), `spatialite_target_cpu: ${res['spatialite_target_cpu()']}`)

  // res = db.prepare(`SELECT freexl_version()`).get()
  // console.error(res)
  // actual = semver.coerce(res['freexl_version()'])
  // expected = semver.coerce('1.0.5')
  // t.ok(semver.gte(actual, expected), `freexl_version: ${res['freexl_version()']}`)

  res = db.prepare(`SELECT proj4_version()`).get()
  actual = semver.coerce(res['proj4_version()'])
  expected = semver.coerce('Rel. 7.0.1, May 1st, 2020')
  t.ok(semver.gte(actual, expected), `proj4_version: ${res['proj4_version()']}`)

  res = db.prepare(`SELECT geos_version()`).get()
  actual = semver.coerce(res['geos_version()'])
  expected = semver.coerce('3.8.1-CAPI-1.13.3')
  t.ok(semver.gte(actual, expected), `geos_version: ${res['geos_version()']}`)

  res = db.prepare(`SELECT rttopo_version()`).get()
  actual = semver.coerce(res['rttopo_version()'])
  expected = semver.coerce('1.1.0')
  t.ok(semver.gte(actual, expected), `rttopo_version: ${res['rttopo_version()']}`)

  res = db.prepare(`SELECT libxml2_version()`).get()
  actual = semver.coerce(res['libxml2_version()'])
  expected = semver.coerce('2.9.10')
  t.ok(semver.gte(actual, expected), `libxml2_version: ${res['libxml2_version()']}`)

  t.end()
})

tap.test('features', (t) => {
  let db = common.tempSpatialDatabase()
  let res

  t.doesNotThrow(() => {
    res = db.prepare(`SELECT HasIconv()`).get()
    t.equal(res['HasIconv()'], 1, 'HasIconv')
  }, 'HasIconv')

  t.doesNotThrow(() => {
    res = db.prepare(`SELECT HasMathSQL()`).get()
    t.equal(res['HasMathSQL()'], 1, 'HasMathSQL')
  }, 'HasMathSQL')

  // I don't believe this is required
  // t.doesNotThrow(() => {
  //   res = db.prepare(`SELECT HasGeoCallbacks()`).get()
  //   t.equal(res['HasGeoCallbacks()'], 1, 'HasGeoCallbacks')
  // }, 'HasGeoCallbacks')

  t.doesNotThrow(() => {
    res = db.prepare(`SELECT HasProj()`).get()
    t.equal(res['HasProj()'], 1, 'HasProj')
  }, 'HasProj')

  t.doesNotThrow(() => {
    res = db.prepare(`SELECT HasGeos()`).get()
    t.equal(res['HasGeos()'], 1, 'HasGeos')
  }, 'HasGeos')

  t.doesNotThrow(() => {
    res = db.prepare(`SELECT HasGeosAdvanced()`).get()
    t.equal(res['HasGeosAdvanced()'], 1, 'HasGeosAdvanced')
  }, 'HasGeosAdvanced')

  t.doesNotThrow(() => {
    res = db.prepare(`SELECT HasGeosTrunk()`).get()
    t.equal(res['HasGeosTrunk()'], 0, 'HasGeosTrunk')
  }, 'HasGeosTrunk')

  t.doesNotThrow(() => {
    res = db.prepare(`SELECT HasGeosReentrant()`).get()
    t.equal(res['HasGeosReentrant()'], 1, 'HasGeosReentrant')
  }, 'HasGeosReentrant')

  t.throws(() => {
    res = db.prepare(`SELECT HasLwGeom()`).get()
    t.equal(res['HasLwGeom()'], 0, 'HasLwGeom')
  }, 'NOT HasLwGeom')

  t.doesNotThrow(() => {
    res = db.prepare(`SELECT HasRtTopo()`).get()
    t.equal(res['HasRtTopo()'], 1, 'HasRtTopo')
  }, 'HasRtTopo')

  t.doesNotThrow(() => {
    res = db.prepare(`SELECT HasLibXML2()`).get()
    t.equal(res['HasLibXML2()'], 1, 'HasLibXML2')
  }, 'HasLibXML2')

  t.doesNotThrow(() => {
    res = db.prepare(`SELECT HasEpsg()`).get()
    t.equal(res['HasEpsg()'], 1, 'HasEpsg')
  }, 'HasEpsg')

  // t.doesNotThrow(() => {
  //   res = db.prepare(`SELECT HasFreeXL()`).get()
  //   t.equal(res['HasFreeXL()'], 1, 'HasFreeXL')
  // }, 'HasFreeXL')

  t.doesNotThrow(() => {
    res = db.prepare(`SELECT HasGeoPackage()`).get()
    t.equal(res['HasGeoPackage()'], 1, 'HasGeoPackage')
  }, 'HasGeoPackage')

  t.doesNotThrow(() => {
    res = db.prepare(`SELECT HasGCP()`).get()
    t.equal(res['HasGCP()'], 1, 'HasGCP')
  }, 'HasGCP')

  t.doesNotThrow(() => {
    res = db.prepare(`SELECT HasTopology()`).get()
    t.equal(res['HasTopology()'], 1, 'HasTopology')
  }, 'HasTopology')

  t.end()
})
