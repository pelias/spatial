const _ = require('lodash')
const Name = require('../../../../model/Name')

function mapper (place, properties) {
  const names = _.get(properties, 'names', {})

  // add primary name
  const primary = _.get(names, 'primary')
  if (primary) {
    place.addName(new Name('und', 'default', false, primary))
  }

  // add common names with language codes
  const common = _.get(names, 'common')
  if (common && _.isPlainObject(common)) {
    Object.entries(common).forEach(([lang, name]) => {
      const langCode = lang || 'und'
      // always add if name is different OR if it matches primary but has a specific language code
      if (name && (name !== primary || (langCode !== 'und' && langCode !== ''))) {
        place.addName(new Name(langCode, 'variant', false, name))
      }
    })
  }
}

module.exports = mapper
