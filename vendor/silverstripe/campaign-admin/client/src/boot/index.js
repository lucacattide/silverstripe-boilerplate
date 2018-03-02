/* global document */
import { withRouter } from 'react-router';
import ConfigHelpers from 'lib/Config';
import Injector from 'lib/Injector';
import reactRouteRegister from 'lib/ReactRouteRegister';
import CampaignAdmin from 'containers/CampaignAdmin/CampaignAdmin';
import CampaignReducer from 'state/campaign/CampaignReducer';
import applyConditionals from 'boot/applyConditionals';

document.addEventListener('DOMContentLoaded', () => {
  const sectionConfig = ConfigHelpers.getSection('SilverStripe\\CampaignAdmin\\CampaignAdmin');
  reactRouteRegister.add({
    path: sectionConfig.url,
    component: withRouter(CampaignAdmin),
    childRoutes: [
      { path: ':type/:id/:view', component: CampaignAdmin },
      { path: 'set/:id/:view', component: CampaignAdmin },
    ],
  });

  Injector.reducer.register('campaign', CampaignReducer);

  // Apply any injector transformations
  applyConditionals();
});
