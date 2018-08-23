<?php

namespace SilverStripe\CampaignAdmin;

use SilverStripe\Forms\FormAction;

/**
 * A form action to return from geCMSActions or otherwise include in a CMS Edit Form that
 * has the right action name and CSS classes to trigger the AddToCampaignHandler.
 *
 * See SiteTree.php and CMSMain.php for an example of it's use
 */
class AddToCampaignHandler_FormAction extends FormAction
{
    public function __construct()
    {
        parent::__construct('addtocampaign', _t(__CLASS__.'.ADDTOCAMPAIGN', 'Add to Campaign'));
        $this->setUseButtonTag(false);
        $this->addExtraClass('add-to-campaign-action');
        $this->addExtraClass('btn');
        $this->addExtraClass('btn-primary');
    }
}
