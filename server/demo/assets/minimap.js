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

  // text is empty
  if (el.find('.minimap-title').html() === '' || el.attr('data-update-text') === '1') {
    el.find('.minimap-title').html(
      '<a data-source="' + source + '" data-id="' + id + '" data-show-source="1"></a>'
    )
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
  var geojson = new L.geoJson([], { style: mapStyle.minimap, interactive: false })
  geojson.addTo(map)

  api.geometry({ source: source, id: id }, { simplify: 0.0001 }, function (err, res) {
    if (err) { console.error(err) } else {
      // render geometries on map
      (res || []).forEach(function (row) {
        geojson.addData(row.geom)
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
