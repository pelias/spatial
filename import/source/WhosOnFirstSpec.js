class WhosOnFirstSpec {
  constructor () {
    this.load('./placetypes-spec-latest.json')
  }
  load (filepath) {
    this.spec = require(filepath)

    // maintain maps to avoid iterating the document
    this.ids = new Map()
    this.names = new Map()

    for (let id in this.spec) {
      this.ids.set(parseInt(id, 10), this.spec[id])
      this.names.set(this.spec[id].name, this.spec[id])
    }
  }
  parents (placetype) {
    if (!this.names.has(placetype)) { return [] }
    return this.names.get(placetype).parent.map(id => this.ids.get(id))
  }
}

module.exports = WhosOnFirstSpec
