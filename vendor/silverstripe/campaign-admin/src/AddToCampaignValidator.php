<?php

namespace SilverStripe\CampaignAdmin;

use SilverStripe\Forms\Validator;

class AddToCampaignValidator extends Validator
{
    /**
     * Allows validation of fields via specification of a php function for
     * validation which is executed after the form is submitted.
     *
     * @param array $data
     *
     * @return boolean
     */
    public function php($data)
    {
        $valid = true;
        $fields = $this->form->Fields();

        // Check field validation
        foreach ($fields as $field) {
            $valid = ($field->validate($this) && $valid);
        }
        if (!$valid) {
            return $valid;
        }
        $hasSelectField = $fields->dataFieldByName('Campaign') !== null;
        $hasNewField = $fields->dataFieldByName('NewTitle') !== null;

        // Guess best field to display error against
        if ((!empty($data['AddNewSelect']) || !$hasSelectField) && $hasNewField) {
            // Error: - Enter a title, either if the checkbox is checked, or no option dropdown is present
            // but only if NewTitle is set and empty
            if (empty($data['NewTitle'])) {
                $valid = false;
                $this->result->addFieldError(
                    'NewTitle',
                    _t(__CLASS__ . '.NEW_TITLE_EMPTY', 'Please enter a title for the new campaign')
                );
            }
        } elseif ($hasSelectField) {
            // Error: - Campaign dropdown is posted but empty
            if (empty($data['Campaign'])) {
                $valid = false;
                $this->result->addFieldError(
                    'Campaign',
                    _t(__CLASS__ . '.SELECT_CAMPAIGN_EMPTY', 'Please select a campaign')
                );
            }
        }

        return $valid;
    }
}
