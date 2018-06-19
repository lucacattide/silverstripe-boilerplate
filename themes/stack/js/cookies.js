// Inizio Modulo
/**
 * Metodo gestione impostazione cookies
 * Setter
 * @param {string} n Nome cookie
 * @param {string} v Valore cookie
 */
function ck(n, v) {
	let s = new Date();

	s.setDate(s.getDate() + 30);
	document.cookie = n +'='+ escape(v) +'; expires='+ s.toGMTString() +
	'; path=/;';
}

/**
 * Metodo gestione controllo cookies
 * setter
 * @param {string} n Nome cookie 
 * @return {string} Valore cookie
 */
function l(n) {
	if (document.cookie.length > 0) {
		let i = document.cookie.indexOf(n +'=');

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
 * Metodo gestione eliminazione cookies
 * Setter
 * @param {string} n Nome cookie
 */
function dk(n) {
	document.cookie = n +'=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/;';
}

/**
 * Metodo gestione controllo accettazione cookies
 * Getter
 * @param {string} n Nome cookie
 */
function ak(n) {
	let c = l(n);

	// Controllo Cookie
	// Se non è stata accettata la policy
	if (c === '' && n === 'cookie_law_stack') {
	  $('.cookies__form__etichetta__campo')
	  .each(function() {
		$(this).attr('checked', 'checked');
	  });
	  $('.cookies').fadeIn();
	} else if (c === '') {
	  // Altrimenti se non esiste
	  switch(n) {
		case 'google_stack':
		  $('#google-cookie').removeAttr('checked');

		  break;
		default:
	  }
	} else if (c !== '') {
	  // Altrimenti se esiste
	  switch(n) {
		case 'cookie_law_stack':
      $('.cookies__cta').removeClass('aperto');
      $('.cookies__corpo, .cookies__form, .cookies__cta--accetta, .cookies__corpo__chiudi--avviso')
      .addClass('nascondi');
      $('.cookies, .cookies__container')
      .addClass('chiuso');
      $('.cookies__container, .cookies__cta--impostazioni')
      .removeClass('aperto');
      $('.cookies').addClass('mobile');
      $('.cookies__cta--impostazioni')
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
 * Metodo gestione cookies
 * Setter
 * @export
 */
export default function gestisciCookies() {
  document.cookie = 'test_cookie';

	let t = (document.cookie.indexOf('test_cookie') != -1) ? true : false;
	let n = ['cookie_law_stack', 'google_stack'];

	if (t) {
		for (let i in n) {
			ak(n[i]);
		}

		// Impostazioni
		$('.cookies__cta--impostazioni')
		.on('click tap', function(e) {
		  e.preventDefault();

      $('.cookies, .cookies__container')
      .removeClass('chiuso');
      $('.cookies, .cookies__container, .cookies__cta, .cookies__cta--impostazioni')
      .addClass('aperto');
      $('.cookies__corpo, .cookies__form, .cookies__cta--accetta, .cookies__cta--opt-out, .cookies__cta--salva, .cookies__corpo__chiudi--avviso')
      .removeClass('nascondi');
      $('.cookies--avviso').removeClass('animated slideInDown')
      .addClass('nascondi');
      $('.cookies').removeClass('mobile');

      if ($('html').attr('lang') == 'it-IT') {
        $('.cookies__cta--impostazioni')
        .html('Impostazioni');
      } else {
        $('.cookies__cta--impostazioni')
        .html('Settings');
      }
      
      $('.cookies--impostazioni').removeClass('nascondi animated slideOutUp')
      .addClass('animated slideInDown');
		});
		// Accettazione
		$('.cookies__cta--accetta')
		.on('click tap', function(e) {
		  e.preventDefault();

		  // Cookie Policy
		  if (l('cookie_law_stack') === '') {
			ck('cookie_law_stack', 'accettata');

			// Invio notifica
			$.post($(this).attr('href') +'notificacookies');
		  }

		  // Cookies terze parti
		  $('.cookies__form__etichetta__campo')
		  .each(function() {
			if (l($(this).val()) === '') {
			  ck($(this).val(), 'accettata');
			  ak($(this).val());
			}
		  });
		});
		// Salvataggio
		$('.cookies__cta--salva')
		.on('click tap', (e) => {
		  e.preventDefault();

		  // Aggiornamento Cookies
		  $('.cookies__form__etichetta__campo')
		  .each((i, elemento) => {
			if ($(elemento).attr('checked')) {
			  ck($(elemento).val(), 'accettata');
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

		  // Disattivazione Cookies
		  $('.cookies__form__etichetta__campo')
		  .each((i, elemento) => {
			$(elemento).removeAttr('checked');

			dk($(elemento).val());
			ak($(elemento).val());
		  });
		});
		// Chiusura
		$('.cookies__corpo__chiudi--avviso').on('click tap', () => {
			$('.cookies').addClass('animated fadeOut');

			setTimeout(() => {
				$('.cookies').addClass('nascondi');
			}, 500);
    });
    $('.cookies__corpo__chiudi--impostazioni')
		.on('click tap', () => {
		  $('.cookies--impostazioni').removeClass('animated slideInDown')
      .addClass('nascondi');
      $('.cookies').removeClass('aperto');
		  $('.cookies__container').addClass('aperto');
		  $('.cookies--avviso').removeClass('nascondi animated slideOutUp')
      .addClass('animated slideInDown');
      $('.cookies__cta').addClass('aperto');
		});
		// UX
		$('.cookies__form__etichetta__campo')
		.on('change', function() {
		  if ($(this).attr('checked')) {
			$(this).removeAttr('checked');
		  } else {
			$(this).attr('checked', 'checked');
		  }
    });
		$('.cookies__cta--accetta, .cookies__cta--salva')
		.on('click tap', () => {
      $('.cookies__cta, .cookies__container').removeClass('aperto');
		  $('.cookies__corpo, .cookies__form, .cookies__cta--accetta, .cookies__cta--opt-out, .cookies__cta--salva, .cookies__corpo__chiudi--avviso')
      .addClass('nascondi');
      $('.cookies--avviso').removeClass('nascondi');
		  $('.cookies, .cookies__container')
      .addClass('chiuso');
      $('.cookies').addClass('mobile');
		  $('.cookies__cta--impostazioni')
		  .html('Cookies');
    });
		$(window).on('scroll', function() {
		  if($(this).scrollTop() + $(this).outerHeight() >=
        $('.footer--bottom').offset().top) {
        $('.cookies.chiuso').removeClass('mobile');
		  } else {
			  $('.cookies.chiuso').addClass('mobile');
		  }
		});
	}
}
// Fine Modulo