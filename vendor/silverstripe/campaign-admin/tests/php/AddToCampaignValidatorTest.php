<?php

namespace SilverStripe\CampaignAdmin\Tests;

use SilverStripe\CampaignAdmin\AddToCampaignHandler;
use SilverStripe\CampaignAdmin\AddToCampaignValidator;
use SilverStripe\Dev\SapphireTest;
use SilverStripe\Versioned\ChangeSet;

class AddToCampaignValidatorTest extends SapphireTest
{
    protected static $extra_dataobjects = [
        AddToCampaignValidatorTest\TestObject::class,
    ];

    protected static $fixture_file = 'AddToCampaignValidatorTest.yml';

    /**
     * @var AddToCampaignValidator
     */
    protected $validator = null;

    protected function setUp()
    {
        parent::setUp();
        $this->logInWithPermission('ADMIN');
        $obj = $this->objFromFixture(AddToCampaignValidatorTest\TestObject::class, 'object1');
        $form = AddToCampaignHandler::create()->Form($obj);
        $this->validator = $form->getValidator();
    }

    public function testValidationSuccess()
    {
        $campaign1 = $this->objFromFixture(ChangeSet::class, 'changeset1');
        $this->assertInstanceOf(AddToCampaignValidator::class, $this->validator);

        // Valid states
        $this->assertTrue($this->validator->php([
            'AddNewSelect' => null,
            'Campaign' => $campaign1->ID
        ]));
        $this->assertTrue($this->validator->php([
            'AddNewSelect' => true,
            'Campaign' => null,
            'NewTitle' => 'New Campaign',
        ]));
        $this->assertTrue($this->validator->php([
            'AddNewSelect' => true,
            'Campaign' => $campaign1->ID,
            'NewTitle' => 'New Campaign',
        ]));
    }

    public function testValidationFailed()
    {
        $campaign1 = $this->objFromFixture(ChangeSet::class, 'changeset1');
        $this->assertInstanceOf(AddToCampaignValidator::class, $this->validator);

        // Invalid states
        $this->validator->removeValidation()->setEnabled(true);
        $this->assertFalse($this->validator->php([
            'AddNewSelect' => null,
            'Campaign' => 0
        ]));
        $this->assertEquals(
            [[
                'message' => 'Please select a campaign',
                'fieldName' => 'Campaign',
                'messageType' => 'error',
                'messageCast' => 'text',
            ]],
            $this->validator->getResult()->getMessages()
        );
        $this->validator->removeValidation()->setEnabled(true);
        $this->assertFalse($this->validator->php([
            'AddNewSelect' => 1,
            'Campaign' => 0,
            'NewTitle' => null
        ]));
        $this->assertEquals(
            [[
                'message' => 'Please enter a title for the new campaign',
                'fieldName' => 'NewTitle',
                'messageType' => 'error',
                'messageCast' => 'text',
            ]],
            $this->validator->getResult()->getMessages()
        );
        $this->validator->removeValidation()->setEnabled(true);
        $this->assertFalse($this->validator->php([
            'AddNewSelect' => 1,
            'Campaign' => $campaign1->ID, // Ignored because AddNewSelect is checked
            'NewTitle' => null
        ]));
        $this->assertEquals(
            [[
                'message' => 'Please enter a title for the new campaign',
                'fieldName' => 'NewTitle',
                'messageType' => 'error',
                'messageCast' => 'text',
            ]],
            $this->validator->getResult()->getMessages()
        );
    }
}
