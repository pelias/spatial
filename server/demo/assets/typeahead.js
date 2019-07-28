// http://www.runningcoder.org/jquerytypeahead/

$('document').ready(function () {
  $.typeahead({
    input: '#search',
    minLength: 1,
    maxItem: 15,
    order: null,
    dynamic: true,
    delay: 100,
    backdrop: {
      'background-color': '#fff'
    },
    template: function (query, item) {
      console.error('template', query, item)
      return '<span class="row">' +
        '<span>{{name}}</span>' +
        '<span class="tag is-light">{{source}}/{{id}}</span>' +
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
