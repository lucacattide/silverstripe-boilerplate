<?php

namespace SilverStripe\CampaignAdmin;

use SilverStripe\Core\Extension;
use SilverStripe\View\Requirements;

class CampaignAdminExtension extends Extension
{
    public function init()
    {
        Requirements::add_i18n_javascript('silverstripe/campaign-admin: client/lang', false, true);
        Requirements::javascript('silverstripe/campaign-admin: client/dist/js/bundle.js');
        Requirements::css('silverstripe/campaign-admin: client/dist/styles/bundle.css');
    }
}
