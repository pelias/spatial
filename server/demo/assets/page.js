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

function disableInteraction (map, elementId) {
  map.dragging.disable()
  map.touchZoom.disable()
  map.doubleClickZoom.disable()
  map.scrollWheelZoom.disable()
  map.boxZoom.disable()
  map.keyboard.disable()
  if (map.tap) { map.tap.disable() }
  document.getElementById(elementId).style.cursor = 'default'
}

function renderGeometrySidebar (rows) {
  var sidebar = $('#sidebar-geometry').empty()
  if (!rows || !rows.length) { sidebar.hide() } else { sidebar.show() }

  sidebar.append('<p class="panel-heading">Geometries:</p>')
  // sidebar.append(`<div class="panel-block">
  //   <input id="sliderWithValue" class="slider is-fullwidth" step="0.001" min="0" max="1" value="0.0001" type="range">
  //   </div>`)

  // render elements
  rows.forEach(function (row, i) {
    var a = $('<a class="sidebar-element">')
    a.addClass('panel-block')
    a.addClass('is-active')

    var span = $('<span>')
    span.addClass('panel-icon')
    span.append('<input type="checkbox" checked="checked">')
    // span.append('<i class="fas fa-draw-polygon"></i>')
    a.append(span)

    a.append('<em>[' + row.geom.type + ']</em>')
    a.append('<strong>' + row.role + '</strong>')

    // var mapid = 'map-sidebar-' + i
    // var map = $('<div id="' + mapid + '" class="minimap">')
    // a.append(map)

    sidebar.append(a)
  })
  // sidebar.append(ul)

  // render maps
  // rows.forEach(function (row, i) {
  //   var mapid = 'map-sidebar-' + i
  //   var map = setupMap(mapid)
  //   disableInteraction(map, mapid)

  //   var geojson = L.geoJSON(null, mapStyle.minimap)
  //   geojson.addTo(map)

  //   geojson.addData(row.geom)
  //   map.fitBounds(geojson.getBounds())
  // })
}

function renderPropertySidebar (rows) {
  var sidebar = $('#sidebar-property').empty()
  if (!rows || !rows.length) { sidebar.hide() } else { sidebar.show() }

  sidebar.append('<p class="panel-heading">Properties:</p>')

  var table = $('<table class="table is-fullwidth">')
  var thead = $('<thead>')
  var tr = $('<tr>')
  tr.append('<th>key</th>')
  tr.append('<th>value</th>')
  thead.append(tr)
  table.append(thead)

  var tbody = $('<tbody>')

  rows.forEach(function (row) {
    var tr = $('<tr>')
    tr.append('<td>' + row.key + '</td>')
    tr.append('<td>' + row.value + '</td>')
    tbody.append(tr)
  })

  table.append(tbody)
  sidebar.append(table)
}

function renderHierarchySidebar (rows) {
  var sidebar = $('#sidebar-hierarchy').empty()
  if (!rows || !rows.length) { sidebar.hide() } else { sidebar.show() }

  sidebar.append('<p class="panel-heading">Hierarchies:</p>')

  var table = $('<table class="table is-fullwidth">')
  var thead = $('<thead>')
  var tr = $('<tr>')
  tr.append('<th>parent</th>')
  // tr.append('<th>child</th>')
  tr.append('<th>branch</th>')
  tr.append('<th>depth</th>')
  thead.append(tr)
  table.append(thead)

  var tbody = $('<tbody>')

  var link = function (source, id) {
    return '/demo/place/' + source + '/' + id
  }
  var body = function (source, id) {
    return source + '/' + id
  }

  rows.forEach(function (row) {
    var tr = $('<tr>')

    tr.append('<td><a href="' + link(row.parent_source, row.parent_id) + '">' + body(row.parent_source, row.parent_id) + '</a></td>')
    // tr.append('<td><a href="' + link(row.child_source, row.child_id) + '">' + body(row.child_source, row.child_id) + '</a></td>')
    tr.append('<td>' + row.branch + '</td>')
    tr.append('<td>' + row.depth + '</td>')
    tbody.append(tr)
  })

  table.append(tbody)
  sidebar.append(table)
}

$('document').ready(function () {
  var map = setupMap('map', { zoomControl: true, attributionControl: true })

  var geojson = L.geoJSON(null, mapStyle.place)
  geojson.addTo(map)

  // console.error(params)

  // load data
  api.place(place, null, function (err, data) {
    events.trigger('api.place', { err: err, data: data })
  })

  api.property(place, null, function (err, data) {
    events.trigger('api.property', { err: err, data: data })
  })

  api.hierarchy(place, null, function (err, data) {
    events.trigger('api.hierarchy', { err: err, data: data })
  })

  api.geometry(place, { /* simplify: 0.0001 */ }, function (err, data) {
    events.trigger('api.geometry', { err: err, data: data })
  })

  events.on('api.geometry', function (e, msg) {
    if (msg && msg.data) {
      (msg.data || []).forEach(function (row) {
        geojson.addData(row.geom)
      })
      map.fitBounds(geojson.getBounds())
      // $('#title').html(msg.data.class + ' / ' + msg.data.type)
    }
  })

  events.on('api.geometry', function (e, msg) {
    renderGeometrySidebar(msg.data || [])
  })

  events.on('api.property', function (e, msg) {
    renderPropertySidebar(msg.data || [])
  })

  events.on('api.hierarchy', function (e, msg) {
    renderHierarchySidebar(msg.data || [])
  })

  events.on('api.property', function (e, msg) {
    if (msg && msg.data) {
      msg.data.forEach(function (row) {
        if (row.key === 'name') {
          $('#title').html(row.value)
        }
      })
    }
  })
})
