<?php

namespace SilverStripe\CampaignAdmin\Tests\AddToCampaignValidatorTest;

use SilverStripe\Dev\TestOnly;
use SilverStripe\ORM\DataObject;
use SilverStripe\Versioned\Versioned;

class TestObject extends DataObject implements TestOnly
{
    private static $table_name = 'AddToCampaignValidatorTest_TestObject';

    private static $extensions = [
        Versioned::class,
    ];

    private static $db = [
        'Title' => 'Varchar',
    ];
}
