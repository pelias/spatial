const _ = require('lodash')
const iso6393 = require('iso-639-3')
const locale = require('locale')
const format = require('../format')
const DELIM = ':'

// create a dictionary which maps the ISO 639-1 language subtags to a map
// of it's represenation in several different standards.
const language = {}
iso6393.filter(i => !!i.iso6391).forEach(i => { language[i.iso6391] = i })

// a pre-processed locale list of language subtags we support (all of them).
const allLocales = new locale.Locales(Object.keys(language))

const mapping = {
  'source': () => 'osm',
  'source_id': (record) => _.get(record, 'properties.@type') + DELIM + _.get(record, 'properties.@id'),
  'class': () => 'admin',
  'type': (record) => _.get(record, 'properties.place', 'unknown'),
  'geometry': (record) => format.from('geometry', 'geojson', record.geometry),
  'valid': () => true,
  'name': (record) => {
    let names = []
    const properties = _.get(record, 'properties', {})
    for (let attr in properties) {
      // https://wiki.openstreetmap.org/wiki/Multilingual_names
      if (!attr.startsWith('name:')) { continue }
      let match = attr.match(/^name:([a-z]{2,3})$/)
      if (match) {
        let lang = match[1]

        // convert iso codes 639-1 to 639-3
        if (lang.length === 2) {
          let locales = new locale.Locales(match[1])
          let best = locales.best(allLocales)
          lang = language[best.language].iso6393
        }

        // skip if both iso codes 639-1 and 639-3 are present
        if (lang !== match[1] && properties['name:' + lang]) { continue }

        // index name
        names.push({
          lang: lang,
          tag: 'preferred',
          abbr: 0,
          name: properties[attr]
        })
      }
    }
    return names
  },
  'property': (record) => {
    return _.pickBy(record.properties, (val, key) => {
      if (key.startsWith('@')) { return false }
      if (key.startsWith('name:')) { return false }
      return true
    })
  }
}

module.exports = {
  ingress: process.stdin,
  record_separator: /\r?\n/,
  format: 'json',
  mapping: mapping
}
