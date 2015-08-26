Daniel.modal = {}

Daniel.modal.openOnClick = function(trigger, element, animation) {
  element = $(element)
  trigger = $(trigger)

  trigger.click(
    function() {
      $(element).trigger('scroll')
      $(element).removeClass('animated slideOutDown').addClass('animated ' + animation)
  })
}

Daniel.modal.closeOnClick = function(trigger, element, animation) {
  element = $(element)
  trigger = $(trigger)

  trigger.click(
    function() {
      $(element).removeClass('animated slideInUp').addClass('animated ' + animation)
  })
}

Daniel.modal.freezeBodyScrollOnOpen = function(trigger, element) {
  element = $(element)
  trigger = $(trigger)

  trigger.click(
    function(){
      $(element).addClass('modal-open')
  })
}

Daniel.modal.bodyScrollOnClose = function(trigger, element) {
  element = $(element)
  trigger = $(trigger)

  trigger.click(
    function(){
      $(element).removeClass('modal-open')
  })
}

Daniel.modal.fixBackArrow = function(container, back) {
  $(container).on('scroll', function() {
    $(back).css('top', $(this).scrollTop())
  })
}

