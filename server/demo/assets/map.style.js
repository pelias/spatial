var mapStyle = {}

// place view
mapStyle.place = {}
mapStyle.place.pointToLayer = pointToLayer
mapStyle.place.style = function (feature) {
  if (feature.properties.role === 'envelope') {
    return {
      color: '#FF851B',
      weight: 3,
      opacity: 0.05,
      dashArray: '5',
      fillOpacity: 0
    }
  }
  return {
    fillColor: '#FF851B',
    weight: 0,
    opacity: 1,
    // dashArray: '3',
    fillOpacity: 0.7
  }
}

// minimap view
mapStyle.minimap = {}
mapStyle.minimap.pointToLayer = pointToLayer
mapStyle.minimap.style = function (feature) {
  if (feature.properties.role === 'envelope') {
    return {
      color: '#FF851B',
      weight: 3,
      opacity: 0.05,
      dashArray: '5',
      fillOpacity: 0
    }
  }
  return {
    fillColor: '#FF851B',
    color: '#0000ff',
    weight: 0,
    opacity: 1,
    // dashArray: '3',
    fillOpacity: 0.6
  }
}

// point-in-polygon view
mapStyle.pip = {}
mapStyle.pip.style = function (feature) {
  // style for linestrings
  if (feature.geometry.type.indexOf('LineString') !== -1) {
    return {
      weight: 3,
      opacity: 1,
      // dashArray: '1,6',
      color: 'darkred',
      fillOpacity: 0,
      className: 'linestring'
    }
  }

  var style = {
    fillColor: 'red',
    weight: 1,
    opacity: 1,
    color: 'red',
    dashArray: '5',
    fillOpacity: 0.06,
    className: 'polygon'
  }

  // whosonfirst
  if (feature.properties.source === 'wof') {
    switch (feature.properties.type) {
      case 'planet':
      case 'continent':
      case 'empire':
      case 'country':
        style.fillOpacity = 0.0
        break
    }
  }

  // uscensus
  else if (feature.properties.source === 'uscensus') {
    style.color = 'green'
  }

  // openstreetmap
  else {
    style.color = 'blue'
    var level = parseInt(feature.properties.type, 10)
    if (!level || level < 4) {
      style.fillOpacity = 0.0
    }
  }

  // style for polygons
  return style
}

function pointToLayer (feature, latlng) {
  var options = {}
  if (feature && feature.properties) {
    var role = feature.properties.role
    if (role === 'centroid') {
      options.icon = L.AwesomeMarkers.icon({
        icon: 'crosshairs',
        markerColor: 'blue'
      })
    } else if (role === 'label_position') {
      options.icon = L.AwesomeMarkers.icon({
        icon: 'quote-right',
        markerColor: 'orange'
      })
    } else if (role === 'reversegeo_position') {
      options.icon = L.AwesomeMarkers.icon({
        icon: 'compass',
        markerColor: 'green'
      })
    } else if (role === 'mapshaper_position') {
      options.icon = L.AwesomeMarkers.icon({
        icon: 'drafting-compass',
        markerColor: 'cadetblue'
      })
    }
  }
  return L.marker(latlng, options)
}
