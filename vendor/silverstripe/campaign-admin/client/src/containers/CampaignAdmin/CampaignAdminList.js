/* global window */
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as breadcrumbsActions from 'state/breadcrumbs/BreadcrumbsActions';
import * as recordActions from 'state/records/RecordsActions';
import * as campaignActions from 'state/campaign/CampaignActions';
import Accordion from 'components/Accordion/Accordion';
import AccordionBlock from 'components/Accordion/AccordionBlock';
import ListGroupItem from 'components/ListGroup/ListGroupItem';
import Toolbar from 'components/Toolbar/Toolbar';
import FormAction from 'components/FormAction/FormAction';
import CampaignAdminItem from './CampaignAdminItem';
import Breadcrumb from 'components/Breadcrumb/Breadcrumb';
import Preview from 'components/Preview/Preview';
import i18n from 'i18n';
import classnames from 'classnames';

/**
 * Represents a campaign list view
 */
class CampaignAdminList extends Component {
  constructor(props) {
    super(props);

    this.handlePublish = this.handlePublish.bind(this);
    this.handleItemSelected = this.handleItemSelected.bind(this);
    this.setBreadcrumbs = this.setBreadcrumbs.bind(this);
    this.handleCloseItem = this.handleCloseItem.bind(this);
    this.handleRemoveItem = this.handleRemoveItem.bind(this);

    if (!this.isRecordLoaded(props)) {
      this.state = {
        loading: true,
      };
    } else {
      this.state = {
        loading: false,
      };
    }
  }

  componentDidMount() {
    const fetchURL = this.props.itemListViewEndpoint.url.replace(/:id/, this.props.campaignId);

    this.setBreadcrumbs();

    // Only load record if not already present
    if (!this.isRecordLoaded()) {
      this.props.recordActions
        .fetchRecord(this.props.treeClass, 'get', fetchURL)
        .then(() => {
          this.setBreadcrumbs();
          this.setState({ loading: false });
        });
    }
  }

  componentWillUnmount() {
    // Reset new create flag
    this.props.campaignActions.setNewItem(null);
  }

  /**
   * Update breadcrumbs for this view
   */
  setBreadcrumbs() {
    // Setup breadcrumbs if record is loaded
    if (!this.props.record) {
      return;
    }

    // Push breadcrumb
    const breadcrumbs = [{
      text: i18n._t('CampaignAdmin.CAMPAIGN', 'Campaigns'),
      href: this.props.sectionConfig.url,
    }];
    breadcrumbs.push({
      text: this.props.record.Name,
      href: `${this.props.sectionConfig.url}/set/${this.props.campaignId}/show`,
    });

    this.props.breadcrumbsActions.setBreadcrumbs(breadcrumbs);
  }

  getSelectedItem() {
    const itemId = this.props.campaign.changeSetItemId;
    const items = this.getItems() || [];
    let selected = null;

    if (itemId) {
      selected = items.find(item => itemId === item.ID);
    }

    // If there's no user-selected item, select the first item in the first
    // non-empty display group
    if (!selected) {
      const groups = this.groupItemsForSet();

      // Find the first group name that has at least one item
      const nonEmptyGroupName = Object.keys(groups).find(name =>
        groups[name] && groups[name].items.length > 0
      );

      selected = nonEmptyGroupName ? groups[nonEmptyGroupName].items[0] : null;
    }

    return selected;
  }

  /**
   * @return {array}
   */
  getMoreActions() {
    const selectedItem = this.getSelectedItem();

    if (!selectedItem) {
      return null;
    }

    const referencedBy = selectedItem._links && selectedItem._links.referenced_by;
    const requiredByNum = (referencedBy && referencedBy.length) || 0;
    const unremoveableInfoText = i18n._t(
        'CampaignAdmin.UNREMOVEABLE_INFO',
        'Required by {number} item(s), and cannot be removed directly.'
      );
    const removeAction = selectedItem.Added === 'explicitly'
      ? (
        <button
          key="remove_action"
          className="btn btn-secondary action"
          onClick={this.handleRemoveItem}
        >
          Remove
        </button>
      )
      : (
        <p key="unremoveable_info" className="alert alert-info campaign-admin__unremoveable-item">
          <span className="font-icon-link" />
          {i18n.inject(unremoveableInfoText, { number: requiredByNum })}
        </p>
      );

    return [
      removeAction,
    ];
  }

  /**
   * @return {array}
   */
  getItems() {
    if (this.props.record && this.props.record._embedded) {
      return this.props.record._embedded.items;
    }

    return null;
  }

  getPlaceholderGroups() {
    const groups = {};

    if (this.props.record && this.props.record.placeholderGroups) {
      this.props.record.placeholderGroups.forEach((group) => {
        groups[group.baseClass] = { ...group };
        groups[group.baseClass].items = [...group.items];
      });
    }

    return groups;
  }

