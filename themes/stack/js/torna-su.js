// Inizio Modulo
/**
 * Funzione gestione UX Torna Su
 * Setter
 * @export
 */
export default function inizializzaTornaSu() {
  $(window).on('scroll', function() {
    if ($(this).scrollTop() > 0) {
      $('.torna-su').removeClass('occulta');
    } else {
      $('.torna-su').addClass('occulta');
    }
    if (($(this).scrollTop() + $(this).height()) ==
      $(document).height()) {
      $('.torna-su').addClass('solleva');
    } else {
      $('.torna-su').removeClass('solleva');
    }
  });
  $('.torna-su').on('click tap', () => {
    $('html, body').animate({
      scrollTop: 0,
    }, 'fast');
  });
}
// Fine Modulo
