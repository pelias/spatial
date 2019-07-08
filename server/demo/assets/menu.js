/* jshint browser: true */
// The following code is based off a toggle menu by @Bradcomp
// source: https://gist.github.com/Bradcomp/a9ef2ef322a8e8017443b626208999c1
// (function () {
//   var burger = document.querySelector('.burger')
//   if (!burger) { return }
//   var menu = document.querySelector('#' + burger.dataset.target)
//   burger.addEventListener('click', function () {
//     burger.classList.toggle('is-active')
//     menu.classList.toggle('is-active')
//   })
// })()

$('document').ready(function () {
  $('#menu-toggle').click(function (e) {
    var menu = $('#menu')
    if (menu.hasClass('expanded')) {
      menu.removeClass('expanded')
      $('#menu-toggle i').removeClass('fa-minus')
      $('#menu-toggle i').addClass('fa-plus')
    } else {
      menu.addClass('expanded')
      $('#menu-toggle i').removeClass('fa-plus')
      $('#menu-toggle i').addClass('fa-minus')
    }
  })
})
