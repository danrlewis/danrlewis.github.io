  $(function() {

    // fade animation for hero elements
    $( document ).ready(function() {
      $('#hello .next').addClass('animated fadeInDown').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd onanimationend animationend',
      $('#hello .block').addClass('animated fadeIn'),
        function() {
        $(this).removeClass('fadeInDown')
          .delay(2000)
          .queue(function (next) {
        $('#hello .next').addClass('tada')
        next();
        });
      });
    });

    // nav shrink on scroll
    $(window).scroll(function() {
      if ($(document).scrollTop() > 50) {
        $('nav').addClass('shrink');
      } else {
        $('nav').removeClass('shrink');
      }
    });

    // smoth nav scrolling and
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
