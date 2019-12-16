'use strict';

// Module Start
// Service Worker Update
// JS imports
import {
  Workbox
} from 'https://storage.googleapis.com/workbox-cdn/releases/4.1.0/workbox-window.prod.mjs';

// Service Worker Check
if ('serviceWorker' in navigator) {
  var wb = new Workbox('/js/frontend/service-worker-dev.js');

  $(wb).on('waiting', function() {
    var prompt = createUIPrompt({
      //TODO: Popup accept/reject implementation
      onAccept: async function() {
        $(wb).on('controlling', function() {
          window.location.reload();
        });

        wb.messageSW({
          type: 'SKIP_WAITING'
        });
      },
      onReject: function() {
        prompt.dismiss();
      }
    })
  });

  wb.register();
}
// Module End
