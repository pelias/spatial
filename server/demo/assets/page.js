$('document').ready(function () {
  var map = setupMap('map', { zoomControl: true, attributionControl: true })

  var geojson = L.geoJSON(null, mapStyle.place)
  geojson.addTo(map)

  // render geometries on map
  params.place.geometry.forEach(function (row) {
    geojson.addData(row.geom)
  })
  map.fitBounds(geojson.getBounds())
})
