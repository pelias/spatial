function setupMap (elementId, settings) {
  var provider = {}

  provider.stamen = {
    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    subdomains: 'abcd',
    minZoom: 0,
    maxZoom: 20,
    ext: 'png'
  }

  provider.carto = {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
  }

  provider.osm = {
    maxZoom: 18,
    attribution: 'Tiles courtesy of <a href="http://openstreetmap.se/" target="_blank">OpenStreetMap Sweden</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }

  provider.wikimedia = {
    maxZoom: 18,
    attribution: '<a href="https://wikimediafoundation.org/wiki/Maps_Terms_of_Use">Wikimedia maps</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }

  let tiles = {
    'wikimedia': L.tileLayer('https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png', provider.wikimedia),
    'toner': L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}{r}.{ext}', provider.stamen),
    'toner_nolabels': L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-background/{z}/{x}/{y}{r}.{ext}', provider.stamen),
    'toner_lite': L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.{ext}', provider.stamen),
    'voyager': L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', provider.carto),
    'voyager_nolabels': L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png', provider.carto),
    'light_all': L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', provider.carto),
    'dark': L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', provider.carto),
    'dark_nolabels': L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', provider.carto),
    'hydda': L.tileLayer('https://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png', provider.osm),
    'hydda_nolabels': L.tileLayer('https://{s}.tile.openstreetmap.se/hydda/base/{z}/{x}/{y}.png', provider.osm)
  }

  if (!settings) { settings = {} }
  settings.zoomControl = !!settings.zoomControl
  settings.attributionControl = !!settings.attributionControl
  settings.layers = [tiles['wikimedia']]

  // https://github.com/Leaflet/Leaflet/issues/6298
  L.Map.addInitHook(function () {
    // Store a reference of the Leaflet map object on the map container,
    // so that it could be retrieved from DOM selection.
    // https://leafletjs.com/reference-1.3.4.html#map-getcontainer
    this.getContainer()._leaflet_map = this
  })

  var map = L.map(elementId, settings)
  L.control.layers(tiles).addTo(map)

  // map.setView({ lng: -73.9805, lat: 40.7259 }, 12)
  map.setView({ lng: 174.7786, lat: -41.29 }, 12)

  map.addControl(new L.Control.Fullscreen({
    title: {
      'false': 'View Fullscreen',
      'true': 'Exit Fullscreen'
    }
  }))

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