  /**
   * Group items for changeset display
   *
   * @return {object}
   */
  groupItemsForSet() {
    const groups = this.getPlaceholderGroups();
    const items = this.getItems();
    if (!items) {
      return groups;
    }

    // group by whatever
    items.forEach(item => {
      // Create new group if needed
      const classname = item.BaseClass;

      if (!groups[classname]) {
        groups[classname] = {
          singular: item.Singular,
          plural: item.Plural,
          items: [],
        };
      }

      // Push items
      groups[classname].items.push(item);
    });

    return groups;
  }

  /**
   * @return {boolean}
   */
  isRecordLoaded(props = this.props) {
    return Object.keys(props.record).length !== 0;
  }

  handleRemoveItem() {
    if (typeof this.props.onRemoveCampaignItem === 'function') {
      this.props.onRemoveCampaignItem(this.props.campaignId, this.getSelectedItem().ID);
    }
  }

  /**
   * Callback for items being clicked on
   *
   * @param {object} event
   * @param {number} itemId
   */
  handleItemSelected(event, itemId) {
    this.props.campaignActions.selectChangeSetItem(itemId);
  }

  handleCloseItem() {
    this.props.campaignActions.selectChangeSetItem(null);
  }

  handlePublish(e) {
    e.preventDefault();

    const msg = i18n._t('CampaignAdmin.PUBLISH_CAMPAIGN_CONFIRM', 'Are you sure you want to publish this campaign?');

    // eslint-disable-next-line no-alert
    if (window.confirm(msg)) {
      this.props.campaignActions.publishCampaign(
        this.props.publishApi,
        this.props.treeClass,
        this.props.campaignId
      );
    }
  }

  renderButtonToolbar() {
    const items = this.getItems();

    let actionProps = null;

    if (!items || items.length === 0) {
      actionProps = {
        title: i18n._t('CampaignAdmin.PUBLISHCAMPAIGN', 'Publish campaign'),
        buttonStyle: 'secondary-outline',
        icon: 'rocket',
        disabled: true,
      };
    } else if (this.props.record.State === 'open') {
      actionProps = {
        title: i18n._t('CampaignAdmin.PUBLISHCAMPAIGN', 'Publish campaign'),
        buttonStyle: 'primary',
        loading: this.props.campaign.isPublishing,
        onClick: this.handlePublish,
        icon: 'rocket',
      };
    }

    if (!actionProps) {
      return null;
    }
    return (
      <div className="btn-toolbar">
        <FormAction {...actionProps} />
      </div>
    );
  }

  renderPreview(itemLinks, itemId) {
    let preview = null;
    const previewClasses = classnames([
      'flexbox-area-grow',
      'fill-height',
      'preview',
      'campaign-admin__campaign-preview',
      'campaign-admin__campaign-preview--empty',
    ]);

    if (this.state.loading) {
      preview = (
        <div className={previewClasses}>
          <p>{i18n._t('CampaignAdmin.LOADING', 'Loading...')}</p>
        </div>
      );
    } else if (!this.getItems() || this.getItems().length === 0) {
      const message = i18n._t(
        'CampaignAdmin.SELECTFROMSECTIONS',
        'Select "Add to Campaign" from pages, files, and other admin sections with content types'
      );
      preview = (
        <div className={previewClasses}>
          <h2 className="campaign-admin__empty-heading">Getting started</h2>
          <p className="campaign-admin__empty-info">
            {message}
          </p>
        </div>
      );
    } else {
      preview = (
        <Preview
          itemLinks={itemLinks}
          itemId={itemId}
          onBack={this.handleCloseItem}
          moreActions={this.getMoreActions()}
        />
      );
    }

    return preview;
  }

