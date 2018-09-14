<?php

namespace SilverStripe\CampaignAdmin;

use LogicException;
use SilverStripe\Admin\LeftAndMain;
use SilverStripe\Admin\LeftAndMainFormRequestHandler;
use SilverStripe\Control\Controller;
use SilverStripe\Control\HTTPRequest;
use SilverStripe\Control\HTTPResponse;
use SilverStripe\Core\Config\Config;
use SilverStripe\Core\Convert;
use SilverStripe\Core\Injector\Injector;
use SilverStripe\Forms\FieldList;
use SilverStripe\Forms\Form;
use SilverStripe\Forms\FormAction;
use SilverStripe\Forms\HiddenField;
use SilverStripe\Forms\RequiredFields;
use SilverStripe\ORM\DataObject;
use SilverStripe\ORM\FieldType\DBDatetime;
use SilverStripe\ORM\SS_List;
use SilverStripe\ORM\UnexpectedDataException;
use SilverStripe\ORM\ValidationResult;
use SilverStripe\Security\PermissionProvider;
use SilverStripe\Security\Security;
use SilverStripe\Security\SecurityToken;
use SilverStripe\Versioned\ChangeSet;
use SilverStripe\Versioned\ChangeSetItem;
use SilverStripe\View\Requirements;

/**
 * Campaign section of the CMS
 */
class CampaignAdmin extends LeftAndMain implements PermissionProvider
{

    private static $allowed_actions = [
        'set',
        'sets',
        'EditForm',
        'campaignEditForm',
        'campaignCreateForm',
        'readCampaigns',
        'readCampaign',
        'deleteCampaign',
        'publishCampaign',
        'removeCampaignItem'
    ];

    private static $menu_priority = 3;

    /**
     * When listing campaigns, re-sync items automatically after this many seconds.
     * This can prevent unnecessary and expensive database requests on every view.
     *
     * @config
     * @var int
     */
    private static $sync_expires = 300;

    private static $menu_title = 'Campaigns';

    private static $menu_icon_class = 'font-icon-page-multiple';

    private static $tree_class = ChangeSet::class;

    /**
     * Show published changesets
     *
     * Note: Experimental API (will be changed in the near future)
     *
     * @config
     * @var bool
     */
    private static $show_published = true;

    /**
     * Show inferred changesets (automatically created when you publish a page)
     *
     * Note: Experimental API (will be changed in the near future)
     *
     * @config
     * @var bool
     */
    private static $show_inferred = false;

    private static $url_handlers = [
        'GET sets' => 'readCampaigns',
        'POST set/$ID/publish' => 'publishCampaign',
        'GET set/$ID/$Name' => 'readCampaign',
        'DELETE set/$ID' => 'deleteCampaign',
        'campaignEditForm/$ID' => 'campaignEditForm',
        'campaignCreateForm' => 'campaignCreateForm',
        'POST removeCampaignItem/$CampaignID/$ItemID' => 'removeCampaignItem',
    ];

    private static $url_segment = 'campaigns';

    /**
     * Size of thumbnail width
     *
     * @config
     * @var int
     */
    private static $thumbnail_width = 64;

    /**
     * Size of thumbnail height
     *
     * @config
     * @var int
     */
    private static $thumbnail_height = 64;

    private static $required_permission_codes = 'CMS_ACCESS_CampaignAdmin';

    public function getClientConfig()
    {
        return array_merge(parent::getClientConfig(), [
            'reactRouter' => true,
            'form' => [
                // TODO Use schemaUrl instead
                'EditForm' => [
                    'schemaUrl' => $this->Link('schema/EditForm')
                ],
                'campaignEditForm' => [
                    'schemaUrl' => $this->Link('schema/campaignEditForm')
                ],
                'campaignCreateForm' => [
                    'schemaUrl' => $this->Link('schema/campaignCreateForm')
                ],
            ],
            'readCampaignsEndpoint' => [
                'url' => $this->Link() . 'sets',
                'method' => 'get'
            ],
            'itemListViewEndpoint' => [
                'url' => $this->Link() . 'set/:id/show',
                'method' => 'get'
            ],
            'publishEndpoint' => [
                'url' => $this->Link() . 'set/:id/publish',
                'method' => 'post'
            ],
            'removeCampaignItemEndpoint' => [
                'url' => $this->Link() . 'removeCampaignItem/:id/:itemId',
                'method' => 'post'
            ],
            'treeClass' => $this->config()->get('tree_class')
        ]);
    }

