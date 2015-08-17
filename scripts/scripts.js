  $(function() {

    // nav shrink on scroll
    $(window).scroll(function() {
      if ($(document).scrollTop() > 50) {
        $('nav').addClass('shrink');
      } else {
        $('nav').removeClass('shrink');
      }
    });

    // smooth nav scrolling
    $('nav').singlePageNav({
      offset: $('nav').outerHeight(),
      filter: ':not(.external)',
      updateHash: false,
      beforeStart: function() {
          console.log('begin scrolling');
      },
      onComplete: function() {
          console.log('done scrolling');
      }
    });

    // fade in elements on scroll
    $(document).ready(function() {
    jQuery('.row img, .quote, #chat .block').addClass("hidden").viewportChecker({
        classToAdd: 'visible animated fadeIn',
        offset: 150
       });
    });

    // smooth scroll for non-nav elements
    $(document).ready(function(){
      $('.next, .logo').on('click',function (e) {
        event.preventDefault();

        var target = this.hash;
        var $target = $(target);

        $('html, body').stop().animate({
            'scrollTop': $target.offset().top,
        }, 400, 'swing', function () {
        });
      });
    });

  });
