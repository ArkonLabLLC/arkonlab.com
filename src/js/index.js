import '../style/app.scss';
// Hacky way of exposing jQuery to the window
window.$ = $;
import 'jquery-validation/dist/jquery.validate.js';

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

// Blockchain animation
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

  // jquery validation plugin
  // https://jqueryvalidation.org/validate/
  $('form#contact').validate({
    errorClass: 'is-danger',
    errorElement: 'p',
    ignoreTitle: true,
    errorPlacement: function (error, element) {
      // We do this simply to add the help class as we can't do it
      // with errorClass as it'll add it to the inputs too.
      error.addClass('help').appendTo(element.parent());
    },
    invalidHandler: function (event, validator) {
      event.preventDefault();
      $msg.hide();
    },
    submitHandler: function (form, event) {
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
      var data = $(form).serializeArray().reduce(function (collect, d) {
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
    }
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

// Text area remaining characters counter.
// Add the class .show-count to any textarea.
// If the text area has a maxlength count will be out of that.
// Ensure the parent is a .control or another container that has a position
// set to prevent our counter element from escaping.
$(function () {
  var WARNING_CLASS = 'warning';
  var WARNING_THRESHOLD = 100;

  /* Feature detection */
  var passiveIfSupported = false;
  try {
    var opt = Object.defineProperty({}, 'passive', {
      get: function () { passiveIfSupported = { passive: true }; return true; }
    });
    window.addEventListener('test', opt, opt);
    window.removeEventListener('test', opt, opt);
  } catch (err) { }

  $('textarea.show-count').each(function () {
    var $textArea = $(this);
    var MAX_CHARS = parseInt($textArea.attr('maxlength'), 10);
    var SHOW_MAX = !isNaN(MAX_CHARS) && !!MAX_CHARS;
    var WARNING_CHARS = SHOW_MAX ? MAX_CHARS - WARNING_THRESHOLD : 0;

    var $control = $textArea.parent(); // .control parent
    var $value = $('<span/>').text('0');
    var $counter = $('<div />')
      .addClass('text-area-counter')
      .append($value)
      .appendTo($control);
    if (SHOW_MAX) {
      $counter.append('<span>/' + MAX_CHARS + '</span>');
    }

    // We're going to bind to keydown manually as we want to use passive
    // binding if the browser supports it. This is also WAAAAAAY faster than
    // jQuery's event binding (lots of overhead in there).
    var wasOverMax = false;
    window.addEventListener('input', function (event) {
      var len = $textArea.val().length;
      $value.text(len);

      if (!SHOW_MAX) {
        return;
      }

      // We use wasOverMax as a flag to prevent unnecessary class flipping
      var isOver = parseInt(len, 10) > WARNING_CHARS;
      if (isOver && !wasOverMax) {
        wasOverMax = true;
        $counter.addClass(WARNING_CLASS);
      } else if (!isOver && wasOverMax) {
        wasOverMax = false;
        $counter.removeClass(WARNING_CLASS)
      }
    }, passiveIfSupported);
  });
})