    public function init()
    {
        parent::init();
        Requirements::add_i18n_javascript('silverstripe/campaign-admin: client/lang', false, true);
        Requirements::javascript('silverstripe/campaign-admin: client/dist/js/bundle.js');
        Requirements::css('silverstripe/campaign-admin: client/dist/styles/bundle.css');
    }

    public function getEditForm($id = null, $fields = null)
    {
        $fields = new FieldList(
            CampaignAdminList::create('ChangeSets')
        );
        $actions = new FieldList();
        $form = Form::create($this, 'EditForm', $fields, $actions);
        $form->addExtraClass('form--padded');

        // Set callback response
        $form->setValidationResponseCallback(function () use ($form) {
            $schemaId = $this->Link('schema/EditForm');
            return $this->getSchemaResponse($form, $schemaId);
        });

        return $form;
    }

    public function EditForm($request = null)
    {
        // Note: Edit form doesn't have ID, and simply populates a top level gridfield
        return $this->getEditForm();
    }

    /**
     * REST endpoint to get a list of campaigns.
     *
     * @return HTTPResponse
     */
    public function readCampaigns()
    {
        $response = new HTTPResponse();
        $response->addHeader('Content-Type', 'application/json');
        $hal = $this->getListResource();
        $response->setBody(Convert::array2json($hal));
        return $response;
    }

    /**
     * @return array
     */
    protected function getPlaceholderGroups()
    {
        $groups = [];

        $classes = Config::inst()->get(ChangeSet::class, 'important_classes');

        foreach ($classes as $class) {
            if (!class_exists($class)) {
                continue;
            }
            /** @var DataObject $item */
            $item = Injector::inst()->get($class);
            $groups[] = [
                'baseClass' => DataObject::getSchema()->baseDataClass($class),
                'singular' => $item->i18n_singular_name(),
                'plural' => $item->i18n_plural_name(),
                'noItemsText' => _t(__CLASS__.'.NOITEMSTEXT', 'Add items from the {section} section', [
                    'section' => $item->i18n_plural_name(),
                ]),
                'items' => []
            ];
        }

        $this->extend('updatePlaceholderGroups', $groups);

        return $groups;
    }

    /**
     * Get list contained as a hal wrapper
     *
     * @return array
     */
    protected function getListResource()
    {
        $items = $this->getListItems();
        $count = $items->count();
        /** @var string $treeClass */
        $treeClass = $this->config()->get('tree_class');
        $hal = [
            'count' => $count,
            'total' => $count,
            '_links' => [
                'self' => [
                    'href' => $this->Link('items')
                ]
            ],
            '_embedded' => [$treeClass => []]
        ];
        /** @var ChangeSet $item */
        foreach ($items as $item) {
            $sync = $this->shouldCampaignSync($item);
            $resource = $this->getChangeSetResource($item, $sync);
            $hal['_embedded'][$treeClass][] = $resource;
        }
        return $hal;
    }

