// Module Start
/**
 * Cookies setting
 * Setter
 * @param {string} n Nome cookie
 * @param {string} v Valore cookie
 */
function ck(n, v) {
  const s = new Date();

  s.setDate(s.getDate() + 30);
  document.cookie = n + '=' + escape(v) + '; expires=' + s.toGMTString() +
    '; path=/;secure';
}

/**
 * Cookies check
 * setter
 * @param {string} n Cookie name
 * @return {string} Cookie value
 */
function l(n) {
  if (document.cookie.length > 0) {
    let i = document.cookie.indexOf(n + '=');

    if (i != -1) {
      i = i + n.length + 1;

      let f = document.cookie.indexOf(';', i);

      if (f == -1) {
        f = document.cookie.length;
      }

      return unescape(document.cookie.substring(i, f));
    } else {
      return '';
    }
  }

  return '';
}

/**
 * Cookies deletion
 * Setter
 * @param {string} n Cookie name
 */
function dk(n) {
  document.cookie = n + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/;';
}

/**
 * Cookies acceptance check
 * Getter
 * @param {string} n Cookie name
 */
function ak(n) {
  const c = l(n);

  // Cookie check
  // If polocy hasn't been accepted
  if (c === '' && n === 'cookie_law_stack') {
    $('.label__field')
        .each(function() {
          $(this).attr('checked', 'checked');
        });
    $('.cookies').fadeIn();
  } else if (c === '') {
    // Else if not exists
    switch (n) {
      case 'google_stack':
        $('#google-cookie').removeAttr('checked');

        break;
      default:
    }
  } else if (c !== '') {
    // Else if exist
    switch (n) {
      case 'cookie_law_stack':
        $('.cookies__cta').removeClass('opened');
        $('.cookies__body, .cookies__form, .cookies__cta--accept, .body__close--notification')
            .addClass('hidden');
        $('.cookies, .cookies__container')
            .addClass('closed');
        $('.cookies__container, .cookies__cta--settings')
            .removeClass('opened');
        $('.cookies').addClass('mobile');
        $('.cookies__cta--settings')
            .html('Cookies');

        break;
      case 'google_stack':
        $('#google-cookie').attr('checked', 'checked');

        break;
      default:
    }
  }
}

/**
 * Cookies management
 * Setter
 * @export
 */
export default function setCookies() {
  document.cookie = 'test_cookie';

  const t = (document.cookie.indexOf('test_cookie') != -1) ? true : false;
  const n = ['cookie_law_stack', 'google_stack'];

  if (t) {
    for (const i in n) {
      ak(n[i]);
    }

    // Settings
    $('.cookies__cta--settings')
        .on('click tap', function(e) {
          e.preventDefault();

          $('.cookies, .cookies__container')
              .removeClass('closed');
          $('.cookies, .cookies__container, .cookies__cta, .cookies__cta--settings')
              .addClass('opened');
          $('.cookies__body, .cookies__form, .cookies__cta--accept, .cookies__cta--opt-out, .cookies__cta--save, .body__close--notification')
              .removeClass('hidden');
          $('.cookies--notification').removeClass('animated slideInDown')
              .addClass('hidden');
          $('.cookies').removeClass('mobile');

          if ($('html').attr('lang') == 'it-IT') {
            $('.cookies__cta--settings')
                .html('settings');
          } else {
            $('.cookies__cta--settings')
                .html('Settings');
          }

          $('.cookies--settings').removeClass('hidden animated slideOutUp')
              .addClass('animated slideInDown');
        });
    // Acceptance
    $('.cookies__cta--accept')
        .on('click tap', function(e) {
          e.preventDefault();

          // Cookie Policy
          if (l('cookie_law_stack') === '') {
            ck('cookie_law_stack', 'accepted');

            // Notify sending
            $.post('/php/cookies-notify.php');
          }

          // Third-party cookies
          $('.label__field')
              .each(function() {
                if (l($(this).val()) === '') {
                  ck($(this).val(), 'accepted');
                  ak($(this).val());
                }
              });
        });
    // Save
    $('.cookies__cta--save')
        .on('click tap', (e) => {
          e.preventDefault();

          // Cookies update
          $('.label__field')
              .each((i, elemento) => {
                if ($(elemento).attr('checked')) {
                  ck($(elemento).val(), 'accepted');
                  ak($(elemento).val());
                } else {
                  dk($(elemento).val());
                  ak($(elemento).val());
                }
              });
        });
    // Opt-Out
    $('.cookies__cta--opt-out')
        .on('click tap', (e) => {
          e.preventDefault();

          // Cookies disabling
          $('.label__field')
              .each((i, elemento) => {
                $(elemento).removeAttr('checked');

                dk($(elemento).val());
                ak($(elemento).val());
              });
        });
    // Closing
    $('.body__close--notification').on('click tap', () => {
      $('.cookies').addClass('animated fadeOut');

      setTimeout(() => {
        $('.cookies').addClass('hidden');
      }, 500);
    });
    $('.body__close--settings')
        .on('click tap', () => {
          $('.cookies--settings').removeClass('animated slideInDown')
              .addClass('hidden');
          $('.cookies').removeClass('opened');
          $('.cookies__container').addClass('opened');
          $('.cookies--notification').removeClass('hidden animated slideOutUp')
              .addClass('animated slideInDown');
          $('.cookies__cta').addClass('opened');
        });
    // UX
    $('.label__field')
        .on('change', function() {
          if ($(this).attr('checked')) {
            $(this).removeAttr('checked');
          } else {
            $(this).attr('checked', 'checked');
          }
        });
    $('.cookies__cta--accept, .cookies__cta--save')
        .on('click tap', () => {
          $('.cookies__cta, .cookies__container').removeClass('opened');
          $('.cookies__body, .cookies__form, .cookies__cta--accept, .cookies__cta--opt-out, .cookies__cta--save, .body__close--notification')
              .addClass('hidden');
          $('.cookies--notification').removeClass('hidden');
          $('.cookies, .cookies__container')
              .addClass('closed');
          $('.cookies').addClass('mobile');
          $('.cookies__cta--settings')
              .html('Cookies');
        });
    $(window).on('scroll', function() {
      if ($(this).scrollTop() + $(this).outerHeight() >=
        $('.footer--bottom').offset().top) {
        $('.cookies.closed').removeClass('mobile');
      } else {
        $('.cookies.closed').addClass('mobile');
      }
    });
  }
}
// Module end
