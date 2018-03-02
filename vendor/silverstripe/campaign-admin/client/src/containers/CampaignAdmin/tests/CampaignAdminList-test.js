/* global jest, describe, beforeEach, it, expect */

jest.mock('components/Breadcrumb/Breadcrumb');
jest.mock('state/records/RecordsActions');

import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import { Component as CampaignAdminList } from '../CampaignAdminList';

describe('CampaignAdminList', () => {
  let props = null;

  beforeEach(() => {
    props = {
      sectionConfig: {},
      itemListViewEndpoint: { url: '', method: 'POST' },
      record: {
        ID: 3,
        placeholderGroups: [
          {
            baseClass: 'SilverStripe\\CMS\\Model\\SiteTree',
            pluaral: 'Pages',
            sinular: 'Page',
            items: [],
          },
          {
            baseClass: 'SilverStripe\\Assets\\File',
            pluaral: 'Files',
            sinular: 'File',
            items: [],
          },
        ],
        _embedded: {
          items: [
          ],
        },
      },
      campaign: {},
      breadcrumbsActions: {
        setBreadcrumbs: jest.fn(),
      },
      campaignActions: {
        setNewItem: jest.fn(),
      },
      recordActions: {
        fetchRecord: jest.fn(),
      },
      publishApi: jest.fn(),
    };
  });

  describe('getSelectedItem()', () => {
    let cmp = null;

    it('should return null if there\'s no items at all', () => {
      cmp = ReactTestUtils.renderIntoDocument(<CampaignAdminList {...props} />);
      expect(cmp.getSelectedItem()).toBe(null);
    });

    it('should return the first item found if none selected by the user', () => {
      const modProps = { ...props };
      modProps.record._embedded.items = [
        {
          BaseClass: 'SilverStripe\\CMS\\Model\\SiteTree',
          Title: 'Page one',
        },
        {
          BaseClass: 'SilverStripe\\Assets\\File',
          Title: 'File one',
        },

      ];
      cmp = ReactTestUtils.renderIntoDocument(<CampaignAdminList {...modProps} />);
      expect(cmp.getSelectedItem().Title).toBe('Page one');
    });

    it('should return the first item in the firts non empty display groups', () => {
      const modProps = { ...props };
      modProps.record._embedded.items = [
        {
          BaseClass: 'SilverStripe\\Assets\\File',
          Title: 'File one',
        },

      ];
      cmp = ReactTestUtils.renderIntoDocument(<CampaignAdminList {...modProps} />);
      expect(cmp.getSelectedItem().Title).toBe('File one');
    });

    it('should return the item selected by the user', () => {
      const modProps = { ...props };
      modProps.record._embedded.items = [
        {
          BaseClass: 'SilverStripe\\CMS\\Model\\SiteTree',
          Title: 'Page one',
          ID: 3,
        },
        {
          BaseClass: 'SilverStripe\\CMS\\Model\\SiteTree',
          Title: 'Page two',
          ID: 12,
        },
        {
          BaseClass: 'SilverStripe\\Assets\\File',
          Title: 'File one',
          ID: 21,
        },

      ];
      modProps.campaign.changeSetItemId = 12;
      cmp = ReactTestUtils.renderIntoDocument(<CampaignAdminList {...modProps} />);
      expect(cmp.getSelectedItem().Title).toBe('Page two');
    });
  });
});