    /**
     * Build item resource from a changeset
     *
     * @param ChangeSet $changeSet
     * @param bool $sync Set to true to force async of this changeset
     * @return array
     */
    protected function getChangeSetResource(ChangeSet $changeSet, $sync = false)
    {
        $stateLabel = sprintf(
            '<span class="campaign-status campaign-status--%s"></span>%s',
            $changeSet->State,
            $changeSet->getStateLabel()
        );

        $hal = [
            '_links' => [
                'self' => [
                    'href' => $this->SetLink($changeSet->ID)
                ]
            ],
            'ID' => $changeSet->ID,
            'Name' => $changeSet->Name,
            'Created' => $changeSet->Created,
            'LastEdited' => $changeSet->LastEdited,
            'State' => $changeSet->State,
            'StateLabel' => [ 'html' => $stateLabel ],
            'IsInferred' => $changeSet->IsInferred,
            'canEdit' => $changeSet->canEdit(),
            'canPublish' => false,
            '_embedded' => ['items' => []],
            'placeholderGroups' => $this->getPlaceholderGroups(),
        ];

        // Before presenting the changeset to the client,
        // synchronise it with new changes.
        try {
            if ($sync) {
                $changeSet->sync();
            }
            $hal['PublishedLabel'] = $changeSet->getPublishedLabel() ?: '-';
            $hal['Details'] = $changeSet->getDetails();
            $hal['canPublish'] = $changeSet->canPublish() && $changeSet->hasChanges();

            foreach ($changeSet->Changes() as $changeSetItem) {
                if (!$changeSetItem) {
                    continue;
                }

                /** @var ChangesetItem $changeSetItem */
                $resource = $this->getChangeSetItemResource($changeSetItem);
                $hal['_embedded']['items'][] = $resource;
            }

        // An unexpected data exception means that the database is corrupt
        } catch (UnexpectedDataException $e) {
            $hal['PublishedLabel'] = '-';
            $hal['Details'] = 'Corrupt database! ' . $e->getMessage();
            $hal['canPublish'] = false;
        }
        return $hal;
    }

    /**
     * Build item resource from a changesetitem
     *
     * @param ChangeSetItem $changeSetItem
     * @return array
     */
    protected function getChangeSetItemResource(ChangeSetItem $changeSetItem)
    {
        $baseClass = DataObject::getSchema()->baseDataClass($changeSetItem->ObjectClass);
        $baseSingleton = DataObject::singleton($baseClass);
        $thumbnailWidth = (int)$this->config()->get('thumbnail_width');
        $thumbnailHeight = (int)$this->config()->get('thumbnail_height');
        $hal = [
            '_links' => [
                'self' => [
                    'id' => $changeSetItem->ID,
                    'href' => $this->ItemLink($changeSetItem->ID)
                ]
            ],
            'ID' => $changeSetItem->ID,
            'Created' => $changeSetItem->Created,
            'LastEdited' => $changeSetItem->LastEdited,
            'Title' => $changeSetItem->getTitle(),
            'ChangeType' => $changeSetItem->getChangeType(),
            'Added' => $changeSetItem->Added,
            'ObjectClass' => $changeSetItem->ObjectClass,
            'ObjectID' => $changeSetItem->ObjectID,
            'BaseClass' => $baseClass,
            'Singular' => $baseSingleton->i18n_singular_name(),
            'Plural' => $baseSingleton->i18n_plural_name(),
            'Thumbnail' => $changeSetItem->ThumbnailURL($thumbnailWidth, $thumbnailHeight),
        ];
        // Get preview urls
        $previews = $changeSetItem->getPreviewLinks();
        if ($previews) {
            $hal['_links']['preview'] = $previews;
        }

        // Get edit link
        $editLink = $changeSetItem->CMSEditLink();
        if ($editLink) {
            $hal['_links']['edit'] = [
                'href' => $editLink,
            ];
        }

        // Depending on whether the object was added implicitly or explicitly, set
        // other related objects.
        if ($changeSetItem->Added === ChangeSetItem::IMPLICITLY) {
            $referencedItems = $changeSetItem->ReferencedBy();
            $referencedBy = [];
            foreach ($referencedItems as $referencedItem) {
                $referencedBy[] = [
                    'href' => $this->SetLink($referencedItem->ID),
                    'ChangeSetItemID' => $referencedItem->ID
                ];
            }
            if ($referencedBy) {
                $hal['_links']['referenced_by'] = $referencedBy;
            }
        }

        $referToItems = $changeSetItem->References();
        $referTo = [];
        foreach ($referToItems as $referToItem) {
            $referTo[] = [
                'ChangeSetItemID' => $referToItem->ID,
            ];
        }
        $hal['_links']['references'] = $referTo;

        return $hal;
    }

