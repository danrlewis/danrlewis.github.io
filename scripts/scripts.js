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

    //Navbar Shrink
    $(window).scroll(function() {
      if ($(document).scrollTop() > 50) {
        $('nav').addClass('shrink');
      } else {
        $('nav').removeClass('shrink');
      }
    });

    // Smooth Scroll
    $(document).ready(function(){
      $('a[href^=#]').on('click',function (e) {
        e.preventDefault();

        var target = this.hash;
        var $target = $(target);

        $('html, body').stop().animate({
            'scrollTop': $target.offset().top - 70,
        }, 500, 'swing', function () {
            //window.location.hash = target;
        });
      });
    });
  });
