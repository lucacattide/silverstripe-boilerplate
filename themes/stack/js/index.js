'use strict';

// Importazione SASS
import '../sass/index.scss';
// Importazione Librerie
import $ from 'jquery';
import Modernizr from 'modernizr';
import inizializzaTornaSu from './torna-su.js';
/**
 * if (!Modernizr.pointerevents && !Modernizr.touchevents) {
 *   // ...
 * }
 */

// Main
$(document).ready(() => {
  inizializzaTornaSu();
})