    /**
     * Gets viewable list of campaigns
     *
     * @return SS_List
     */
    protected function getListItems()
    {
        $changesets = ChangeSet::get();
        // Filter out published items if disabled
        if (!$this->config()->get('show_published')) {
            $changesets = $changesets->filter('State', ChangeSet::STATE_OPEN);
        }
        // Filter out automatically created changesets
        if (!$this->config()->get('show_inferred')) {
            $changesets = $changesets->filter('IsInferred', 0);
        }
        return $changesets
            ->filterByCallback(function ($item) {
                /** @var ChangeSet $item */
                return ($item->canView());
            });
    }


    /**
     * REST endpoint to get a campaign.
     *
     * @param HTTPRequest $request
     *
     * @return HTTPResponse
     */
    public function readCampaign(HTTPRequest $request)
    {
        $response = new HTTPResponse();

        if ($request->getHeader('Accept') == 'text/json') {
            $response->addHeader('Content-Type', 'application/json');
            if (!$request->param('Name')) {
                return (new HTTPResponse(null, 400));
            }

            /** @var ChangeSet $changeSet */
            $changeSet = ChangeSet::get()->byID($request->param('ID'));
            if (!$changeSet) {
                return (new HTTPResponse(null, 404));
            }

            if (!$changeSet->canView()) {
                return (new HTTPResponse(null, 403));
            }

            $body = Convert::raw2json($this->getChangeSetResource($changeSet, true));
            return (new HTTPResponse($body, 200))
                ->addHeader('Content-Type', 'application/json');
        } else {
            return $this->index($request);
        }
    }

    /**
     * REST endpoint to delete a campaign item.
     *
     * @param HTTPRequest $request
     *
     * @return HTTPResponse
     */
    public function removeCampaignItem(HTTPRequest $request)
    {
        // Check security ID
        if (!SecurityToken::inst()->checkRequest($request)) {
            return new HTTPResponse(null, 400);
        }

        $campaignID = $request->param('CampaignID');
        $itemID = $request->param('ItemID');

        if (!$campaignID ||
            !is_numeric($campaignID) ||
            !$itemID ||
            !is_numeric($itemID)) {
            return (new HTTPResponse(null, 400));
        }

        /** @var ChangeSet $campaign */
        $campaign = ChangeSet::get()->byID($campaignID);
        /** @var ChangeSetItem $item */
        $item = ChangeSetItem::get()->byID($itemID);
        if (!$campaign || !$item) {
            return (new HTTPResponse(null, 404));
        }


        $campaign->removeObject($item->Object());

        return (new HTTPResponse(null, 204));
    }

    /**
     * REST endpoint to delete a campaign.
     *
     * @param HTTPRequest $request
     *
     * @return HTTPResponse
     */
    public function deleteCampaign(HTTPRequest $request)
    {
        // Check security ID
        if (!SecurityToken::inst()->checkRequest($request)) {
            return new HTTPResponse(null, 400);
        }

        $id = $request->param('ID');
        if (!$id || !is_numeric($id)) {
            return (new HTTPResponse(null, 400));
        }

        $record = ChangeSet::get()->byID($id);
        if (!$record) {
            return (new HTTPResponse(null, 404));
        }

        if (!$record->canDelete()) {
            return (new HTTPResponse(null, 403));
        }

        $record->delete();

        return (new HTTPResponse(null, 204));
    }

    /**
     * REST endpoint to publish a {@link ChangeSet} and all of its items.
     *
     * @param HTTPRequest $request
     *
     * @return HTTPResponse
     */
    public function publishCampaign(HTTPRequest $request)
    {
        // Protect against CSRF on destructive action
        if (!SecurityToken::inst()->checkRequest($request)) {
            return (new HTTPResponse(null, 400));
        }

        $id = $request->param('ID');
        if (!$id || !is_numeric($id)) {
            return (new HTTPResponse(null, 400));
        }

        /** @var ChangeSet $record */
        $record = ChangeSet::get()->byID($id);
        if (!$record) {
            return (new HTTPResponse(null, 404));
        }

        if (!$record->canPublish()) {
            return (new HTTPResponse(null, 403));
        }

        try {
            $record->publish();
        } catch (LogicException $e) {
            return (new HTTPResponse(json_encode(['status' => 'error', 'message' => $e->getMessage()]), 401))
                ->addHeader('Content-Type', 'application/json');
        }

        return (new HTTPResponse(
            Convert::raw2json($this->getChangeSetResource($record)),
            200
        ))->addHeader('Content-Type', 'application/json');
    }

