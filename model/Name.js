const _ = require('lodash')

class Name {
  constructor (lang, tag, abbr, name) {
    this.setLang(lang)
    this.setTag(tag)
    this.setAbbr(abbr)
    this.setName(name)
  }
  setLang (lang) {
    if (_.isString(lang)) {
      this.lang = lang
    }
  }
  setTag (tag) {
    if (_.isString(tag)) {
      this.tag = tag
    }
  }
  setAbbr (abbr) {
    if (_.isBoolean(abbr)) {
      this.abbr = abbr
    }
  }
  setName (name) {
    if (_.isString(name)) {
      this.name = name
    }
  }
  _isValid () {
    if (!_.isString(this.lang) || !this.lang.length) { return false }
    if (!_.isString(this.tag) || !this.tag.length) { return false }
    if (!_.isBoolean(this.abbr)) { return false }
    if (!_.isString(this.name) || !this.name.length) { return false }
    return true
  }
}

module.exports = Name
