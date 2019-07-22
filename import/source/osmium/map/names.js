const _ = require('lodash')
const iso6393 = require('iso-639-3')
const locale = require('locale')
const Name = require('../../../../model/Name')

// create a dictionary which maps the ISO 639-1 language subtags to a map
// of it's represenation in several different standards.
const language = {}
iso6393.filter(i => !!i.iso6391).forEach(i => { language[i.iso6391] = i })

// a pre-processed locale list of language subtags we support (all of them).
const allLocales = new locale.Locales(Object.keys(language))

function mapper (place, properties) {
  // generic name properties
  place.addName(new Name('und', 'default', false, _.get(properties, 'name', '').trim()))

  for (let attr in properties) {
    // https://wiki.openstreetmap.org/wiki/Multilingual_names
    let match = attr.match(/^(name|alt_name|short_name|official_name|old_name):([a-z]{2,3})$/)
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
      place.addName(new Name(
        lang,
        (match[1].endsWith('_name')) ? match[1].replace('_name', '') : 'preferred',
        false,
        properties[attr]
      ))
    }
  }
}

module.exports = mapper
