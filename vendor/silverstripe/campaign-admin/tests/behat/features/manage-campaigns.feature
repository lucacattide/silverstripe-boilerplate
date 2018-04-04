@javascript @retry
Feature: Manage campaigns
  As a cms author
  I want to manage campaigns within the CMS
  So that I can control bulk publication of content efficiently

  Background:
    Given a "campaign" "Test Campaign" with "Description"="this is a test"
      And I am logged in with "ADMIN" permissions
      And I go to "/admin/campaigns"

  Scenario: I can create a campaign
    When I press the "Add campaign" button
      Then I should see the "Form_campaignCreateForm" form
    When I fill in "Name" with "newcampaign"
      And I fill in "Description" with "awesome campaign"
      And I press the "Create" button
    Then the "p.alert" element should contain "Nice one! You have successfully created a campaign."
      And the "Publish campaign" button should be disabled
  Scenario: I can edit campaign
    When I wait until I see the ".grid-field__table" element
      And I edit the campaign "Test Campaign"
    Then the "Name" field should contain "Test Campaign"
      And the "Description" field should contain "this is a test"
      And the "State" field should contain "open"
      And I should see a "button.font-icon-tick[name=action_save]" element
    When I fill in "Name" with "changed"
    Then I should see a "button.font-icon-save[name=action_save]" element
    When I fill in "Name" with "Test Campaign"
    Then I should see a "button.font-icon-tick[name=action_save]" element
    When I fill in "Name" with "Test campaign changed"
      And I press the "Save" button
      And I press the "Campaigns" button
    Then I should see the campaign "Test campaign changed"
  Scenario: I can delete a campaign
    When I wait until I see the ".grid-field__table" element
      And I delete the campaign "Test Campaign"
    Then I should not see the campaign "Test Campaign"
