$('document').ready(function () {
  var el = $('div.spatial-relationships')
  var query = _.extend({}, params.place, { role: 'default' })
  var options = { limit: 100 }
  var select = $('#select-relationships')

  function refresh () {
    // clear contents
    el.empty()
    $('#sidebar-relationships .select').addClass('is-loading')

    api.relationship[select.val()](query, options, function (err, res) {
      if (err) { console.error(err) } else {
        (res || []).forEach(function (rel) {
          el.append(
            '<div class="minimap-container">' +
              '<div data-source="' + rel.source + '" data-id="' + rel.id + '" data-update-text="1">' +
                '<a class="minimap-title" data-source="' + rel.source + '" data-id="' + rel.id + '" data-show-source="1" href="/explore/place/' + rel.source + '/' + rel.id + '">' +
                  rel.source + '/' + rel.id +
                '</a>' +
                '<div class="minimap" />' +
              '</div>' +
            '</div>'
          )
        })
      }
      $('#sidebar-relationships .select').removeClass('is-loading')
    })
  }

  refresh()
  select.change(refresh)
})
