import Injector from 'lib/Injector';

const applyConditionals = () => {
  Injector.transform(
    'add-to-campaign',
    (updater) => {
      updater.form.alterSchema(
        '*.AddToCampaign',
        (form) => {
          const toggle = form.getFieldByName('AddNewSelect');
          if (!toggle) {
            return form.getState();
          }
          const visible = form.getValue('AddNewSelect');
          return form
            .setFieldClass('NewTitle', 'show', visible)
            .setFieldClass('NewTitle', 'hide', !visible)
            .getState();
        }
      );
    }
  );
};

export default applyConditionals;
