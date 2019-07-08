var mapStyle = {}

mapStyle.place = {
  fillColor: '#FF851B',
  color: '#0000ff',
  weight: 0,
  opacity: 1,
  // dashArray: '3',
  fillOpacity: 0.8
}

mapStyle.minimap = {
  fillColor: '#FF851B',
  color: '#0000ff',
  weight: 0,
  opacity: 1,
  // dashArray: '3',
  fillOpacity: 0.6
}

// dynamic geometry styling
function featureStyle (feature) {
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

  // ordnance survey
  else if (feature.properties.source === 'os') {
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
