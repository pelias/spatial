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
      if (!attr.startsWith('name:') && !attr.startsWith('alt_name:')) { continue }
      let match = attr.match(/^(name|alt_name):([a-z]{2,3})$/)
      if (match) {
        let lang = match[2]

        // convert iso codes 639-1 to 639-3
        if (lang.length === 2) {
          let locales = new locale.Locales(match[2])
          let best = locales.best(allLocales)
          lang = language[best.language].iso6393
        }

        // skip if both iso codes 639-1 and 639-3 are present
        if (lang !== match[2] && properties['name:' + lang]) { continue }

        // index name
        names.push({
          lang: lang,
          tag: (match[1] === 'name') ? 'preferred' : 'variant',
          abbr: 0,
          name: properties[attr]
        })
      }
    }
    return names
  },
  'property': (record) => {
    let props = {}

    // generic properties
    props.name = _.get(record, 'properties.name', '').toUpperCase()

    // country codes
    // https://wiki.openstreetmap.org/wiki/Country_code

    // ISO 3166-1
    props.alpha2 = _.get(record, 'properties.ISO3166-1:alpha2', '').toUpperCase()
    props.alpha3 = _.get(record, 'properties.ISO3166-1:alpha3', '').toUpperCase()

    // ISO 3166-2
    let subdivision = _.get(record, 'properties.ISO3166-2', '').toUpperCase()
    let parts = subdivision.split('-')
    if (parts.length === 2 && parts[0].length === 2) {
      props.alpha2 = parts[0]
      props.abbr = parts[1]
    }

    // osm-specific properties
    _.assign(props, _.pickBy(record.properties, (val, key) => {
      if (key.startsWith('@')) { return false }
      if (key.startsWith('name:')) { return false }
      if (key.startsWith('alt_name:')) { return false }
      if (key.startsWith('ISO3166-1:alpha')) { return false }
      if (key.startsWith('ISO3166-2')) { return false }
      return true
    }))

    return props
  }
}

module.exports = {
  ingress: process.stdin,
  record_separator: /\r?\n/,
  format: 'json',
  mapping: mapping
}