  /**
   * Renders a list of items in a Campaign.
   *
   * @return object
   */
  render() {
    let itemId = this.props.campaign.changeSetItemId;

    let itemLinks = null;
    const selectedClass = (!itemId) ? 'campaign-admin__campaign--hide-preview' : '';
    const campaignId = this.props.campaignId;
    const campaign = this.props.record;
    const newItem = this.props.newItem;

    // Trigger different layout when preview is enabled
    const itemGroups = this.groupItemsForSet();

    // Get items in this set
    const accordionBlocks = [];

    const selectedItem = this.getSelectedItem();
    const selectedItemsLinkedTo = (
        selectedItem && selectedItem._links && selectedItem._links.references
      ) || [];
    const selectedItemsLinkedFrom = (
        selectedItem && selectedItem._links && selectedItem._links.referenced_by
      ) || [];

    Object.keys(itemGroups).forEach(className => {
      const group = itemGroups[className];
      const groupCount = group.items.length;

      const listGroupItems = [];
      const title = `
        ${groupCount === 0 ? '' : groupCount}
        ${groupCount === 1 ? group.singular : group.plural}
      `;
      const groupid = `Set_${campaignId}_Group_${className}`;

      // Create items for this group
      group.items.forEach((item, index) => {
        // Auto-select first item
        if (!itemId) {
          itemId = item.ID;
        }
        const selected = (itemId === item.ID);

        // Check links
        if (selected && item._links) {
          itemLinks = item._links;
        }

        // Add extra css class for published items
        const itemClassNames = [];
        if (item.ChangeType === 'none' || campaign.State === 'published') {
          itemClassNames.push('list-group-item--inactive');
        }
        if (selected) {
          itemClassNames.push('active');
        }

        let isLinked = !!selectedItemsLinkedTo.find(
          linkToObj => linkToObj.ChangeSetItemID === parseInt(item.ID, 10));

        isLinked = isLinked || selectedItemsLinkedFrom.find(linkFromObj => (
            linkFromObj.ChangeSetItemID === item.ID
          ));

        listGroupItems.push(
          <ListGroupItem
            key={item.ID || index}
            className={itemClassNames.join(' ')}
            onClick={this.handleItemSelected}
            onClickArg={item.ID}
          >
            <CampaignAdminItem
              item={item}
              campaign={this.props.record}
              selected={selected}
              isLinked={isLinked}
            />
          </ListGroupItem>
        );
      });

      const wrapperClassnames = classnames('list-group-wrapper', {
        'list-group-wrapper--empty': listGroupItems.length === 0,
      });

      // Merge into group
      accordionBlocks.push(
        <div className={wrapperClassnames} key={groupid}>
          <AccordionBlock groupid={groupid} title={title}>
            {
              listGroupItems.length > 0
                ? listGroupItems
                : <p className="list-group-item">{group.noItemsText}</p>
            }
          </AccordionBlock>
        </div>
      );
    });

    const newItemInfo = newItem
      ? (
        <p className="alert alert-success alert--no-border" role="alert">
          {i18n._t(
            'CampaignAdmin.NEWCAMPAIGNSUCCESS',
            'Nice one! You have successfully created a campaign.'
          )}
        </p>
      )
      : null;

    const body = <Accordion>{accordionBlocks}</Accordion>;
    const bodyClass = [
      'panel', 'panel--padded', 'panel--scrollable', 'flexbox-area-grow',
    ];

    const loading = this.props.loading && [
      <div key="overlay" className="cms-content-loading-overlay ui-widget-overlay-light" />,
      <div key="spinner" className="cms-content-loading-spinner" />,
    ];

    return (
      <div className={`fill-width campaign-admin__campaign ${selectedClass}`}>
        {loading}
        <div className="fill-height campaign-admin__campaign-items" aria-expanded="true">
          <Toolbar showBackButton onBackButtonClick={this.props.onBackButtonClick}>
            <Breadcrumb multiline />
          </Toolbar>
          {newItemInfo}
          <div className={bodyClass.join(' ')}>
            {body}
          </div>
          <div className="toolbar toolbar--south">
            {this.renderButtonToolbar()}
          </div>
        </div>
        {this.renderPreview(itemLinks, itemId)}
      </div>
    );
  }
}

CampaignAdminList.propTypes = {
  campaign: React.PropTypes.shape({
    isPublishing: React.PropTypes.bool,
    changeSetItemId: React.PropTypes.number,
  }),
  publishApi: React.PropTypes.func.isRequired,
  record: React.PropTypes.object.isRequired,
  sectionConfig: React.PropTypes.object.isRequired,
  onBackButtonClick: React.PropTypes.func,
  onRemoveCampaignItem: React.PropTypes.func,
  breadcrumbsActions: React.PropTypes.object.isRequired,
  campaignActions: React.PropTypes.object.isRequired,
  recordActions: React.PropTypes.object.isRequired,
};

CampaignAdminList.defaultProps = {

};

function mapStateToProps(state, ownProps) {
  const treeClass = ownProps.sectionConfig.treeClass;
  const id = parseInt(ownProps.campaignId, 10);
  const records = state.records[treeClass] || [];
  // Find record specific to this item
  const record = records.find(item => item.ID === id) || {};

  return {
    config: state.config,
    record,
    campaign: state.campaign,
    treeClass,
    newItem: state.campaign.newItem,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    breadcrumbsActions: bindActionCreators(breadcrumbsActions, dispatch),
    recordActions: bindActionCreators(recordActions, dispatch),
    campaignActions: bindActionCreators(campaignActions, dispatch),
  };
}

export { CampaignAdminList as Component };
export default connect(mapStateToProps, mapDispatchToProps)(CampaignAdminList);
