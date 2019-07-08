$('document').ready(function () {
  var ul = $('ul.spatial-relationships')
  var query = _.extend({}, params.place, { role: 'default' })
  var options = { limit: 10000 }
  var select = $('#select-relationships')

  function refresh () {
    // clear contents
    ul.empty()

    api.relationship[select.val()](query, options, function (err, res) {
      if (err) { console.error(err) } else {
        (res || []).forEach(function (rel) {
          ul.append(
            '<li>' +
              '<div data-source="' + rel.source + '" data-id="' + rel.id + '">' +
                '<em class="minimap-title"></em>' +
                '<div class="minimap" />' +
              '</div>' +
            '</li>'
          )
        })
      }
    })
  }

  refresh()
  select.change(refresh)
})
