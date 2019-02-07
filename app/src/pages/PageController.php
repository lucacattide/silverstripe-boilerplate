<?php
// Definizione Namespace
use SilverStripe\CMS\Controllers\ContentController;
use SilverStripe\Control\HTTP;
use SilverStripe\Control\HTTPRequest;
use SilverStripe\Control\HTTPResponse;
use SilverStripe\Control\Director;
use SilverStripe\Security\Security;
use SilverStripe\Control\Email\Email;
use SilverStripe\ErrorPage\ErrorPage;

class PageController extends ContentController
{
    /**
     * An array of actions that can be accessed via a request. Each array element should be an action name, and the
     * permissions or conditions required to allow the user to access it.
     *
     * <code>
     * [
     *     'action', // anyone can access this action
     *     'action' => true, // same as above
     *     'action' => 'ADMIN', // you must have ADMIN permissions to access this action
     *     'action' => '->checkAction' // you can only access this action if $this->checkAction() returns true
     * ];
     * </code>
     *
     * @var array
     */
    private static $allowed_actions = [
        'notificacookies'
    ];

    /**
     * Metodo gestione gruppo permessi Cliente
     * Setter
     * @return array
     */
    protected function init()
    {
        parent::init();
        // You can include any CSS or JS required by your project here.
        // See: https://docs.silverstripe.org/en/developer_guides/templates/requirements/

        if (!Director::isDev()) {
            // Sicurezza
            // Clickjacking
            $this->getResponse()->addHeader('X-Frame-Options', 'SAMEORIGIN');
            // Cache
            // Disattiva caching dati sensibili
            $this->response->addHeader('Cache-Control', 'max-age=0, must-revalidate, no-transform');
            // HTTP/1.1
            $this->response->addHeader('Pragma', 'no-cache');

            HTTP::set_cache_age(0);
            HTTP::add_cache_headers($this->response);

            // HSTS Header - Forza TSL sul document content
            $this->response->addHeader('Strict-Transport-Security', 'max-age=86400; includeSubDomains');
        }
    }

    /**
	* Funzione gestione notifica accettazione cookies
	* @param  HTTPRequest $request Richiesta HTTP
	* @return HTTPResponse Risposta HTTP
	*/
	public function notificacookies(HTTPRequest $request) {
        $oggetto = 'Cookie Policy - Accettazione';
        $utente = Security::getCurrentUser();

        if (!$utente) {
            $utente = $request->getIP();
        } else {
            $utente = $utente->Name . ' ('. $utente->Email .')';
        }
		if (!$request->isAjax()) {
			return ErrorPage::response_for(404);
		} else if (!$request->isPOST()) {
			return $this->httpError(400, 'Metodo POST richiesto');
		} else {
            $emailCorpo = 'Accettazione Cookie Policy:<br /><br />';
            $emailCorpo .= 'Sito Web: '. Director::absoluteURL($request->getURL) .'<br />';
            $emailCorpo .= 'Data: '. @date('d/m/Y \- \h\. H:i:s') .'<br />';
            $emailCorpo .= 'Utente: '. $utente .'<br />';
            $mail = Email::create();

            // TODO: Sostituire nel caso con E-Mail ad hoc
            $mail->setFrom('l.cattide@email.it');
            $mail->setTo('l.cattide@email.it');
            $mail->setSubject($oggetto);
            $mail->setBody($emailCorpo);
            $mail->send();

            return new HTTPResponse;
		}
	}
}
