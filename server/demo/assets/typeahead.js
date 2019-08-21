// http://www.runningcoder.org/jquerytypeahead/

$('document').ready(function () {
  $.typeahead({
    input: '#search',
    minLength: 1,
    maxItem: 10,
    order: null,
    dynamic: true,
    hint: true,
    backdrop: {
      'background-color': '#fff'
    },
    template: function (query, item) {
      // console.error('template', query, item)
      return '<span class="row">' +
        '<p style="margin-bottom: 4px">{{name}}</p>' +
        '<ul class="hierarchy" data-source="{{source}}" data-id="{{id}}"></ul>' +
        '</span>'
    },
    emptyTemplate: 'no result for {{query}}',
    source: {
      place: {
        display: 'name',
        ajax: function (query) {
          return {
            type: 'GET',
            url: '/query/search',
            data: {
              text: '{{query}}'
            },
            callback: {
              done: function (data) {
                // console.error('search', data)
                return data
              }
            }
          }
        }
      }
    },
    callback: {
      onClick: function (node, a, item, event) {
        // console.log('onClick')
        // console.error(JSON.stringify(item))
        window.location = '/explore/place/' + item.source + '/' + item.id
      },
      onSendRequest: function (node, query) {
        // console.log('request is sent')
        // console.log(node, query)
      },
      onReceiveRequest: function (node, query) {
        // console.log('request is received')
        // console.log(node, query)
      }
    },
    debug: true
  })
})
