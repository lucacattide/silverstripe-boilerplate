'use strict';

// Importazione SASS
import '../sass/index.scss';
import '../sass/privacy.scss';
// Importazione Librerie
import $ from 'jquery';
import Modernizr from 'modernizr';
import inizializzaEmailSummary from './privacy/summary.js';
/**
 * if (!Modernizr.pointerevents && !Modernizr.touchevents) {
 *   // ...
 * }
 */

// Main
$(document).ready(() => {
  inizializzaEmailSummary();
});