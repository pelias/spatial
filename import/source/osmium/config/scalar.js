// conventience function to handle mulitple values in OSM
// as discussed in https://wiki.openstreetmap.org/wiki/Multiple_values

module.exports = function (str) {
  return str.split(/(?<!;);(?!;)/)[0].trim()
}
