// Importazione Moduli
import inizializzaEmail from '../email.js';

// Inizio Modulo
/**
 * Funzione gestione inizializzazione Email Footer
 * Setter
 * @export
 */
export default function inizializzaEmailSummary() {
  inizializzaEmail($('.summary__container__articolo__corpo__email'),
  'summary__container__articolo__corpo__email summary__container__articolo__corpo__link',
  '1',
  'Scriveteci al nostro indirizzo email di contatto');
}
// Fine Modulo