<?php
    use SilverStripe\i18n\i18n;
    use SilverStripe\Admin\LeftAndMain;
    use SilverStripe\Forms\HTMLEditor\HtmlEditorField;
    use SilverStripe\Forms\HTMLEditor\TinyMCEConfig;
    use SilverStripe\Control\Director;
    use App\Web\mySiteAdmin;


    // Localizzazione
    i18n::set_locale('it_IT');
    // Admin
    LeftAndMain::add_extension(mySiteAdmin::class);
    // Forms - TinyMCE
    TinyMCEConfig::get('cms')->setButtonsForLine(1, 'bold', 'italic', 'underline', 'link', 'unlink', 'code');
    TinyMCEConfig::get('cms')->setButtonsForLine(2, 'cut', 'copy', 'paste', 'undo', 'redo');
    TinyMCEConfig::get('cms')->removeButtons('advhr', 'media', 'emotions', 'fullpage', 'fullscreen', 'iespell', 'nonbreaking', 'pagebreak', 'preview', 'print', 'spellchecker', 'visualchars', 'advlink', 'advimage', 'searchreplace', 'insertdatetime', 'table', 'directionality', 'layer', 'save', 'style', 'xhtmlxtras', 'template');
    // Sicurezza
    // XSS
    HtmlEditorField::config()->sanitise_server_side = true;

    // SSL
    if (!Director::isDev()) {
        Director::forceSSL();
    }
