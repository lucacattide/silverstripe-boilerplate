<?php

namespace SilverStripe\CampaignAdmin\Tests\Behat\Context;

use Behat\Mink\Element\DocumentElement;
use Behat\Mink\Element\NodeElement;
use SilverStripe\BehatExtension\Context\FixtureContext as BaseFixtureContext;
use SilverStripe\BehatExtension\Utility\StepHelper;
use SilverStripe\MinkFacebookWebDriver\FacebookWebDriver;
use SilverStripe\Versioned\ChangeSet;

/**
 * Context used to create fixtures in the SilverStripe ORM.
 */
class FixtureContext extends BaseFixtureContext
{
    use StepHelper;

    /**
     * @Then /^I should see the campaign "([^"]+)"$/
     * @param string $name
     */
    public function iShouldSeeTheCampaign($name)
    {
        $item = $this->getCampaign($name);

        assertNotNull($item, "Could not find campaign \"$name\" in the list");
    }

    /**
     * @Then /^I should not see the campaign "([^"]+)"$/
     * @param string $name
     */
    public function iShouldNotSeeTheCampaign($name)
    {
        $item = $this->getCampaign($name);

        assertNull($item, "Found campaign \"$name\" in the list");
    }

    /**
     * @Then /^I should see "([^"]+)" in column (\d+) of the "([^"]+)" campaign$/
     * @param string $text
     * @param string $column
     * @param string $name
     */
    public function iShouldSeeInTheCampaignColumn($text, $column, $name)
    {
        $campaignRow = $this->getCampaign($name);
        assertNotNull($campaignRow, sprintf('Could not find campaign "%s"', $name));

        $cell = $campaignRow->find('xpath', "/td[{$column}][contains(text(), '{$text}')]");

        assertNotNull($cell, sprintf('Could not find "%s" in column %d of "%s"', $text, $column, $name));
    }

    /**
     * @Given /^I view the campaign "([^"]*)"$/
     * @param $name
     */
    public function iViewTheCampaign($name)
    {
        $item = $this->getCampaign($name);
        assertNotNull($item, sprintf('Campaign %s not found', $name));

        $item->find('css', 'td')->click();
    }

    /**
     * @Given /^I edit the campaign "([^"]*)"$/
     * @param $name
     */
    public function iEditTheCampaign($name)
    {
        $item = $this->getCampaign($name);
        assertNotNull($item, sprintf('Campaign %s not found', $name));

        $button = $item->find('css', '.font-icon-cog');
        assertNotNull($button, sprintf('Campaign %s has no edit button', $name));
        $button->click();
    }

    /**
     * @Given /^I delete the campaign "([^"]*)"$/
     * @param $name
     */
    public function iDeleteTheCampaign($name)
    {
        $item = $this->getCampaign($name);
        assertNotNull($item, sprintf('Campaign %s not found', $name));

        $button = $item->find('css', '.font-icon-cancel');
        assertNotNull($button, sprintf('Campaign %s has no delete button', $name));
        $button->click();

        /** @var FacebookWebDriver $driver */
        $driver = $this->getMainContext()->getSession()->getDriver();
        $webDriver = $driver->getWebDriver();
        $webDriver->switchTo()->alert()->accept();
    }

    /**
     * @Then /^I should see the "([^"]*)" form$/
     * @param string $id HTML ID of form
     */
    public function iShouldSeeTheForm($id)
    {
        /** @var DocumentElement $page */
        $page = $this->getMainContext()->getSession()->getPage();
        $form = $page->find('css', "form#{$id}");
        assertNotNull($form, "form with id $id could not be found");
        assertTrue($form->isVisible(), "form with id $id is not visible");
    }

    /**
     * Checks that the message box contains specified text.
     *
     * @Then /^I should see "(?P<text>(?:[^"]|\\")*)" in the message box$/
     * @param string $text
     */
    public function assertMessageBoxContainsText($text)
    {
        /** @var FeatureContext $mainContext */
        $mainContext = $this->getMainContext();
        $mainContext
            ->assertSession()
            ->elementTextContains('css', '.message-box', str_replace('\\"', '"', $text));
    }

    /**
     * @Then I should see a modal titled :title
     * @param string $title
     */
    public function iShouldSeeAModalTitled($title)
    {
        $page = $this->getMainContext()->getSession()->getPage();
        $modalTitle = $page->find('css', '[role=dialog] .modal-header > .modal-title');
        assertNotNull($modalTitle, 'No modal on the page');
        assertTrue($modalTitle->getText() == $title);
    }

