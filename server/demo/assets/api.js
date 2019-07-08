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
  geometry: geometry,
  hierarchy: hierarchy,
  pip: pip,
  relationship: {
    within: within,
    contains: contains,
    intersects: intersects
  }
}
