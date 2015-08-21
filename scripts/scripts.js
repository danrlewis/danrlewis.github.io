var Daniel = {}

$(function() {
  Daniel.shrinkNav('nav')
  Daniel.smoothScrolling('nav')
  Daniel.fadeStuffIn('#why img, #features img, #work img, .quote, #chat p a')
  Daniel.modalOpenOnClick('.modal-trigger', '.modal', 'slideInUp')
  Daniel.modalCloseOnClick('.modal .back', '.modal', 'slideOutDown')
  Daniel.freezeBodyScrollOnModalOpen('.modal-trigger', 'body')
  Daniel.bodyScrollOnModalClose('.modal .back', 'body')
  Daniel.levitateImgOnHover('.modal-trigger', '.card img')
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
      $(element).removeClass('animated slideOutDown').addClass('animated ' + animation)
  })
}

Daniel.modalCloseOnClick = function(trigger, element, animation) {
  element = $(element)
  trigger = $(trigger)

  trigger.click(
    function() {
      $(element).removeClass('animated slideInUp').addClass('animated ' + animation)
  })
}

Daniel.freezeBodyScrollOnModalOpen = function(trigger, element) {
  element = $(element)
  trigger = $(trigger)

  trigger.click(
    function(){
      $(element).addClass('modal-open')
  })
}

Daniel.bodyScrollOnModalClose = function(trigger, element) {
  element = $(element)
  trigger = $(trigger)

  trigger.click(
    function(){
      $(element).removeClass('modal-open')
  })
}

Daniel.levitateImgOnHover = function(trigger, element) {
  element = $(element)
  trigger = $(trigger)

  trigger.hover(
    function() {
      $(element).addClass('levitate')
    },
    function() {
      $(element).removeClass('levitate')

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
