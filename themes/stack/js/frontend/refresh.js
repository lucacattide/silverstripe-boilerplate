'use strict';

// Module Start
// Service Worker Update
// JS imports
import {
  Workbox
} from 'https://storage.googleapis.com/workbox-cdn/releases/4.1.0/workbox-window.prod.mjs';

// Service Worker Check
if ('serviceWorker' in navigator) {
  var wb = new Workbox('/service-worker.js');

  wb.addEventListener('waiting', function() {
    var prompt = createUIPrompt({
      onAccept: async function() {
        wb.addEventListener('controlling', function() {
          window.location.reload();
        });

        wb.messageSW({
          type: 'SKIP_WAITING'
        });
      }
    })
  });

  wb.register();
}

/**
 * @description Refresh UI prompt getter
 * @author Luca Cattide
 * @date 2019-10-28
 * @param {object} options Prompt options
 */
function createUIPrompt(options) {
  if (confirm('New version available. Do you want to update?')) {
    options.onAccept();
  }
}
// Module End
