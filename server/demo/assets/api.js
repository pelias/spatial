function request (url, method, params, cb) {
  // console.error(url)

  return $.ajax({
    url: url,
    method: method,
    data: params,
    headers: { 'Accept': 'application/json' }
  })
    .done(function (data) { cb(null, data) })
    .fail(function (err) { cb(err) })
};

function place (place, params, cb) {
  let url = '/place/' + place.source + '/' + place.id
  api.request(url, 'GET', params, cb)
}

function property (place, params, cb) {
  let url = '/place/' + place.source + '/' + place.id + '/property'
  api.request(url, 'GET', params, cb)
}

function name (place, params, cb) {
  let url = '/place/' + place.source + '/' + place.id + '/name'
  api.request(url, 'GET', params, function (err, res) {
    if (!err && Array.isArray(res)) {
      // sort names by display preference
      res.sort(function (a, b) {
        var ascore = scoreName(a)
        var bscore = scoreName(b)
        if (ascore > bscore) { return -1 }
        if (ascore < bscore) { return +1 }
        return 0
      })
    }
    cb(err, res)
  })
}

function geometry (place, params, cb) {
  let url = '/place/' + place.source + '/' + place.id + '/geometry'
  api.request(url, 'GET', params, cb)
}

function within (query, params, cb) {
  let url = '/place/' + query.source + '/' + query.id + '/relationship/within'
  api.request(url, 'GET', params, cb)
}

function contains (query, params, cb) {
  let url = '/place/' + query.source + '/' + query.id + '/relationship/contains'
  api.request(url, 'GET', params, cb)
}

function intersects (query, params, cb) {
  let url = '/place/' + query.source + '/' + query.id + '/relationship/intersects'
  api.request(url, 'GET', params, cb)
}

function hierarchy (place, params, cb) {
  let url = '/place/' + place.source + '/' + place.id + '/hierarchy'
  api.request(url, 'GET', params, cb)
}

function pip (params, cb) {
  let url = '/query/pip'
  api.request(url, 'GET', params, cb)
}

var api = {
  request: request,
  place: place,
  property: property,
  name: name,
  geometry: geometry,
  hierarchy: hierarchy,
  pip: pip,
  relationship: {
    within: within,
    contains: contains,
    intersects: intersects
  }
}

// note: listed in reverse order of preference
// ie. most preferred strings come last in the array
var preference = {
  lang: ['UND', 'ENG'],
  tag: ['PREFERRED']
}

function scoreName (name) {
  var score = 0
  var idx = {
    lang: preference.lang.indexOf((name.lang || '').toUpperCase()),
    tag: preference.tag.indexOf((name.tag || '').toUpperCase())
  }
  score += (100 * Math.min(idx.lang, 0))
  score += (1 * Math.min(idx.tag, 0))
  return score
}
