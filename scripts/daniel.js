var Daniel = {}

$(function() {
  Daniel.fadeStuffIn('#work img, .quote')
  Daniel.levitateOnHover('#trigger-modal-cards', '.cards img')
  Daniel.levitateOnHover('#trigger-modal-tracks', '.tracks img')
  Daniel.levitateOnHover('#trigger-modal-home', '.home img')
  Daniel.hamburgerToggle('.hamburger')

  Daniel.modal.bodyScrollOnClose('.modal .back', 'body')
  Daniel.modal.fixBackArrow('.modal', '.back')
  Daniel.modal.freezeBodyScrollOnOpen('.modal-trigger', 'body')
  Daniel.modal.openOnClick('#trigger-modal-cards', '#modal-cards', 'slideInUp')
  Daniel.modal.openOnClick('#trigger-modal-tracks', '#modal-tracks', 'slideInUp')
  Daniel.modal.openOnClick('#trigger-modal-home', '#modal-home', 'slideInUp')
  Daniel.modal.closeOnClick('.modal .back', '.modal', 'slideOutDown')
})

Daniel.hamburgerToggle = function(e) {
  $(this)toggleClass("is-active")
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

Daniel.levitateOnHover = function(trigger, element) {
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
