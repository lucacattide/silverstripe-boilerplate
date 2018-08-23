/* global jest, describe, beforeEach, it, expect */

jest.mock('react-bootstrap-ss');

import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import CampaignAdminItem from '../CampaignAdminItem';

describe('CampaignAdminItem', () => {
  let props = null;

  beforeEach(() => {
    props = {
      campaign: {},
      item: { ID: 1 },
    };
  });

  describe('Links', () => {
    let cmp = null;
    let links = null;

    beforeEach(() => {
      cmp = ReactTestUtils.renderIntoDocument(
        <CampaignAdminItem {...props} />
      );
      links = ReactTestUtils
        .scryRenderedDOMComponentsWithClass(cmp, 'campaign-admin__item-links');
    });

    it('should not show link icon by default', () => {
      expect(links).toHaveLength(0);
    });

    it('should show link icon when the item is being from the selected item', () => {
      props.isLinked = true;
      cmp = ReactTestUtils.renderIntoDocument(
        <CampaignAdminItem {...props} />
      );
      links = ReactTestUtils
        .scryRenderedDOMComponentsWithClass(cmp, 'campaign-admin__item-links');

      expect(links).toHaveLength(1);
    });

    it('should show link icon when the item is selected and have links to other items', () => {
      props.isLinked = false;
      props.selected = true;
      props.item._links = {
        references: [
          { ID: 2 },
          { ID: 3 },
          { ID: 4 },
        ],
      };

      cmp = ReactTestUtils.renderIntoDocument(
        <CampaignAdminItem {...props} />
      );
      links = ReactTestUtils
        .scryRenderedDOMComponentsWithClass(cmp, 'campaign-admin__item-links');
      expect(links).toHaveLength(1);
    });

    it('should show correct link to information in the tooltip', () => {
      props.item._links = {
        references: [
          { ID: 2 },
        ],
      };

      cmp = ReactTestUtils.renderIntoDocument(
        <CampaignAdminItem {...props} />
      );
      expect(cmp.getReferToTooltipText()).toEqual('Requires one item(s)');
      expect(cmp.getReferredByTooltipText()).toEqual('Required by zero item(s)');

      props.item._links = {
        references: [
          { ID: 2 },
          { ID: 3 },
          { ID: 4 },
          { ID: 4 },
          { ID: 5 },
          { ID: 7 },
          { ID: 8 },
          { ID: 9 },
          { ID: 10 },
          { ID: 11 },
        ],
      };

      cmp = ReactTestUtils.renderIntoDocument(
        <CampaignAdminItem {...props} />
      );
      expect(cmp.getReferToTooltipText()).toEqual('Requires 10 item(s)');
    });

    it('should show correct linked by information in the tooltip', () => {
      props.item._links = {
        referenced_by: [
          { ObjectId: 2 },
        ],
      };

      cmp = ReactTestUtils.renderIntoDocument(
        <CampaignAdminItem {...props} />
      );
      expect(cmp.getReferToTooltipText()).toEqual('Requires zero item(s)');
      expect(cmp.getReferredByTooltipText()).toEqual('Required by one item(s)');

      props.item._links = {
        referenced_by: [
          { ChangeSetItemID: 2 },
          { ChangeSetItemID: 3 },
          { ChangeSetItemID: 4 },
        ],
      };

      cmp = ReactTestUtils.renderIntoDocument(
        <CampaignAdminItem {...props} />
      );
      expect(cmp.getReferredByTooltipText()).toEqual('Required by three item(s)');
    });

    it('should show correct link to and linked by information in the tooltip', () => {
      props.item._links = {
        references: [
          { ID: 5 },
        ],
        referenced_by: [
          { ChangeSetItemID: 2 },
          { ChangeSetItemID: 3 },
          { ChangeSetItemID: 4 },
        ],
      };

      cmp = ReactTestUtils.renderIntoDocument(
        <CampaignAdminItem {...props} />
      );
      expect(cmp.getReferToTooltipText()).toEqual('Requires one item(s)');
      expect(cmp.getReferredByTooltipText()).toEqual('Required by three item(s)');
    });
  });
});
