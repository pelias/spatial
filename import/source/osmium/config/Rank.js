const _ = require('lodash')
const levels = require('./address-levels.json')

class Rank {
  constructor () {
    this.search = 30
    this.address = 0
  }
  infer (place, properties) {
    if (!place || !_.isPlainObject(properties)) { return }

    // find country-code for record (where available)
    let cc = 'xx'
    const alpha2Props = place.property.filter(p => p.key === 'alpha2')
    if (alpha2Props.length) { cc = alpha2Props[0].value.toLowerCase() }

    // iterate over nominatim config
    levels.forEach(config => {
      // honour country filter
      if (Array.isArray(config.countries) && !config.countries.includes(cc)) { return }

      for (let key in config.tags) {
        if (!properties.hasOwnProperty(key)) { continue }
        for (let value in config.tags[key]) {
          // config contains a special way of handling administrative levels
          if (key === 'boundary' && value.startsWith('administrative')) {
            let adminLevel = value.replace('administrative', '').trim()
            if (properties[key] !== 'administrative') { continue }
            if (!properties.hasOwnProperty('admin_level')) { continue }
            if (properties.admin_level.toString().trim() !== adminLevel) { continue }
          } else if (properties[key] !== value) { continue }

          // handle ranks as arrays or scalar value
          // 'The ranks can be either a single number, in which case they are the
          // search and address rank, or an array of search and address rank (in that order).'
          // see: https://github.com/openstreetmap/Nominatim/blob/master/docs/develop/Ranking.md
          if (Array.isArray(config.tags[key][value])) {
            this.search = config.tags[key][value][0]
            this.address = config.tags[key][value][1]
          } else {
            this.search = config.tags[key][value]
            this.address = config.tags[key][value]
          }
        }
      }
    }, this)
  }
}

module.exports = Rank
