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

  api.name({ source: source, id: id }, {}, function (err, res) {
    if (err) { console.error(err) } else {
      var chosen = 'unknown'
      if (res.length > 0) { chosen = res[0].name }

      el.attr('href', '/explore/place/' + encodeURIComponent(source) + '/' + encodeURIComponent(id))
      el.empty()

      var displaySourceAttr = el.attr('data-show-source')
      if (displaySourceAttr && displaySourceAttr !== '0') {
        var tagSpan = $('<span class="tag is-light link-tag"></span>')
        tagSpan.text(source)
        el.append(tagSpan)
      }

      var textSpan = $('<span></span>')
      textSpan.text(chosen)
      el.append(textSpan)
    }
  })
}

// updates via AJAX
const observer = new MutationObserver(mutationList => {
  mutationList.filter(m => m.type === 'childList').forEach(e => {
    var el = $(e.target)
    if (el.prop('tagName') === 'A') {
      decorateLink(el)
    }
    el.find('a').each(function (e) {
      decorateLink($(this))
    })
  })
})
observer.observe(document, {childList: true, subtree: true})

// initial load
$(document).on('DOMContentLoaded', function (e) {
  $(document).find('a').each(function (e) {
    decorateLink($(this))
  })
})
