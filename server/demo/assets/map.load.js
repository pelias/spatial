$('document').ready(function () {
  var map = setupMap('map', { zoomControl: true, attributionControl: true })

  var geojson = L.geoJSON(null, { style: mapStyle.place, interactive: false })
  geojson.addTo(map)

  // render geometries on map
  _.get(params, 'place.geometry', []).forEach(function (row) {
    geojson.addData(row.geom)
  })
  map.fitBounds(geojson.getBounds())
})
