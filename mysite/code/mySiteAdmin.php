<?php
    use SilverStripe\Admin\CMSMenu;
    use SilverStripe\Admin\LeftAndMainExtension;
    use SilverStripe\View\Requirements;

    /**
     * Classe menu amminisrazione personalizzato
    */
    class mySiteAdmin extends LeftAndMainExtension
    {
        /**
        * Metodo Inizializzazione
        */
        function init()
        {
            parent::init();
            Requirements::css('themes/ss-ecommerce/css/template-cms.css');
            CMSMenu::remove_menu_item('Help');
        }
    }
