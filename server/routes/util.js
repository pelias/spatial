const _ = require('lodash')

// note: listed in reverse order of preference
// ie. most preferred strings come last in the array
var namePreference = {
  lang: ['UND', 'ENG'],
  tag: ['PREFERRED']
}

function scoreName (name) {
  var score = 0
  var idx = {
    lang: namePreference.lang.indexOf((name.lang || '').toUpperCase()),
    tag: namePreference.tag.indexOf((name.tag || '').toUpperCase())
  }
  score += (100 * Math.min(idx.lang, 0))
  score += (1 * Math.min(idx.tag, 0))
  return score
}

module.exports = {
  flatten: (val) => {
    let v = Array.isArray(val) ? val[0] : val
    if (typeof v === 'string') { return decodeURIComponent(v) }
    return v
  },
  floatPrecision: (multiplier, str) => {
    return Math.round(parseFloat(str) * multiplier) / multiplier
  },
  // convenience function to select one name for display
  preferredName (names) {
    if (!_.isArray(names) || _.isEmpty(names)) {
      return ''
    }
    // sort names by display preference
    names.sort((a, b) => {
      var ascore = scoreName(a)
      var bscore = scoreName(b)
      if (ascore > bscore) { return -1 }
      if (ascore < bscore) { return +1 }
      return 0
    })

    return names[0].name
  }
}

module.exports.floatPrecision7 = module.exports.floatPrecision.bind(null, 1e7)
