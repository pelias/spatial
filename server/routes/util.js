module.exports = {
  flatten: (val) => {
    let v = Array.isArray(val) ? val[0] : val
    if (typeof v === 'string') { return decodeURIComponent(v) }
    return v
  }
}
