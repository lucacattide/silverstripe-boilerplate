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
            CMSMenu::remove_menu_item('Help');
        }
    }
