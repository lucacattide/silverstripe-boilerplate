'use strict';

// Local installation
let deferredInstallPrompt = null;
// TODO: Set DOM node ID
let installButton = document.getElementById('');

installButton.addEventListener('click', installPWA);
window.addEventListener('beforeinstallprompt', saveBeforeInstallPromptEvent);
window.addEventListener('appinstalled', logAppInstalled);

/**
 * @description  * Event handler for beforeinstallprompt event.
 * Saves the event & shows install button.
 * @author Luca Cattide
 * @date 2019-12-16
 * @param {Event} e Event
 */
function saveBeforeInstallPromptEvent(e) {
  deferredInstallPrompt = e;

  installButton.removeAttribute('hidden');
}

/**
 * @description Event handler for butInstall - Does the PWA installation.
 * @author Luca Cattide
 * @date 2019-12-16
 * @param {Event} e Event
 */
function installPWA(e) {
  e.srcElement.setAttribute('hidden', true);
  deferredInstallPrompt.prompt();
  deferredInstallPrompt.userChoice.then(function(choice) {
    if (choice.outcome === 'accepted') {
      console.log('User accepted the A2HS prompt', choice);
    } else {
      console.log('User dismissed the A2HS prompt', choice);
    }

    deferredInstallPrompt = null;
  });
}

/**
 * @description Event handler for appinstalled event.
 * Log the installation to analytics or save the event somehow.
 * @author Luca Cattide
 * @date 2019-12-16
 * @param {Event} e Event
 */
function logAppInstalled(e) {
  // TODO: Some implementation
}
