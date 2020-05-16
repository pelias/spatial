// configure 'awesome markers' to use font awesome
L.AwesomeMarkers.Icon.prototype.options.prefix = 'fa'

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

  provider.jawg = {
    maxZoom: 22,
    subdomains: 'abcd',
    attribution: 'Map &copy; <a href="http://jawg.io" target="_blank" class="jawg-attrib"><b>Jawg</b>Maps</a> | Map data &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" class="osm-attrib">OpenStreetMap contributors</a>'
  }

  var tiles = {
    'jawg': L.tileLayer('//{s}.tile.jawg.io/jawg-terrain/{z}/{x}/{y}.png?access-token=t6fAKnvaPdPCucraY88YwlKjBfUHqBMvvZBIWlcp1Z9Z5FVtA02uWo6Dc9DGB2JO', provider.jawg),
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
  settings.layers = [tiles['jawg']]
  settings.scrollWheelZoom = 'center'

  // https://github.com/Leaflet/Leaflet/issues/6298
  L.Map.addInitHook(function () {
    // Store a reference of the Leaflet map object on the map container,
    // so that it could be retrieved from DOM selection.
    // https://leafletjs.com/reference-1.3.4.html#map-getcontainer
    this.getContainer()._leaflet_map = this
  })

  var map = L.map(elementId, settings)

  if (settings.layerControl !== false) {
    L.control.layers(tiles).addTo(map)
  }

  // a fallback location when other methods of detection fail
  function zoomToManhattan () {
    map.setView({ lng: -73.9805, lat: 40.7259 }, 12)
  }

  if (settings.fullscreenControl !== false) {
    map.addControl(new L.Control.Fullscreen({
      title: {
        'false': 'View Fullscreen',
        'true': 'Exit Fullscreen'
      }
    }))
  }

  if (settings.hashControl === true) {
    var hash = new L.Hash(map)
    if (!location.hash) {
      // user declined popup
      map.once('locationerror', zoomToManhattan)
      map.locate({ setView: true, watch: false, maxZoom: 17 })
    }
  } else {
    zoomToManhattan()
  }

  if (settings.crosshairControl === true) {
    // Add in a crosshair for the map
    var crosshairIcon = L.icon({
      iconUrl: '/explore/assets/vendor/icons/MapCenterCoordIcon1.svg',
      iconSize: [40, 40], // size of the icon
      iconAnchor: [10, 10] // point of the icon which will correspond to marker's location
    })
    var crosshair = new L.marker(
      [40.7259, -73.9805],
      { icon: crosshairIcon, interactive: false }
    )
    crosshair.addTo(map)

    // Move the crosshair to the center of the map when the user pans
    map.on('move', function (e) {
      crosshair.setLatLng(map.getCenter())
    })
  }

  // disable map interaction for touch devices
  if (Modernizr && Modernizr.touch) {
    disableMapInteraction(map, elementId)
  }

  if (typeof settings.addHashToLink === 'string') {
    var el = $(settings.addHashToLink)
    var appendHash = function () {
      if (!el.length) { return }
      var href = el.attr('href')
      if (!href || !href.length) { return }
      el.attr('href', href.split('#')[0] + L.Hash.formatHash(map))
    }

    map.on('moveend', appendHash.bind(el))
    map.on('zoomend', appendHash.bind(el))
  }

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
