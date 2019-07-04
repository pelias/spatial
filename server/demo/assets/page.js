$('document').ready(function () {
  var map = setupMap('map', { zoomControl: true, attributionControl: true })

  var geojson = L.geoJSON(null, mapStyle.place)
  geojson.addTo(map)

  // render geometries on map
  params.place.geometry.forEach(function (row) {
    geojson.addData(row.geom)
  })
  map.fitBounds(geojson.getBounds())

  $('#menu-toggle').click(function (e) {
    var menu = $('#menu')
    if (menu.hasClass('expanded')) {
      menu.removeClass('expanded')
      $('#menu-toggle i').removeClass('fa-minus')
      $('#menu-toggle i').addClass('fa-plus')
    } else {
      menu.addClass('expanded')
      $('#menu-toggle i').removeClass('fa-plus')
      $('#menu-toggle i').addClass('fa-minus')
    }
  })
})
