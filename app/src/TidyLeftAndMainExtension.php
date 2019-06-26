<?php

use SilverStripe\Admin\CMSMenu;
use SilverStripe\Admin\LeftAndMainExtension;

/**
 * Classe menu amminisrazione personalizzato
*/
class TidyLeftAndMainExtension extends LeftAndMainExtension
{
    /**
    * Metodo Inizializzazione
    */
    function init()
    {
        parent::init();
        CMSMenu::remove_menu_item('SilverStripe-CampaignAdmin-CampaignAdmin');
        CMSMenu::remove_menu_item('SilverStripe-Reports-ReportAdmin');
        CMSMenu::remove_menu_item('SilverStripe-VersionedAdmin-ArchiveAdmin');
        CMSMenu::remove_menu_item('Help');
    }
}
