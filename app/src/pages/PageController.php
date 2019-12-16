<?php

use SilverStripe\CMS\Controllers\ContentController;
use SilverStripe\Control\HTTP;
use SilverStripe\Control\HTTPRequest;
use SilverStripe\Control\HTTPResponse;
use SilverStripe\Control\Director;
use SilverStripe\Security\Security;
use SilverStripe\Control\Email\Email;
use Silverstripe\SiteConfig\SiteConfig;

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
        'notifycookies'
    ];

    protected function init()
    {
        parent::init();
        // You can include any CSS or JS required by your project here.
        // See: https://docs.silverstripe.org/en/developer_guides/templates/requirements/

        if (!Director::isDev()) {
            // Security
            // Clickjacking
            $this->getResponse()->addHeader('X-Frame-Options', 'SAMEORIGIN');
            // Cache
            // Sensible data caching deactivation
            $this->response->addHeader('Cache-Control', 'max-age=0, must-revalidate, no-transform');
            // HTTP/1.1
            $this->response->addHeader('Pragma', 'no-cache');

            HTTP::set_cache_age(0);
            HTTP::add_cache_headers($this->response);

            // HSTS Header - Force TSL on document content
            $this->response->addHeader('Strict-Transport-Security', 'max-age=86400; includeSubDomains');
        }
    }

    /**
	* Cookies notification method
	* @param  HTTPRequest $request HTTP Request
	* @return HTTPResponse HTTP Response
	*/
	public function notifycookies(HTTPRequest $request) {
        if (!$request->isAjax()) {
            return $this->httpError(400);
        } elseif (!$request->isPOST()) {
            return $this->httpError(405);
        }

        $member = Security::getCurrentUser();

        if ($member) {
            $user_data = $member->Name .' ('. $member->Email .')';
        } else {
            $user_data = $request->getIP();
        }

        Email::create()
            ->setTo(SiteConfig::current_site_config()->NotificationTo)
            ->setSubject('Cookie Policy - Accettazione')
            ->setBody('Accettazione Cookie Policy:<br /><br />' .
                      'Sito Web: '. Director::host() . '<br />' .
                      'Data: ' . date('d/m/Y \- \h\. H:i:s') . '<br />' .
                      'Utente: ' . $user_data . '<br />')
            ->send();

        return new HTTPResponse;
	}
}
