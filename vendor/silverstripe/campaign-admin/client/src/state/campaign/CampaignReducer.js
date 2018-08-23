/* global window */
import deepFreeze from 'deep-freeze-strict';
import ACTION_TYPES from './CampaignActionTypes';

// retrieve showMessage state from user's localStorage
const showMessage = window.localStorage.getItem('campaign.showMessage');
const initialState = deepFreeze({
  campaignId: null,
  changeSetItemId: null,
  isPublishing: false,
  view: null,
  newItem: null,
  showMessage: showMessage === null,
});

function reducer(state = initialState, action) {
  switch (action.type) {
    case ACTION_TYPES.SET_CAMPAIGN_SELECTED_CHANGESETITEM:
      return deepFreeze(Object.assign({}, state, {
        changeSetItemId: action.payload.changeSetItemId,
      }));

    case ACTION_TYPES.SET_CAMPAIGN_ACTIVE_CHANGESET:
      return deepFreeze(Object.assign({}, state, {
        campaignId: action.payload.campaignId,
        view: action.payload.view,
        changeSetItemId: null,
      }));

    case ACTION_TYPES.PUBLISH_CAMPAIGN_REQUEST:
      return deepFreeze(Object.assign({}, state, {
        isPublishing: true,
      }));

    case ACTION_TYPES.PUBLISH_CAMPAIGN_SUCCESS:
    case ACTION_TYPES.PUBLISH_CAMPAIGN_FAILURE:
      return deepFreeze(Object.assign({}, state, {
        isPublishing: false,
      }));

    case ACTION_TYPES.SET_NEW_CAMPAIGN:
      return deepFreeze({
        ...state,
        newItem: action.payload.newItem,
      });

    case ACTION_TYPES.SET_SHOW_MESSAGE:
      return deepFreeze({
        ...state,
        showMessage: action.payload.show,
      });
    default:
      return state;
  }
}

export default reducer;
