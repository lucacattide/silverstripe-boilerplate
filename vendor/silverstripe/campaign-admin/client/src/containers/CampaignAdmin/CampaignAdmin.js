/* global window */
import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router';
import getFormState from 'lib/getFormState';
import backend from 'lib/Backend';
import * as campaignActions from 'state/campaign/CampaignActions';
import * as breadcrumbsActions from 'state/breadcrumbs/BreadcrumbsActions';
import * as recordActions from 'state/records/RecordsActions';
import Breadcrumb from 'components/Breadcrumb/Breadcrumb';
import FormAction from 'components/FormAction/FormAction';
import i18n from 'i18n';
import Toolbar from 'components/Toolbar/Toolbar';
import FormBuilderLoader from 'containers/FormBuilderLoader/FormBuilderLoader';
import CampaignAdminList from './CampaignAdminList';
import IntroScreen from 'components/IntroScreen/IntroScreen';

const sectionConfigKey = 'SilverStripe\\CampaignAdmin\\CampaignAdmin';

class CampaignAdmin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
    };

    const defaultData = { SecurityID: props.securityId };
    this.publishApi = backend.createEndpointFetcher({
      ...props.sectionConfig.publishEndpoint,
      defaultData,
      payloadSchema: {
        id: { urlReplacement: ':id', remove: true },
      },
    });

    this.removeCampaignItemApi = backend.createEndpointFetcher({
      ...props.sectionConfig.removeCampaignItemEndpoint,
      defaultData,
      payloadSchema: {
        id: { urlReplacement: ':id', remove: true },
        itemId: { urlReplacement: ':itemId', remove: true },
      },
    });

    // Bind
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.handleCreateCampaignSubmit = this.handleCreateCampaignSubmit.bind(this);
    this.handleFormAction = this.handleFormAction.bind(this);
    this.hasErrors = this.hasErrors.bind(this);
    this.handleRemoveCampaignItem = this.handleRemoveCampaignItem.bind(this);
    this.addCampaign = this.addCampaign.bind(this);
    this.handleHideMessage = this.handleHideMessage.bind(this);
    this.handleToggleMessage = this.handleToggleMessage.bind(this);
  }

  componentWillMount() {
    // Ensure default breadcrumbs are setup
    const { breadcrumbs, title, params: { view, id } } = this.props;
    if (breadcrumbs.length === 0) {
      this.setBreadcrumbs(view, id, title);
    }
  }

  componentWillReceiveProps(props) {
    const { title, params: { id, view } } = props;
    const hasChangedRoute = (
      this.props.params.id !== id ||
      this.props.params.view !== view ||
      this.props.title !== title
    );
    if (hasChangedRoute) {
      this.setBreadcrumbs(view, id, title);
    }
  }

  setBreadcrumbs(view, id, title) {
    // Set root breadcrumb
    const breadcrumbs = [{
      text: i18n._t('CampaignAdmin.CAMPAIGN', 'Campaigns'),
      href: this.props.sectionConfig.url,
    }];
    switch (view) {
      case 'show':
        // NOOP - Lazy loaded in CampaignAdminList.js
        break;
      case 'edit':
        // @todo - Lazy load in FormBuilderLoader / GridField
        breadcrumbs.push({
          text: title,
          href: this.getActionRoute(id, view),
        });
        break;
      case 'create':
        breadcrumbs.push({
          text: i18n._t('CampaignAdmin.ADD_CAMPAIGN', 'Add Campaign'),
          href: this.getActionRoute(id, view),
        });
        break;
      default:
        // NOOP
        break;
    }

    this.props.breadcrumbsActions.setBreadcrumbs(breadcrumbs);
  }

  /**
   * Generate route with the given id and view
   *
   * @param {Number} id
   * @param {String} view
   * @return {String}
   */
  getActionRoute(id, view) {
    return `${this.props.sectionConfig.url}/set/${id}/${view}`;
  }

  handleBackButtonClick(event) {
    // Go back to second from last breadcrumb (where last item is current)
    if (this.props.breadcrumbs.length > 1) {
      const last = this.props.breadcrumbs[this.props.breadcrumbs.length - 2];
      if (last && last.href) {
        event.preventDefault();
        this.props.router.push(last.href);
      }
    }
  }


  /**
   * Handler for creating campaign, will redirect to edit form
   *
   * @param {object} data
   * @param {string} action
   * @param {function} submitFn
   * @returns {Promise}
   */
  handleCreateCampaignSubmit(data, action, submitFn) {
    const promise = submitFn();
    if (!promise) {
      throw new Error('Promise was not returned for submitting');
    }
    return promise
      .then((response) => {
        const hasErrors = this.hasErrors(response);
        if (action === 'action_save' && !hasErrors) {
          // open the new campaign in edit mode after save completes
          const sectionUrl = this.props.sectionConfig.url;
          const id = response.record.id;
          this.props.campaignActions.setNewItem(id);
          this.props.router.push(`${sectionUrl}/set/${id}/show`);
        }

        return response;
      });
  }

  handleFormAction(event) {
    const name = event.currentTarget.name;
    // intercept the Add to Campaign submit and open the modal dialog instead
    if (name === 'action_cancel') {
      const url = this.props.sectionConfig.url;
      this.props.router.push(url);
      event.preventDefault();
    }
  }

  /**
   * @param {number} campaignId
   * @param {number} itemId
   * @return {Promise|null}
   */
  handleRemoveCampaignItem(campaignId, itemId) {
    const fallbackMsg = `Are you sure you want to remove this item?

By removing this item all linked items will be removed unless used elsewhere.`;
    const msg = i18n._t('CampaignAdmin.REMOVE_ITEM_MESSAGE', fallbackMsg);
    // eslint-disable-next-line no-alert
    const confirmed = window.confirm(msg);

    if (!confirmed) {
      return null;
    }

    this.setState({ loading: true });
    return this.removeCampaignItem(campaignId, itemId)
      .then(this.fetchCampaignsList.bind(this))
      .then(() => this.setState({ loading: false }))
      .then(() => {
        this.props.campaignActions.selectChangeSetItem(null);
        // Workaround to hide more actions popover
        window.document.body.click();
      });
  }

  handleToggleMessage() {
    this.props.campaignActions.setShowMessage(!this.props.showMessage);
  }

  handleHideMessage() {
    this.props.campaignActions.setShowMessage(false);
  }

  removeCampaignItem(campaignId, itemId) {
    return this.props.campaignActions.removeCampaignItem(
      this.removeCampaignItemApi,
      campaignId,
      itemId
    );
  }

  fetchCampaignsList() {
    const endpoint = this.props.sectionConfig.readCampaignsEndpoint;
    const fetchURL = endpoint.url;
    return this.props.recordActions.fetchRecords(
      this.props.sectionConfig.treeClass,
      endpoint.method,
      fetchURL
    );
  }

  hasErrors(response) {
    if (response.errors && response.errors.length) {
      return true;
    }
    const state = response.state;

    if (!state) {
      return false;
    }
    // Check global messages
    if (state.messages && state.messages.find((message) => message.type !== 'good')) {
      return true;
    }
    // Find first field message
    const message = state.fields && state.fields.find((field) => field.message && field.message.type !== 'good');

    return Boolean(message);
  }

  /**
   * Hook to allow customisation of components being constructed
   * by the Campaign DetailEdit FormBuilderLoader.
   *
   * @param {Object} Custom - Component constructor.
   * @param {Object} props - Props passed from FormBuilderLoader.
   *
   * @return {Object} - Instanciated React component
   */
  campaignEditCreateFn(Custom, props) {
    const url = this.props.sectionConfig.url;

    // Route to the Campaigns index view when 'Cancel' is clicked.
    if (props.name === 'action_cancel') {
      const extendedProps = Object.assign({}, props, {
        onClick: (event) => {
          event.preventDefault();
          this.props.router.push(url);
        },
      });

      return <Custom key={props.id} {...extendedProps} />;
    }

    return <Custom key={props.id} {...props} />;
  }

  /**
   * Hook to allow customisation of components being constructed
   * by the Campaign creation FormBuilderLoader.
   *
   * @param {Object} Custom - Component constructor.
   * @param {Object} props - Props passed from FormBuilderLoader.
   *
   * @return {Object} - Instanciated React component
   */
  campaignAddCreateFn(Custom, props) {
    const url = this.props.sectionConfig.url;

    // Route to the Campaigns index view when 'Cancel' is clicked.
    if (props.name === 'action_cancel') {
      const extendedProps = Object.assign({}, props, {
        onClick: (event) => {
          event.preventDefault();
          this.props.router.push(url);
        },
      });

      return <Custom key={props.name} {...extendedProps} />;
    }

    return <Custom key={props.name} {...props} />;
  }

  /**
   * Hook to allow customisation of components being constructed
   * by the Campaign list FormBuilderLoader.
   *
   * @param {Object} Custom - Component constructor.
   * @param {Object} props - Props passed from FormBuilderLoader.
   *
   * @return object - Instanciated React component
   */
  campaignListCreateFn(Custom, props) {
    const sectionUrl = this.props.sectionConfig.url;
    const typeUrlParam = 'set';

    if (props.schemaComponent === 'GridField') {
      const extendedProps = Object.assign({}, props, {
        data: Object.assign({}, props.data, {
          onDrillDown: (event, record) => {
            this.props.router.push(`${sectionUrl}/${typeUrlParam}/${record.ID}/show`);
          },
          onEditRecord: (event, id) => {
            this.props.router.push(`${sectionUrl}/${typeUrlParam}/${id}/edit`);
          },
        }),
      });

      return <Custom key={extendedProps.name} {...extendedProps} />;
    }

    return <Custom key={props.name} {...props} />;
  }

  addCampaign() {
    const path = this.getActionRoute(0, 'create');
    this.props.router.push(path);
  }

  /**
   * Renders the Detail Edit Form for a Campaign.
   */
  renderDetailEditView() {
    if (this.props.params.id <= 0) {
      return this.renderCreateView();
    }
    const baseSchemaUrl = this.props.sectionConfig.form.campaignEditForm.schemaUrl;
    const schemaUrl = `${baseSchemaUrl}/${this.props.params.id}`;

    return (
      <div className="fill-height">
        <Toolbar showBackButton onBackButtonClick={this.handleBackButtonClick}>
          <Breadcrumb multiline />
        </Toolbar>

        <div className="panel panel--padded panel--scrollable flexbox-area-grow form--inline">
          <FormBuilderLoader
            onAction={this.handleFormAction}
            schemaUrl={schemaUrl}
            identifier="Campaign.EditView"
          />
        </div>
      </div>
    );
  }

  /**
   * Render the view for creating a new Campaign.
   */
  renderCreateView() {
    const schemaUrl = this.props.sectionConfig.form.campaignCreateForm.schemaUrl;
    return (
      <div className="fill-height">
        <Toolbar showBackButton onBackButtonClick={this.handleBackButtonClick}>
          <Breadcrumb multiline />
        </Toolbar>
        <div className="panel panel--padded panel--scrollable flexbox-area-grow form--inline">
          <FormBuilderLoader
            onSubmit={this.handleCreateCampaignSubmit}
            onAction={this.handleFormAction}
            schemaUrl={schemaUrl}
            identifier="Campaign.CreateView"
          />
        </div>
      </div>
    );
  }

  /**
   * Renders the default view which displays a list of Campaigns.
   *
   * @return object
   */
  renderIndexView() {
    const schemaUrl = this.props.sectionConfig.form.EditForm.schemaUrl;
    const formActionProps = {
      title: i18n._t('CampaignAdmin.ADDCAMPAIGN'),
      icon: 'plus',
      extraClass: 'btn-primary',
      onClick: this.addCampaign,
    };
    const formBuilderProps = {
      createFn: this.campaignListCreateFn.bind(this),
      schemaUrl,
      identifier: 'Campaign.IndexView',
    };

    return (
      <div className="fill-height" aria-expanded="true">
        <Toolbar>
          <Breadcrumb multiline />
        </Toolbar>
        <IntroScreen show={this.props.showMessage} onClose={this.handleHideMessage} />
        <div className="panel panel--padded panel--scrollable flexbox-area-grow">
          <div className="toolbar toolbar--content">
            <div className="btn-toolbar fill-width">
              <div className="btn-toolbar__left-panel flexbox-area-grow">
                <FormAction {...formActionProps} />
              </div>
              <div className="btn-toolbar__left-panel">
                <a
                  role="button"
                  tabIndex={0}
                  onClick={this.handleToggleMessage}
                  className="btn btn-secondary font-icon-white-question btn--icon-xl"
                />
              </div>
            </div>
          </div>
          <FormBuilderLoader {...formBuilderProps} />
        </div>
      </div>
    );
  }

  /**
   * Renders a list of items in a Campaign.
   *
   * @return object
   */
  renderItemListView() {
    const props = {
      sectionConfig: this.props.sectionConfig,
      campaignId: this.props.params.id,
      itemListViewEndpoint: this.props.sectionConfig.itemListViewEndpoint,
      publishApi: this.publishApi,
      onBackButtonClick: this.handleBackButtonClick,
      onRemoveCampaignItem: this.handleRemoveCampaignItem,
      loading: this.state.loading,
    };

    return (
      <CampaignAdminList {...props} />
    );
  }

  render() {
    let view = null;

    switch (this.props.params.view) {
      case 'show':
        view = this.renderItemListView();
        break;
      case 'edit':
        view = this.renderDetailEditView();
        break;
      case 'create':
        view = this.renderCreateView();
        break;
      default:
        view = this.renderIndexView();
    }

    return view;
  }
}

