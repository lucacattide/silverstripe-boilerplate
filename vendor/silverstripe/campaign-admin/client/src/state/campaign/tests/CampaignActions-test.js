/* global jest, jasmine, describe, it, expect, beforeEach */

import * as actions from '../CampaignActions';
import ACTION_TYPES from '../CampaignActionTypes';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';


describe('CampaignActions', () => {
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);

  describe('removeCampaignItems()', () => {
    it('should create 2 actions, request and success, when resolved', () => {
      const store = mockStore({});
      const removeItemApi = () => Promise.resolve();
      const expectedActions = [
        {
          type: ACTION_TYPES.REMOVE_CAMPAIGN_ITEM_REQUEST,
          payload: { campaignId: 1, itemId: 2 },
        },
        {
          type: ACTION_TYPES.REMOVE_CAMPAIGN_ITEM_SUCCESS,
          payload: { campaignId: 1, itemId: 2 },
        },
      ];

      return store.dispatch(
        actions.removeCampaignItem(removeItemApi, 1, 2)
      ).then(() => {
        // return of async actions
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it('should create 2 actions, request and failure, when rejected', () => {
      const store = mockStore({});
      const removeItemApi = () => new Promise((resolve, reject) => {
        reject(null);
      });
      const expectedActions = [
        {
          type: ACTION_TYPES.REMOVE_CAMPAIGN_ITEM_REQUEST,
          payload: { campaignId: 1, itemId: 2 },
        },
        {
          type: ACTION_TYPES.REMOVE_CAMPAIGN_ITEM_FAILURE,
          payload: { error: null },
        },
      ];

      return store.dispatch(
        actions.removeCampaignItem(removeItemApi, 1, 2)
      ).then(() => {
        // return of async actions
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });
});
