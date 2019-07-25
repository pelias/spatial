module.exports = {
  flatten: (val) => {
    let v = Array.isArray(val) ? val[0] : val
    if (typeof v === 'string') { return decodeURIComponent(v) }
    return v
  },
  floatPrecision: (multiplier, str) => {
    return Math.round(parseFloat(str) * multiplier) / multiplier
  }
}

module.exports.floatPrecision7 = module.exports.floatPrecision.bind(null, 1e7)
