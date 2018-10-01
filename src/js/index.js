import '../style/app.scss';
// Hacky way of exposing jQuery to the window
window.$ = $;

// Hamburger helper
$(function () {
  // Check for click events on the navbar burger icon
  $(".navbar-burger").click(function () {
    // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
    $(".navbar-burger").toggleClass("is-active");
    $(".navbar-menu").toggleClass("is-active");
  });
});

// Hero glitch
$(function () {
  var $glitch = $('.hero.glitch h1');
  $glitch.attr('data-text', $glitch.text().trim());
  var hackHeight = $glitch.height();
  var hackWidth = $glitch.width();

  function glitchOut() {
    var reHackHeight = Math.floor(Math.random(0, hackHeight) * 1000);
    var reHackWidth = Math.floor(Math.random(0, hackWidth) * 1000);

    $glitch.css({
      'background-position': reHackWidth + "px " + reHackHeight + "px"
    });
  }

  (function glitchOutLoop() {
    var rand = Math.floor((Math.random() * 4) + 1) * 1000;

    setTimeout(function () {
      glitchOut();
      glitchOutLoop();
    }, rand);
  }());
});

// Blockchain
$(function () {
  function rnd(m, n) {
    m = parseInt(m);
    n = parseInt(n);
    return Math.floor(Math.random() * (n - m + 1)) + m;
  }
  $('.blockchain').each(function () {
    var blockCount = $(this).height() / 2;
    for (var i = 0; i <= blockCount; i++) {
      var size = rnd(6, 20);
      $('<div class="block">&#xf0c8</div>')
        .css({
          top: rnd(0, 70) + '%',
          left: rnd(0, 90) + '%',
          'font-size': size + 'px',
          'animation-duration': rnd(3, 6) + 's'
        })
        .appendTo(this);
    }
  });
});

// Contact form
$(function () {
  var formLoading = false;
  var $btn = $('#contactSubmit');
  var $msg = $('#msgSent');

  $('form#contact').submit(function (event) {
    event.preventDefault();
    if (formLoading) {
      // Don't re-submit
      return;
    }
    // Reset everything
    $msg.hide();
    $btn
      .addClass('is-loading')
      .prop('disabled', true);
    formLoading = true;

    // Massage the data
    var data = $(this).serializeArray().reduce(function (collect, d) {
      collect[d.name] = d.value;
      return collect;
    }, {});

    $.ajax({
      url: '/contact.php',
      type: 'POST',
      data: data,
      contentType: 'application/x-www-form-urlencoded',
      dataType: 'text'
    })
      .always(function () {
        // It doesn't matter if the form submitted successfully or not.
        // What's the user going to do?
        formLoading = false;
        $btn
          .removeClass('is-loading')
          .prop('disabled', false);
        $msg.show();
      });
  });
});

// Smooth scroll
// Derived from https://css-tricks.com/snippets/jquery/smooth-scrolling/
$(function () {
  $('a.smooth')
    .click(function (event) {
      // Figure out element to scroll to
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      // Does a scroll target exist?
      if (target.length) {
        // Only prevent default if animation is actually gonna happen
        event.preventDefault();
        $('html, body').animate({
          scrollTop: target.offset().top
        }, 1000, function () {
          // Callback after animation
          // Must change focus! (nah)
          // var $target = $(target);
          // $target.focus();
          // if ($target.is(":focus")) { // Checking if the target was focused
          //   return false;
          // } else {
          //   $target.attr('tabindex', '-1'); // Adding tabindex for elements not focusable
          //   $target.focus(); // Set focus again
          // };
        });
      }
    });
});
