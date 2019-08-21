function decorateHierarchy(el) {
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

  api.hierarchy({ source: source, id: id }, {}, function (err, res) {
    if (err) { console.error(err) } else {

      // empty UL
      el.empty()

      var hierarchy = res;
      if( !Array.isArray(res) || !res.length ){ return }

      el.append($(
        '<li>' +
          '<p>' + source + ' ' + id + '</p>' +
        '</li>'
      ))

      // render hierarchy
      hierarchy.forEach(function(row){
        if( row.depth === 0 ){ return }
        el.append($(
          '<li>' +
            '<a data-source="'+ row.parent_source +'" data-id="'+ row.parent_id +'">' +
            row.parent_source +'/'+ row.parent_id +
            '</a>' +
          '</li>'
        ))
      });
    }
  })
}

// updates via AJAX
$(document).on('DOMNodeInserted', function (e) {
  var el = $(e.target)
  if (el.prop('tagName') === 'UL') {
    decorateHierarchy(el)
  }
  el.find('ul').each(function (e) {
    decorateHierarchy($(this))
  })
})

// initial load
$(document).on('DOMContentLoaded', function (e) {
  $(document).find('ul').each(function (e) {
    decorateHierarchy($(this))
  })
})
