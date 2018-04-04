<?php
    use SilverStripe\i18n\i18n;
    use SilverStripe\Admin\LeftAndMain;
    use SilverStripe\Forms\HTMLEditor\HtmlEditorConfig;

    // Localizzazione
    i18n::set_locale('it_IT');
    // Admin
    LeftAndMain::add_extension('mySiteAdmin');
    // Forms - TinyMCE
    TinyMCEConfig::get('cms')->setOption('forced_root_block', '');
    TinyMCEConfig::get('cms')->setOption('selector', 'textarea');
    TinyMCEConfig::get('cms')->setButtonsForLine(1, 'bold', 'italic', 'underline', 'link', 'unlink', 'code');
    TinyMCEConfig::get('cms')->setButtonsForLine(2, 'cut', 'copy', 'paste', 'undo', 'redo');
    TinyMCEConfig::get('cms')->removeButtons('advhr', 'media', 'emotions', 'fullpage', 'fullscreen', 'iespell', 'nonbreaking', 'pagebreak', 'preview', 'print', 'spellchecker', 'visualchars', 'advlink', 'advimage', 'searchreplace', 'insertdatetime', 'table', 'directionality', 'layer', 'save', 'style', 'xhtmlxtras', 'template');
