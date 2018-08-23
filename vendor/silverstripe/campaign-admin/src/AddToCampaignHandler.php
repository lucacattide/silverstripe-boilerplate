<?php

namespace SilverStripe\CampaignAdmin;

use SilverStripe\Control\Controller;
use SilverStripe\Control\Director;
use SilverStripe\Control\HTTPResponse_Exception;
use SilverStripe\Control\HTTPResponse;
use SilverStripe\Core\ClassInfo;
use SilverStripe\Core\Injector\Injectable;
use SilverStripe\Dev\Deprecation;
use SilverStripe\Forms\CheckboxField;
use SilverStripe\Forms\DropdownField;
use SilverStripe\Forms\HiddenField;
use SilverStripe\Forms\LiteralField;
use SilverStripe\Forms\FieldList;
use SilverStripe\Forms\Form;
use SilverStripe\Forms\TextField;
use SilverStripe\ORM\ArrayList;
use SilverStripe\ORM\DataObject;
use SilverStripe\ORM\FieldType\DBHTMLText;
use SilverStripe\ORM\ValidationException;
use SilverStripe\ORM\ValidationResult;
use SilverStripe\Versioned\ChangeSet;
use SilverStripe\Versioned\ChangeSetItem;
use SilverStripe\Versioned\Versioned;
use SilverStripe\Core\Convert;

/**
 * Class AddToCampaignHandler - handle the AddToCampaign action.
 *
 * This is a class designed to be delegated to by a Form action handler method in the EditForm of a LeftAndMain
 * child class.
 *
 * Add To Campaign can be seen as an item action like "publish" or "rollback", but unlike those actions
 * it needs one additional piece of information to execute, the ChangeSet ID.
 *
 * So this handler does one of two things to respond to the action request, depending on whether the ChangeSet ID
 * was included in the submitted data
 * - If it was, perform the Add To Campaign action (as per any other action)
 * - If it wasn't, return a form to get the ChangeSet ID and then repeat this action submission
 *
 * To use, you'd add an action to your LeftAndMain subclass, like this:
 *
 *     function addtocampaign($data, $form) {
 *         $handler = AddToCampaignHandler::create($form, $data);
 *         return $handler->handle();
 *     }
 *
 *  and add an AddToCampaignHandler_FormAction to the EditForm, possibly through getCMSActions
 */
class AddToCampaignHandler
{
    use Injectable;

    /**
     * Parent controller for this form
     *
     * @var Controller
     */
    protected $controller;

    /**
     * The submitted form data
     *
     * @var array
     */
    protected $data;

    /**
     * Form name to use
     *
     * @var string
     */
    protected $name;

    /**
     * AddToCampaignHandler constructor.
     *
     * @param Controller $controller Controller for this form
     * @param array|DataObject $data The data submitted as part of that form
     * @param string $name Form name
     */
    public function __construct($controller = null, $data = [], $name = 'AddToCampaignForm')
    {
        $this->controller = $controller;
        if ($data instanceof DataObject) {
            $data = $data->toMap();
        }
        $this->data = $data;
        $this->name = $name;
    }

    /**
     * Perform the action. Either returns a Form or performs the action, as per the class doc
     *
     * @return DBHTMLText|HTTPResponse
     */
    public function handle()
    {
        Deprecation::notice('5.0', 'handle() will be removed. Use addToCampaign or Form directly');
        $object = $this->getObject($this->data['ID'], $this->data['ClassName']);

        if (empty($this->data['Campaign'])) {
            return $this->Form($object)->forTemplate();
        } else {
            return $this->addToCampaign($object, $this->data['Campaign']);
        }
    }

    /**
     * Get what ChangeSets are available for an item to be added to by this user
     *
     * @return ArrayList|ChangeSet[]
     */
    protected function getAvailableChangeSets()
    {
        return ChangeSet::get()
            ->filter('State', ChangeSet::STATE_OPEN)
            ->filterByCallback(function ($item) {
                /** @var ChangeSet $item */
                return $item->canView();
            });
    }

    /**
     * Get changesets that a given object is already in
     *
     * @param DataObject
     * @return ArrayList[ChangeSet]
     */
    protected function getInChangeSets($object)
    {
        $inChangeSetIDs = array_unique(ChangeSetItem::get_for_object($object)->column('ChangeSetID'));
        if ($inChangeSetIDs > 0) {
            $changeSets = $this->getAvailableChangeSets()->filter([
                'ID' => $inChangeSetIDs,
                'State' => ChangeSet::STATE_OPEN
            ]);
        } else {
            $changeSets = new ArrayList();
        }

        return $changeSets;
    }