    /**
     * Url handler for edit form
     *
     * @param HTTPRequest $request
     * @return Form
     */
    public function campaignEditForm($request)
    {
        // Get ID either from posted back value, or url parameter
        if (!$request) {
            $this->httpError(400);
            return null;
        }
        $id = $request->param('ID');
        if (!$id) {
            $this->httpError(400);
            return null;
        }
        return $this->getCampaignEditForm($id);
    }

    /**
     * @todo Use GridFieldDetailForm once it can handle structured data and form schemas
     * @todo move to FormBuilder
     *
     * @param int $id
     * @return Form
     */
    public function getCampaignEditForm($id)
    {
        // Get record-specific fields
        $record = ChangeSet::get()->byID($id);
        if (!$record) {
            $this->httpError(404);
            return null;
        }
        if (!$record->canView()) {
            $this->httpError(403);
            return null;
        }

        $fields = $record->getCMSFields();

        // Add standard fields
        $fields->push(HiddenField::create('ID'));
        $form = Form::create(
            $this,
            'campaignEditForm',
            $fields,
            FieldList::create(
                FormAction::create('save', _t(__CLASS__.'SAVE', 'Save'))
                    ->setIcon('save')
                    ->setSchemaState([
                        'data' => [
                            'pristineTitle' => _t(__CLASS__.'SAVED', 'Saved'),
                            'pristineIcon' => 'tick',
                            'dirtyTitle' => _t(__CLASS__.'SAVE', 'Save'),
                            'dirtyIcon' => 'save',
                            'pristineClass' => 'btn-outline-primary',
                            'dirtyClass' => '',
                        ],
                    ]),
                FormAction::create('cancel', _t(__CLASS__.'.CANCEL', 'Cancel'))
                    ->setUseButtonTag(true)
            ),
            new RequiredFields('Name')
        );

        // Load into form
        $form->loadDataFrom($record);

        // Set form action handler with ID included
        $form->setRequestHandler(
            LeftAndMainFormRequestHandler::create($form, [ $id ])
        );

        // Configure form to respond to validation errors with form schema
        // if requested via react.
        $form->setValidationResponseCallback(function (ValidationResult $errors) use ($form, $id, $record) {
            $schemaId = Controller::join_links(
                $this->Link('schema'),
                'campaignEditForm',
                $id
            );
            return $this->getSchemaResponse($schemaId, $form, $errors);
        });

        $form->setNotifyUnsavedChanges(true);

        return $form;
    }

    /**
     * Url handler for create form
     *
     * @param HTTPRequest $request
     * @return Form
     */
    public function campaignCreateForm($request)
    {
        return $this->getCampaignCreateForm();
    }

    /**
     * Build create form
     * @todo Move to form builder
     *
     * @return Form
     */
    public function getCampaignCreateForm()
    {
        $record = ChangeSet::singleton();
        if (!$record->canCreate()) {
            $this->httpError(403);
            return null;
        }
        $fields = $record->getCMSFields();

        // Add standard fields
        $fields->push(HiddenField::create('ID'));
        $form = Form::create(
            $this,
            'campaignCreateForm',
            $fields,
            FieldList::create(
                FormAction::create('save', _t(__CLASS__.'.CREATE', 'Create'))
                    ->setIcon('plus'),
                FormAction::create('cancel', _t(__CLASS__.'.CANCEL', 'Cancel'))
                    ->setUseButtonTag(true)
            ),
            new RequiredFields('Name')
        );

        // Custom form handler
        $form->setRequestHandler(
            LeftAndMainFormRequestHandler::create($form)
        );

        // Configure form to respond to validation errors with form schema
        // if requested via react.
        $form->setValidationResponseCallback(function (ValidationResult $errors) use ($form, $record) {
            $schemaId = $this->Link('schema/campaignCreateForm');
            return $this->getSchemaResponse($schemaId, $form, $errors);
        });

        $form->setNotifyUnsavedChanges(true);

        return $form;
    }