    /**
     * @Then /^I close the modal$/
     */
    public function iCloseTheModal()
    {
        /** @var DocumentElement $page */
        $page = $this->getMainContext()->getSession()->getPage();
        $button = $page->find('css', '.modal-header .close');
        assertNotNull($button, 'Close button not found');

        $button->click();
    }

    /**
     * @Given /^I click the "([^"]+)" gallery item$/
     * @param $name
     */
    public function iClickTheGalleryItem($name)
    {
        /** @var DocumentElement $page */
        $page = $this->getMainContext()->getSession()->getPage();
        // Find by cell
        $cell = $page->find(
            'xpath',
            "//div[contains(@class, 'gallery-item')]//div[contains(text(), '{$name}')]"
        );

        assertNotNull($cell, sprintf('Gallery item "%s" could not be found', $name));

        $cell->click();
    }

    /**
     * @Given /^I should( not? |\s*)see the "([^"]+)" campaign item$/
     * @param $negate boolean
     * @param $name string
     */
    public function iSeeTheCampaignItem($negate, $name)
    {
        $item = $this->getCampaignItem($name);
        $shouldSee = !trim($negate);

        if ($shouldSee) {
            assertNotNull($item, sprintf('Item "%s" could not be found', $name));
            assertTrue($item->isVisible(), sprintf('Item "%s" is not visible', $name));
        } elseif ($item) {
            assertFalse($item->isVisible(), sprintf('Item "%s" is visible', $name));
        } else {
            assertNull($item, sprintf('Item "%s" exists', $name));
        }
    }

    /**
     * @Given /^I select the "([^"]+)" campaign item$/
     * @param $name
     */
    public function iSelectTheCampaignItem($name)
    {
        $item = $this->getCampaignItem($name);
        assertNotNull($item, sprintf('Item "%s" could not be found', $name));
        $item->click();
    }

    /**
     * @Given /^a campaign "([^"]+)" with changes (".*)$/
     * @param $id
     * @param $data
     */
    public function stepCreateCampaignWithItems($id, $data)
    {
        $class = $this->convertTypeToClass(ChangeSet::class);
        /* @var ChangeSet $campaign */
        $campaign = $this->getFixtureFactory()->get($class, $id);
        if (!$campaign) {
            $campaign = $this->getFixtureFactory()->createObject($class, $id);
        }

        preg_match_all(
            '/"(?<content_class>[^"]+)"\s*=\s*"(?<identifier>[^"]+)"/',
            $data,
            $matches
        );
        $itemMap = array_combine($matches['content_class'], $matches['identifier']);
        foreach ($itemMap as $contentClass => $identifier) {
            $class = $this->convertTypeToClass($contentClass);
            $record = $this->getFixtureFactory()->get($class, $identifier);
            if (!$record) {
                $record = $this->getFixtureFactory()->createObject($class, $identifier);
            }
            $campaign->addObject($record);
        }
    }

    /**
     * @When /^I click the "([^"]+)" element$/
     * @param $selector
     */
    public function iClickTheElement($selector)
    {
        /** @var DocumentElement $page */
        $page = $this->getMainContext()->getSession()->getPage();
        $element = $page->find('css', $selector);

        assertNotNull($element, sprintf('Element %s not found', $selector));

        $element->click();
    }

    /**
     * Helper for finding items in the visible campaign view
     *
     * @param string $name Title of item
     * @return NodeElement
     */
    protected function getCampaign($name)
    {
        /** @var DocumentElement $page */
        $page = $this->getMainContext()->getSession()->getPage();
        // Find by row
        $row = $page->find(
            'xpath',
            "//tr[contains(@class, 'grid-field__row')]//td[contains(text(), '{$name}')]/.."
        );

        return $row ?: null;
    }

    /**
     * Gets a change set item in the detail view
     * @param $name
     * @return NodeElement
     */
    protected function getCampaignItem($name)
    {
        /** @var DocumentElement $page */
        $page = $this->getMainContext()->getSession()->getPage();
        return $page->find(
            'xpath',
            "//h4[contains(@class, 'list-group-item__heading') and contains(text(), '{$name}')]"
        );
    }
}
