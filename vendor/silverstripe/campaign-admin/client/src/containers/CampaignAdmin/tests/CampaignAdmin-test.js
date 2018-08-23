/* global jest, describe, beforeEach, it, expect */

jest.mock('components/Breadcrumb/Breadcrumb');
jest.mock('containers/FormBuilderLoader/FormBuilderLoader', () => () => null);

import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import { Component as CampaignAdmin } from '../CampaignAdmin';

describe('CampaignAdminItem', () => {
  describe('hasErrors', () => {
    let admin = null;
    let props = null;
    beforeEach(() => {
      props = {
        sectionConfig: {
          publishEndpoint: {
            url: '/',
            method: 'get',
          },
          form: {
            EditForm: {
              schemaUrl: 'schemaEditForm',
            },
          },
        },
        breadcrumbsActions: {
          setBreadcrumbs: jest.fn(),
        },
        securityId: 'secured',
      };
      admin = ReactTestUtils.renderIntoDocument(<CampaignAdmin {...props} />);
    });
    it('detects errors in errors property', () => {
      const result = admin.hasErrors({
        errors: [
          { value: 'error' },
        ],
      });
      expect(result).toBe(true);
    });

    it('detects no errors in errors property', () => {
      const result = admin.hasErrors({
        errors: [],
      });
      expect(result).toBe(false);
    });

    it('detects errors in global messages property', () => {
      const result = admin.hasErrors({
        state: {
          messages: [
            { value: 'error' },
          ],
        },
      });
      expect(result).toBe(true);
    });

    it('detects no errors in global messages property', () => {
      const result = admin.hasErrors({
        state: {
          messages: [],
        },
      });
      expect(result).toBe(false);
    });

    it('detects errors in field state field messages', () => {
      const result = admin.hasErrors({
        state: {
          fields: [
            { name: 'ID' },
            {
              name: 'Title',
              message: { value: 'error' },
            },
          ],
        },
      });
      expect(result).toBe(true);
    });

    it('detects no errors in field state fields messages', () => {
      const result = admin.hasErrors({
        state: {
          fields: [
            { name: 'ID' },
            { name: 'Title' },
          ],
        },
      });
      expect(result).toBe(false);
    });
  });
});