    /**
     * Save  handler
     *
     * @param array $data
     * @param Form $form
     * @return HTTPResponse
     */
    public function save($data, $form)
    {
        $errors = null;

        // Existing or new record?
        $id = empty($data['ID']) ? 0 : $data['ID'];
        if ($id) {
            $record = ChangeSet::get()->byID($id);
            if ($record && !$record->canEdit()) {
                return Security::permissionFailure($this);
            }
            if (!$record || !$record->ID) {
                $this->httpError(404, "Bad record ID #" . (int)$id);
            }
        } else {
            if (!ChangeSet::singleton()->canCreate()) {
                return Security::permissionFailure($this);
            }
            $record = ChangeSet::create();
        }

        $hasExistingName = Changeset::get()
            ->filter('Name:nocase', $data['Name'])
            ->exclude('ID', $id)
            ->count() > 0;

        if (!$hasExistingName) {
            // save form data into record
            $form->saveInto($record, true);
            $record->write();
            $this->extend('onAfterSave', $record);
            $message = _t(__CLASS__.'.SAVEDUP', 'Saved.');
            $form->setMessage($message, ValidationResult::TYPE_GOOD);
        } else {
            $nameDuplicateMsg = _t(__CLASS__ . '.ERROR_DUPLICATE_NAME', 'Name "{Name}" already exists', '', [ 'Name' => $data['Name']]);
            $errors = new ValidationResult();
            $errors->addFieldMessage('Name', $nameDuplicateMsg);
            $message = _t(__CLASS__.'.SAVEDERROR', 'Error.');
            // Need to set the form message or the field message won't show up at all
            $form->setMessage($message, ValidationResult::TYPE_ERROR);
        }

        if ($id) {
            $schemaId = Controller::join_links($this->Link('schema'), 'campaignEditForm', $id);
        } else {
            $schemaId = Controller::join_links($this->Link('schema'), 'campaignCreateForm');
        }

        // Ensure that newly created records have all their data loaded back into the form.
        $form->loadDataFrom($record);
        $extra = ['record' => ['id' => $record->ID]];
        $response = $this->getSchemaResponse($schemaId, $form, $errors, $extra);
        $response->addHeader('X-Status', rawurlencode($message));
        return $response;
    }

    /**
     * Gets user-visible url to edit a specific {@see ChangeSet}
     *
     * @param $itemID
     * @return string
     */
    public function SetLink($itemID)
    {
        return Controller::join_links(
            $this->Link('set'),
            $itemID
        );
    }

    /**
     * Gets user-visible url to edit a specific {@see ChangeSetItem}
     *
     * @param int $itemID
     * @return string
     */
    public function ItemLink($itemID)
    {
        return Controller::join_links(
            $this->Link('item'),
            $itemID
        );
    }

    public function providePermissions()
    {
        return array(
            "CMS_ACCESS_CampaignAdmin" => array(
                'name' => _t(
                    'SilverStripe\\CMS\\Controllers\\CMSMain.ACCESS',
                    "Access to '{title}' section",
                    array('title' => static::menu_title())
                ),
                'category' => _t('SilverStripe\\Security\\Permission.CMS_ACCESS_CATEGORY', 'CMS Access'),
                'help' => _t(
                    __CLASS__.'.ACCESS_HELP',
                    'Allow viewing of the campaign publishing section.'
                )
            )
        );
    }

    /**
     * Check if the given campaign should be synced before view
     *
     * @param ChangeSet $item
     * @return bool
     */
    protected function shouldCampaignSync(ChangeSet $item)
    {
        // Don't sync published changesets
        if ($item->State !== ChangeSet::STATE_OPEN) {
            return false;
        }

        // Get sync threshold
        $syncOlderThan = DBDatetime::now()->getTimestamp() - $this->config()->get('sync_expires');
        /** @var DBDatetime $lastSynced */
        $lastSynced = $item->dbObject('LastSynced');
        return !$lastSynced || $lastSynced->getTimestamp() < $syncOlderThan;
    }
}
