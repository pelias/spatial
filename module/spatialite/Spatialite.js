const Module = require('../Module')
const InitExtension = require('./InitExtension')
const InitSpatialMetaData = require('./InitSpatialMetaData')
const InitSpatialOptions = require('./InitSpatialOptions')
const InitDebugVersions = require('./InitDebugVersions')

class Spatialite extends Module {
  constructor (db) {
    super(db)

    this.init = {
      extension: new InitExtension(),
      metadata: new InitSpatialMetaData(),
      options: new InitSpatialOptions(),
      debug: new InitDebugVersions()
    }
  }
}

module.exports = Spatialite
