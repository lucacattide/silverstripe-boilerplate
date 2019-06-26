'use strict';

// Module Start
// Main
// SASS imports
import '../../sass/index.scss';
// JS imports
import $ from 'jquery';
import setCookies from './cookies.js';
import setBackToTop from './back-to-top.js';

// Service Worker
if ('serviceWorker' in navigator) {
  $(window).on('load', () => {
    // TODO: In production must be set to /js/dist/service-worker-prod.js
    navigator.serviceWorker.register('/js/service-worker-dev.js')
    // TODO: Remove in production
        .then((registration) => {
          console.log(`Service Worker registered! Scope: ${registration.scope}`);
        })
        .catch((err) => {
          console.log(`Service Worker registration failed: ${err}`);
        });
  });
}

// Main
$(document).ready(() => {
  setCookies();
  setBackToTop();
});
// Module End
