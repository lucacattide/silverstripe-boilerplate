<?php

use SilverStripe\Admin\LeftAndMain;
use SilverStripe\Forms\HTMLEditor\HtmlEditorField;
use SilverStripe\Forms\HTMLEditor\TinyMCEConfig;
use SilverStripe\Control\Director;

// Admin
LeftAndMain::add_extension(TidyLeftAndMainExtension::class);
// Forms - TinyMCE
TinyMCEConfig::get('cms')
    ->setButtonsForLine(1, 'bold', 'italic', 'underline', 'link', 'unlink', 'code')
    ->setButtonsForLine(2, 'cut', 'copy', 'paste', 'undo', 'redo')
    ->removeButtons([
        'advhr', 'media', 'emotions', 'fullpage', 'fullscreen', 'iespell',
        'nonbreaking', 'pagebreak', 'preview', 'print', 'spellchecker',
        'visualchars', 'advlink', 'advimage', 'searchreplace', 'insertdatetime',
        'table', 'directionality', 'layer', 'save', 'style', 'xhtmlxtras', 'template'
    ]);
// Security
// XSS
HtmlEditorField::config()->sanitise_server_side = true;

// SSL
if (!Director::isDev()) {
    Director::forceSSL();
}
