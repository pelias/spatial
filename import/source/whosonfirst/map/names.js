const Name = require('../../../../model/Name')
const language = require('../config/language.json')

// info about 'abrv': https://github.com/whosonfirst-data/whosonfirst-data/issues/1319
function mapper (place, properties) {
  for (let attr in properties) {
    if (!attr.startsWith('name:') && !attr.startsWith('abrv:')) { continue }
    let match = attr.match(/^(name|abrv):([a-z]{3})_x_(preferred|colloquial|variant)$/)
    if (match) {
      // Fix for https://github.com/pelias/placeholder/pull/126
      // Transform iso codes 639-2/B to 639-2/T
      const lang = language.alternatives[match[2]] || match[2]

      // skip if both iso codes 639-2/B and 639-2/T are present and the current iso is 639-2/B
      if (lang !== match[2] && properties[match[1] + ':' + lang + '_x_' + match[3]]) { continue }

      // properties should be an array (although sometimes the data can be invalid)
      if (!Array.isArray(properties[attr])) { continue }

      // index each alternative name & abbreviation (value is an array)
      for (var n in properties[attr]) {
        place.addName(new Name(
          lang,
          match[3],
          (match[1] === 'abrv'),
          properties[attr][n]
        ))
      }
    }
  }
}

module.exports = mapper
