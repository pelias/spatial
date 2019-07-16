const Module = require('../Module')
const TableShard = require('./TableShard')
const TableShardSubdivide = require('./TableShardSubdivide')
const IndexCovering = require('./IndexCovering')
const ShardGeoColumn = require('./ShardGeoColumn')
const SubdivideGeoColumn = require('./SubdivideGeoColumn')
const ShardGeoIndex = require('./ShardGeoIndex')
const StatementInsert = require('./StatementInsert')
const TriggerGeometryInsert = require('./TriggerGeometryInsert')
const GeoViewPointInPolygon = require('./GeoViewPointInPolygon')

class Shard extends Module {
  constructor (db) {
    super(db)
    this.table = {
      shard: new TableShard(),
      shardGeom: new ShardGeoColumn(),
      subdivide: new TableShardSubdivide(),
      subdivideGeom: new SubdivideGeoColumn()
    }
    this.index = {
      covering: new IndexCovering(),
      geom: new ShardGeoIndex()
    }
    this.statement = {
      insert: new StatementInsert()
    }
    this.trigger = {
      insert: new TriggerGeometryInsert()
    }
    this.view = {
      pip: new GeoViewPointInPolygon()
    }
  }
  insert () { /* no-op (handled by triggers) */ }
}

module.exports = Shard
