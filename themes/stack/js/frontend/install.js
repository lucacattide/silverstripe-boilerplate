'use strict';

// Local installation
let deferredInstallPrompt = null;
// TODO: Set DOM node ID
let installButton = document.getElementById('');

installButton.addEventListener('click', installPWA);

window.addEventListener('beforeinstallprompt', saveBeforeInstallPromptEvent);

// TODO: Remove in production
window.addEventListener('appinstalled', logAppInstalled);

/**
 * Event handler for beforeinstallprompt event.
 * Saves the event & shows install button.
 *
 * @param {Event} evt
 */
function saveBeforeInstallPromptEvent(evt) {
  deferredInstallPrompt = evt;

  installButton.removeAttribute('hidden');
}

/**
 * Event handler for butInstall - Does the PWA installation.
 *
 * @param {Event} evt
 */
function installPWA(evt) {
  deferredInstallPrompt.prompt();
  evt.srcElement.setAttribute('hidden', true);
  deferredInstallPrompt.userChoice
      .then(function(choice) {
      // TODO: Remove in production
        if (choice.outcome === 'accepted') {
          console.log('User accepted the A2HS prompt', choice);
        } else {
          console.log('User dismissed the A2HS prompt', choice);
        }

        deferredInstallPrompt = null;
      });
}

/**
 * Event handler for appinstalled event.
 * Log the installation to analytics or save the event somehow.
 *
 * @param {Event} evt
 */
function logAppInstalled(evt) {
  console.log('Weather App was installed.', evt);
}
