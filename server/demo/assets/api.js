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
  let url = '/place/' + place.source + '/' + place.id + '/'
  api.request(url, 'GET', params, cb)
}

function property (place, params, cb) {
  let url = '/place/' + place.source + '/' + place.id + '/property/'
  api.request(url, 'GET', params, cb)
}

function geometry (place, params, cb) {
  let url = '/place/' + place.source + '/' + place.id + '/geometry/'
  api.request(url, 'GET', params, cb)
}

function hierarchy (place, params, cb) {
  let url = '/place/' + place.source + '/' + place.id + '/hierarchy/'
  api.request(url, 'GET', params, cb)
}

var api = {
  request: request,
  place: place,
  property: property,
  geometry: geometry,
  hierarchy: hierarchy
}