CampaignAdmin.propTypes = {
  breadcrumbsActions: PropTypes.object.isRequired,
  campaignId: PropTypes.string,
  sectionConfig: PropTypes.shape({
    publishEndpoint: PropTypes.shape({
      url: PropTypes.string,
      method: PropTypes.string,
    }),
    form: PropTypes.shape({
      EditForm: PropTypes.shape({
        schemaUrl: PropTypes.string,
      }),
      campaignEditForm: PropTypes.shape({
        schemaUrl: PropTypes.string,
      }),
      campaignCreateForm: PropTypes.shape({
        schemaUrl: PropTypes.string,
      }),
    }),
  }),
  securityId: PropTypes.string.isRequired,
  view: PropTypes.string,
  params: PropTypes.shape({
    view: PropTypes.string,
    id: PropTypes.number,
  }),
  showMessage: PropTypes.bool,
};

CampaignAdmin.defaultProps = {
  sectionConfig: {},
  params: {},
  view: 'show',
  breadcrumbs: [],
};

function mapStateToProps(state, ownProps) {
  let title = null;
  const sectionConfig = state.config.sections.find((section) => (
    section.name === sectionConfigKey
  ));

  if (ownProps.params.id > 0) {
    const schemaUrl = `${sectionConfig.form.campaignEditForm.schemaUrl}/${ownProps.params.id}`;
    const schema = state.form.formSchemas[schemaUrl];
    const schemaName = schema && schema.name;
    const selector = schemaName && formValueSelector(schema.name, getFormState);
    title = selector && selector(state, 'Name');
  }

  return {
    config: state.config,
    campaignId: state.campaign.campaignId,
    view: state.campaign.view,
    breadcrumbs: state.breadcrumbs,
    sectionConfig,
    securityId: state.config.SecurityID,
    title,
    showMessage: state.campaign.showMessage,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    breadcrumbsActions: bindActionCreators(breadcrumbsActions, dispatch),
    campaignActions: bindActionCreators(campaignActions, dispatch),
    recordActions: bindActionCreators(recordActions, dispatch),
  };
}

export { CampaignAdmin as Component };

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CampaignAdmin));
