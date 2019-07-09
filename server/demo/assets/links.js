function decorateLink (el) {
  var source = el.attr('data-source')
  var id = el.attr('data-id')
  var loaded = el.attr('data-loaded')

  if (typeof source === 'undefined' || typeof id === 'undefined') {
    return
  }

  // only load once
  if (loaded === '1') {
    return
  } else {
    el.attr('data-loaded', '1')
  }

  // text is empty
  if (el.text() === '') {
    el.text(source + '/' + id)
  }

  api.property({ source: source, id: id }, {}, function (err, res) {
    if (err) { console.error(err) } else {
      (res || []).forEach(function (prop) {
        if (prop.key === 'name') {
          el.attr('href', '/demo/place/' + encodeURIComponent(source) + '/' + encodeURIComponent(id))
          el.text(prop.value)
        }
      })
    }
  })
}

// updates via AJAX
$(document).on('DOMNodeInserted', function (e) {
  var el = $(e.target)
  if (el.prop('tagName') === 'A') {
    decorateLink(el)
  }
  el.find('a').each(function (e) {
    decorateLink($(this))
  })
})

// initial load
$(document).on('DOMContentLoaded', function (e) {
  $(document).find('a').each(function (e) {
    decorateLink($(this))
  })
})
