  $(function() {
    // Animation Triggers
    $( document ).ready(function() {
      $('.hero .next').addClass('animated fadeInDown').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd onanimationend animationend',
      $('.hero .block').addClass('animated fadeIn'),
        function() {
        $(this).removeClass('fadeInDown')
          .delay(2000)
          .queue(function (next) {
        $('.hero .next').addClass('tada')
        next();
        });
      });
    });

    //nav scroll shrink
    $(window).scroll(function() {
      if ($(document).scrollTop() > 50) {
        $('nav').addClass('shrink');
      } else {
        $('nav').removeClass('shrink');
      }
    });

    $('nav').onePageNav({
      currentClass: 'current',
      changeHash: false,
      scrollSpeed: 500,
      scrollThreshold: 0.5,
      filter: '',
      easing: 'swing',
      begin: function() {
      },
      end: function() {
      },
      scrollChange: function($currentListItem) {
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
        }, 500, 'swing', function () {
        });
      });
    });
  });
