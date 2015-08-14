  $(function() {

    // // fade and other animation for hero elements
    // $( document ).ready(function() {
    //   $('#hello .next').addClass('animated fadeInDown').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd onanimationend animationend',
    //   $('#hello h1, nav').addClass('animated fadeIn'),
    //     function() {
    //     $(this).removeClass('fadeInDown')
    //       .delay(500)
    //       .queue(function (next) {
    //     $('#hello .next').addClass('tada')
    //     next();
    //     });
    //   });
    // });

    // nav shrink on scroll
    $(window).scroll(function() {
      if ($(document).scrollTop() > 50) {
        $('nav').addClass('shrink');
      } else {
        $('nav').removeClass('shrink');
      }
    });

    // smooth nav scrolling and
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
      $('.next, .back, .logo').on('click',function (e) {
        e.preventDefault();

        var target = this.hash;
        var $target = $(target);

        $('html, body').stop().animate({
            'scrollTop': $target.offset().top,
        }, 400, 'swing', function () {
        });
      });
    });
  });
