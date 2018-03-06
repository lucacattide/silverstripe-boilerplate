<?php

namespace SilverStripe\GraphQL\Tests\Fake;

use SilverStripe\Control\HTTPRequest;
use SilverStripe\Dev\TestOnly;
use SilverStripe\GraphQL\Auth\AuthenticatorInterface;
use SilverStripe\ORM\ValidationException;

class BrutalAuthenticatorFake implements AuthenticatorInterface, TestOnly
{
    public function authenticate(HTTPRequest $request)
    {
        throw new ValidationException('Never!');
    }

    public function isApplicable(HTTPRequest $request)
    {
        return true;
    }
}
