<?php

namespace SilverStripe\CampaignAdmin\Tests\CampaignAdminTest;

use SilverStripe\ORM\UnexpectedDataException;
use SilverStripe\Versioned\ChangeSet;
use SilverStripe\Dev\TestOnly;

class InvalidChangeSet extends ChangeSet implements TestOnly
{
    public function sync()
    {
        throw new UnexpectedDataException("bad data");
    }
}
