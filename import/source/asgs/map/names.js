const _ = require('lodash')
const Name = require('../../../../model/Name')

function mapper (place, properties) {
  // remove 'disambiguation' tokens from name suffix
  // see: https://github.com/whosonfirst-data/whosonfirst-data/issues/885
  let name = _.get(properties, 'SSC_NAME16', '')
  name = name.replace(/(\s+([-֊־‐‑﹣]|[([])).*$/, '')

  place.addName(new Name('und', 'default', false, name))
  place.addName(new Name('eng', 'preferred', false, name))
}

module.exports = mapper
