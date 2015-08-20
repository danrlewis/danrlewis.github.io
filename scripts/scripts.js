var Daniel = {}

$(function() {
  Daniel.shrinkNav('nav')
  Daniel.smoothScrolling('nav')
  Daniel.fadeStuffIn('.row img, .quote, #chat p a')
  Daniel.modalOpenOnClick('.modal-open', '.modal', 'bounceInUp')
  Daniel.modalCloseOnClick('.modal .back', '.modal', 'bounceOutDown')
  Daniel.scrollSmoothly('.next, .logo')
})


Daniel.shrinkNav = function(element) {
  $(window).scroll(function() {
    if ($(document).scrollTop() > 50) {
      $(element).addClass('shrink')
    } else {
      $(element).removeClass('shrink')
    }
  })
}

Daniel.smoothScrolling = function(element) {
  $(element).singlePageNav({
    offset: $(element).outerHeight(),
    filter: ':not(.external)',
    updateHash: false
  })
}

Daniel.fadeStuffIn = function(elements) {
  $(elements).addClass("hidden").viewportChecker({
    classToAdd: 'visible animated fadeIn',
    offset: 150
  })
}

Daniel.modalOpenOnClick = function(trigger, element, animation) {
  element = $(element)
  trigger = $(trigger)

  trigger.click(
    function() {
      $(element).removeClass('animated' + animation).addClass('animated ' + animation)
  })
}

Daniel.modalCloseOnClick = function(trigger, element, animation) {
  element = $(element)
  trigger = $(trigger)

  trigger.click(
    function() {
      $(element).removeClass('animated' + animation).addClass('animated ' + animation)
  })
}


Daniel.scrollSmoothly = function(elements) {
  $(elements).on('click',function (e) {
    event.preventDefault()

    var target = this.hash
    var $target = $(target)

    $('html, body').stop().animate({
        'scrollTop': $target.offset().top,
    }, 400, 'swing', function () {}
    )
  })
}
