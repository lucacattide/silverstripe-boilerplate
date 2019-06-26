<?php

use SilverStripe\Forms\EmailField;
use SilverStripe\Forms\FieldList;
use SilverStripe\ORM\DataExtension;

class SiteConfigExtension extends DataExtension
{
    private static $db = [
        'NotificationTo' => 'Varchar(254)',
    ];

    public function updateCMSFields(FieldList $fields)
    {
        $field = EmailField::create(
            'NotificationTo',
            _t('SiteConfig.db_NotificationTo', 'Notification to')
        );

        $fields->addFieldToTab('Root.Main', $field);
    }
}
