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
  const common = _.get(names, 'common', [])
  if (_.isArray(common)) {
    common.forEach(nameEntry => {
      if (!_.isArray(nameEntry) || nameEntry.length < 2) { return }

      const lang = nameEntry[0] || 'und'
      const name = nameEntry[1]

      // always add if name is different OR if it matches primary but has a specific language code
      if (name && (name !== primary || (lang !== 'und' && lang !== ''))) {
        place.addName(new Name(lang, 'variant', false, name))
      }
    })
  }
}

module.exports = mapper
