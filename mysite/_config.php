<?php
    use SilverStripe\i18n\i18n;
    use SilverStripe\Admin\LeftAndMain;
    use SilverStripe\Forms\HTMLEditor\HtmlEditorConfig;

    // Localizzazione
    i18n::set_locale('it_IT');
    // Admin
    LeftAndMain::add_extension('mySiteAdmin');
    // Forms - TinyMCE
    HtmlEditorConfig::get('cms')->setOption('theme_advanced_styles', 'highlight=highlight;no-border=no-border,break=break');
    HtmlEditorConfig::get('cms')->setOption('force_br_newlines', 'true');
    HtmlEditorConfig::get('cms')->setOption('force_p_newlines', 'false');
    HtmlEditorConfig::get('cms')->addButtonsToLine(1, 'bold', 'italic', 'underline', 'link', 'unlink', 'code');
    HtmlEditorConfig::get('cms')->addButtonsToLine(2, 'cut', 'copy', 'paste', 'undo', 'redo');
    HtmlEditorConfig::get('cms')->disablePlugins('advhr', 'media', 'emotions', 'fullpage', 'fullscreen', 'iespell', 'nonbreaking', 'pagebreak', 'preview', 'print', 'spellchecker', 'visualchars', 'advlink', 'advimage', 'searchreplace', 'insertdatetime', 'table', 'directionality', 'layer', 'save', 'style', 'xhtmlxtras', 'template');
