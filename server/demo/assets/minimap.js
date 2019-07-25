function uniqId () {
  return Math.round(Math.random() * 100000000000)
}

function decorateMinimap (el) {
  var source = el.attr('data-source')
  var id = el.attr('data-id')
  var loaded = el.attr('data-loaded')

  if (typeof source === 'undefined' || typeof id === 'undefined') {
    return
  }

  // only load once
  if (loaded === '1') {
    return
  } else {
    el.attr('data-loaded', '1')
  }

  var mapid = 'map' + uniqId()
  el.find('.minimap').attr('id', mapid)

  var map = setupMap(mapid, {
    zoomControl: false,
    interactive: false,
    attributionControl: false,
    layerControl: false,
    fullscreenControl: false
  })

  disableMapInteraction(map, mapid)

  // create a layer to store geojson geometries
  var geojson = new L.geoJson([], _.extend({ interactive: false }, mapStyle.minimap))
  geojson.addTo(map)

  api.geometry({ source: source, id: id }, { simplify: 0.0001 }, function (err, res) {
    if (err) { console.error(err) } else {
      // render geometries on map
      (res || []).forEach(function (row) {
        geojson.addData({
          type: 'Feature',
          properties: {
            role: row.role
          },
          geometry: row.geom
        })
      })
      map.fitBounds(geojson.getBounds())
    }
  })
}

// updates via AJAX
$(document).on('DOMNodeInserted', function (e) {
  var el = $(e.target)
  if (el.prop('tagName') === 'DIV') {
    decorateMinimap(el)
  }
  el.find('div').each(function (e) {
    decorateMinimap($(this))
  })
})

// initial load
$(document).on('DOMContentLoaded', function (e) {
  $(document).find('div').each(function (e) {
    decorateMinimap($(this))
  })
})
