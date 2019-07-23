$('document').ready(function () {
  var el = $('#sidebar-identity p.panel-heading')
  var identity = params.identity
  if (el.length && identity.source && identity.id) {
    var url = ''

    // openstreetmap
    if (identity.source === 'osm') {
      url = 'https://www.openstreetmap.org/' + identity.id.replace(':', '/')
    }
    // whosonfirst
    if (identity.source === 'wof') {
      var property = params.place.property
      if (!_.isPlainObject(property)) { return }

      // get repository from properties
      if (!property.hasOwnProperty('wof:repo')) { return }

      url = 'https://github.com/whosonfirst-data/' +
        property['wof:repo'] +
        '/blob/master/data/' +
        identity.id.match(/.{1,3}/g).join('/') + '/' +
        identity.id + '.geojson'
    }

    if (url && url.length) {
      el.append(
        '<a href="' + url + '" target="' + identity.source + '" class="external-link">' +
          '<span class="icon is-small">' +
            '<i class="fas fa-external-link-alt"></i>' +
          '</span>' +
        '</a>'
      )
    }
  }
})