    /**
     * Safely get a DataObject from a client-supplied ID and ClassName, checking: argument
     * validity; existence; and canView permissions.
     *
     * @param int $id The ID of the DataObject
     * @param string $class The Class of the DataObject
     * @return DataObject The referenced DataObject
     * @throws HTTPResponse_Exception
     */
    protected function getObject($id, $class)
    {
        $id = (int)$id;
        $class = ClassInfo::class_name($class);

        if (!$class
            || !is_subclass_of($class, DataObject::class)
            || !DataObject::has_extension($class, Versioned::class)
        ) {
            $this->controller->httpError(400, _t(
                __CLASS__ . '.ErrorGeneral',
                'We apologise, but there was an error'
            ));
            return null;
        }

        $object = DataObject::get($class)->byID($id);

        if (!$object) {
            $this->controller->httpError(404, _t(
                __CLASS__ . '.ErrorNotFound',
                'That {Type} couldn\'t be found',
                '',
                ['Type' => $class]
            ));
            return null;
        }

        if (!$object->canView()) {
            $this->controller->httpError(403, _t(
                __CLASS__ . '.ErrorItemPermissionDenied',
                'It seems you don\'t have the necessary permissions to add {ObjectTitle} to a campaign',
                '',
                ['ObjectTitle' => $object->Title]
            ));
            return null;
        }

        return $object;
    }

    /**
     * Builds a Form that mirrors the parent editForm, but with an extra field to collect the ChangeSet ID
     *
     * @param DataObject $object The object we're going to be adding to whichever ChangeSet is chosen
     * @return Form
     */
    public function Form($object)
    {
        $inChangeSets = $this->getInChangeSets($object);
        $inChangeSetIDs = $inChangeSets->column('ID');

        // Get changesets that can be added to
        $candidateChangeSets = $this->getAvailableChangeSets();
        if ($inChangeSetIDs) {
            $candidateChangeSets = $candidateChangeSets->exclude('ID', $inChangeSetIDs);
        }

        $canCreate = ChangeSet::singleton()->canCreate();
        $message = $this->getFormAlert($inChangeSets, $candidateChangeSets, $canCreate);
        $fields = new FieldList(array_filter([
            $message ? LiteralField::create("AlertMessages", $message) : null,
            HiddenField::create('ID', null, $object->ID),
            HiddenField::create('ClassName', null, $object->baseClass())
        ]));

        // Add fields based on available options
        $showSelect = $candidateChangeSets->count() > 0;
        if ($showSelect) {
            $campaignDropdown = DropdownField::create(
                'Campaign',
                _t(__CLASS__ . '.AddToCampaignAvailableLabel', 'Available campaigns'),
                $candidateChangeSets
            )
                ->setEmptyString(_t(__CLASS__ . '.AddToCampaignFormFieldLabel', 'Select a Campaign'))
                ->addExtraClass('noborder')
                ->addExtraClass('no-chosen');
            $fields->push($campaignDropdown);

            // Show visibilty toggle of other create field
            if ($canCreate) {
                $addCampaignSelect = CheckboxField::create('AddNewSelect', _t(
                    __CLASS__ . '.ADD_TO_A_NEW_CAMPAIGN',
                    'Add to a new campaign'
                ))
                    ->setAttribute('data-shows', 'NewTitle')
                    ->setSchemaData(['data' => ['shows' => 'NewTitle']]);
                $fields->push($addCampaignSelect);
            }
        }
        if ($canCreate) {
            $placeholder = _t(__CLASS__ . '.CREATE_NEW_PLACEHOLDER', 'Enter campaign name');
            $createBox = TextField::create(
                'NewTitle',
                _t(__CLASS__ . '.CREATE_NEW', 'Create a new campaign')
            )
                ->setAttribute('placeholder', $placeholder)
                ->setSchemaData(['attributes' => ['placeholder' => $placeholder]]);
            $fields->push($createBox);
        }

        $actions = FieldList::create();
        if ($canCreate || $showSelect) {
            $actions->push(
                AddToCampaignHandler_FormAction::create()
                    ->setTitle(_t(__CLASS__ . '.AddToCampaignAddAction', 'Add'))
                    ->addExtraClass('add-to-campaign__action')
            );
        }

        $form = Form::create(
            $this->controller,
            $this->name,
            $fields,
            $actions,
            AddToCampaignValidator::create()
        );

        $form->setHTMLID('Form_EditForm_AddToCampaign');
        $form->addExtraClass('form--no-dividers add-to-campaign__form');

        return $form;
    }

    /**
     * Performs the actual action of adding the object to the ChangeSet, once the ChangeSet ID is known
     *
     * @param DataObject $object The object to add to the ChangeSet
     * @param array|int $data Post data for this campaign form, or the ID of the campaign to add to
     * @return HTTPResponse
     * @throws ValidationException
     */
    public function addToCampaign($object, $data)
    {
        // Extract $campaignID from $data
        $campaignID = $this->getOrCreateCampaign($data);

        /** @var ChangeSet $changeSet */
        $changeSet = ChangeSet::get()->byID($campaignID);

        if (!$changeSet) {
            throw new ValidationException(_t(
                __CLASS__ . '.ErrorNotFound',
                'That {Type} couldn\'t be found',
                ['Type' => 'Campaign']
            ));
        }

        if (!$changeSet->canEdit()) {
            throw new ValidationException(_t(
                __CLASS__ . '.ErrorCampaignPermissionDenied',
                'It seems you don\'t have the necessary permissions to add {ObjectTitle} to {CampaignTitle}',
                [
                    'ObjectTitle' => $object->Title,
                    'CampaignTitle' => $changeSet->Title
                ]
            ));
        }

        $changeSet->addObject($object);

        $request = $this->controller->getRequest();
        $message = _t(
            __CLASS__ . '.Success',
            'Successfully added <strong>{ObjectTitle}</strong> to <strong>{CampaignTitle}</strong>',
            [
                'ObjectTitle' => Convert::raw2xml($object->Title),
                'CampaignTitle' => Convert::raw2xml($changeSet->Title)
            ]
        );
        if ($request->getHeader('X-Formschema-Request')) {
            return $message;
        } elseif (Director::is_ajax()) {
            $response = new HTTPResponse($message, 200);

            $response->addHeader('Content-Type', 'text/html; charset=utf-8');
            return $response;
        } else {
            return $this->controller->redirectBack();
        }
    }

