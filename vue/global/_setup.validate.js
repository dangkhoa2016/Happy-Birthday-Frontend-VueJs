/*jshint esversion: 9 */

(async () => {
  const { extend, } = window.VeeValidate;

  const { required, min } = window.VeeValidateRules;
  extend('required', required);
  extend('min', min);

  extend('required2', required);

  const isValidURL = function (str) {
    if (!str || typeof (str) !== 'string')
      return false;

    var res = str.match(/((http(s)?:\/\/.)|(www\.))[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&/=]*)/);
    return (res !== null);
  };

  window.isValidURL = isValidURL;

  extend('url', {
    ...required,
    validate: value => {
      if (!value)
        return true;
      return isValidURL(value);
    },
  });

  extend('avatar', {
    ...required,
    validate: value => {
      if (!value)
        return true;
      return isValidURL(value);
    }
  });

  const i18n = window.i18n;

  VeeValidate.configure({
    // this will be used to generate messages.
    defaultMessage: (field, values) => {
      // values._field_ = i18n.t(`fields.${field}`);
      return i18n.t(`validations.messages.${values._rule_}`, values);
    }
  });

})();