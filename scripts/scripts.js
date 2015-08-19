var Daniel = {}

$(function() {
  Daniel.animateOnHover('#work a', 'img', 'bounceIn')
  Daniel.shrinkNav('nav')
  Daniel.smoothScrolling('nav')
  Daniel.fadeStuffIn('.row img, .quote, #chat p a')
  Daniel.setupModals('.modal')
  Daniel.scrollSmoothly('.next, .logo')
})

Daniel.animateOnHover = function(trigger, element, animation) {
  element = $(element)
  trigger = $(trigger)

  trigger.hover(
    function() {
      $(this).children(element).removeClass('fadeIn').addClass('animated ' + animation)
    },
    function(){
      $(this).children(element).removeClass('animated ' + animation)
  })
}

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

Daniel.setupModals = function(element) {
  $(element).animatedModal()
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


