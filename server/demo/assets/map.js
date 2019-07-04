function setupMap (elementId, settings) {
  if (!settings) { settings = {} }
  settings.zoomControl = !!settings.zoomControl
  settings.attributionControl = !!settings.attributionControl

  var map = L.map(elementId, settings)

  var tileSettings = {
    attribution: 'Map tiles by Carto, under CC BY 3.0. Data by OpenStreetMap, under ODbL.',
    maxZoom: 17,
    minZoom: 1
  }

  let tiles = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', tileSettings)
  tiles.addTo(map)

  map.setView({ lng: -73.9805, lat: 40.7259 }, 12)
  return map
}

function disableMapInteraction (map, elementId) {
  map.dragging.disable()
  map.touchZoom.disable()
  map.doubleClickZoom.disable()
  map.scrollWheelZoom.disable()
  map.boxZoom.disable()
  map.keyboard.disable()
  if (map.tap) { map.tap.disable() }
  document.getElementById(elementId).style.cursor = 'default'
}