    /**
     * Get descriptive alert to display at the top of the form
     *
     * @param ArrayList $inChangeSets List of changesets this item exists in
     * @param ArrayList $candidateChangeSets List of changesets this item could be added to
     * @param bool $canCreate
     * @return string
     */
    protected function getFormAlert($inChangeSets, $candidateChangeSets, $canCreate)
    {
        // In a subset of changesets
        if ($inChangeSets->count() > 0 && $candidateChangeSets->count() > 0) {
            return sprintf(
                '<div class="alert alert-info"><strong>%s</strong><br/>%s</div>',
                _t(
                    __CLASS__ . '.AddToCampaignInChangsetLabel',
                    'Heads up, this item is already in campaign(s):'
                ),
                Convert::raw2xml(implode(', ', $inChangeSets->column('Name')))
            );
        }

        // In all changesets
        if ($inChangeSets->count() > 0) {
            return sprintf(
                '<div class="alert alert-info"><strong>%s</strong><br/>%s</div>',
                _t(
                    __CLASS__ . '.AddToCampaignInChangsetLabelAll',
                    'Heads up, this item is already in ALL campaign(s):'
                ),
                Convert::raw2xml(implode(', ', $inChangeSets->column('Name')))
            );
        }

        // Create only
        if ($candidateChangeSets->count() === 0 && $canCreate) {
            return sprintf(
                '<div class="alert alert-info">%s</div>',
                _t(
                    __CLASS__ . '.NO_CAMPAIGNS',
                    "You currently don't have any campaigns. "
                    . "You can edit campaign details later in the Campaigns section."
                )
            );
        }

        // Can't select or create
        if ($candidateChangeSets->count() === 0 && !$canCreate) {
            return sprintf(
                '<div class="alert alert-warning">%s</div>',
                _t(
                    __CLASS__ . '.NO_CREATE',
                    "Oh no! You currently don't have any campaigns created. "
                    . "Your current login does not have privileges to create campaigns. "
                    . "Campaigns can only be created by users with Campaigns section rights."
                )
            );
        }
        return null;
    }

    /**
     * Find or build campaign from posted data
     *
     * @param array|int $data
     * @return int
     * @throws ValidationException
     */
    protected function getOrCreateCampaign($data)
    {
        // Create new campaign if selected
        if (is_array($data) && !empty($data['AddNewSelect']) // Explicitly click "Add to a new campaign"
            || (is_array($data) && !isset($data['Campaign']) && isset($data['NewTitle'])) // This is the only option
        ) {
            // Permission
            if (!ChangeSet::singleton()->canCreate()) {
                throw $this->validationResult(
                    _t(__CLASS__ . '.CREATE_DENIED', 'You do not have permission to create campaigns')
                );
            }

            // Check title is valid
            $title = $data['NewTitle'];
            if (empty($title)) {
                throw $this->validationResult(
                    _t(__CLASS__ . '.MISSING_TITLE', 'Campaign name is required'),
                    'NewTitle'
                );
            }

            // Prevent duplicates
            $hasExistingName = Changeset::get()
                    ->filter('Name:nocase', $title)
                    ->count() > 0;

            if ($hasExistingName) {
                throw $this->validationResult(
                    _t(
                        'SilverStripe\\CampaignAdmin\\CampaignAdmin.ERROR_DUPLICATE_NAME',
                        'Name "{Name}" already exists',
                        ['Name' => $title]
                    ),
                    'NewTitle'
                );
            }

            // Create and return
            $campaign = ChangeSet::create();
            $campaign->Name = $title;
            $campaign->write();
            return $campaign->ID;
        }

        // Get selected campaign ID
        $campaignID = null;
        if (is_array($data) && !empty($data['Campaign'])) {
            $campaignID = $data['Campaign'];
        } elseif (is_numeric($data)) {
            $campaignID = (int)$data;
        }
        if (empty($campaignID)) {
            throw $this->validationResult(_t(__CLASS__ . '.NONE_SELECTED', 'No campaign selected'));
        }
        return $campaignID;
    }

    /**
     * Raise validation error
     *
     * @param string $message
     * @param string $field
     * @return ValidationException
     */
    protected function validationResult($message, $field = null)
    {
        $error = ValidationResult::create()
            ->addFieldError($field, $message);
        return new ValidationException($error);
    }
}
