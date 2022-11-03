/*jshint esversion: 9 */

const emptyForm = {
  url: null,
  auth_token: null,
};

export default {
  data() {
    return {
      form: { ...emptyForm },
      importType: ''
    };
  },
  computed: {
    ...Vuex.mapGetters({
      importWishQuotesResult: 'wishQuoteStore/getImportWishQuotesResult',
      importingWishQuotes: 'wishQuoteStore/getImportingWishQuotes',
      errorImportWishQuotes: 'wishQuoteStore/getErrorImportWishQuotes',
      needLoginWishQuote: 'wishQuoteStore/getNeedLogin',
      showModalImportWishQuotes: 'wishQuoteStore/getShowModalImport',

      importTemplatesResult: 'templateStore/getImportTemplatesResult',
      importingTemplates: 'templateStore/getImportingTemplates',
      errorImportTemplates: 'templateStore/getErrorImportTemplates',
      needLoginTemplate: 'templateStore/getNeedLogin',
      showModalImportTemplates: 'templateStore/getShowModalImport',

      importUsersResult: 'userStore/getImportUsersResult',
      importingUsers: 'userStore/getImportingUsers',
      errorImportUsers: 'userStore/getErrorImportUsers',
      needLoginUser: 'userStore/getNeedLogin',
      showModalImportUsers: 'userStore/getShowModalImport',

      importBirthdaysResult: 'birthdayStore/getImportBirthdaysResult',
      importingBirthdays: 'birthdayStore/getImportingBirthdays',
      errorImportBirthdays: 'birthdayStore/getErrorImportBirthdays',
      needLoginBirthday: 'birthdayStore/getNeedLogin',
      showModalImportBirthdays: 'birthdayStore/getShowModalImport',
    }),
    getNeedLogin() {
      if (this.importType)
        return this[`needLogin${this.importType}`];
    },
    errorAction() {
      if (this.getNeedLogin)
        return this.$sessionTimeout;
      return this[`errorImport${this.importType}s`] || '';
    },
    formValid() {
      const modalForm = this.$refs['modal-form'];
      return this.form.url && modalForm && modalForm.flags.valid;
    },
    headerName() {
      switch (this.importType) {
        case 'WishQuote':
          return this.$root.$t('modal-import.wish_quotes');
        case 'Template':
          return this.$root.$t('modal-import.templates');
        case 'User':
          return this.$root.$t('modal-import.users');
        case 'Birthday':
          return this.$root.$t('modal-import.birthdays');
      }
    },
    importing() {
      if (this.importType)
        return this[`importing${this.importType}s`];
    },
  },
  watch: {
    showModalImportWishQuotes(data) {
      if (data)
        this.showModalImport('WishQuote');
    },
    showModalImportTemplates(data) {
      if (data)
        this.showModalImport('Template');
    },
    showModalImportUsers(data) {
      if (data)
        this.showModalImport('User');
    },
    showModalImportBirthdays(data) {
      if (data)
        this.showModalImport('Birthday');
    },

    needLoginWishQuote(val) {
      this.needLogin(val);
    },
    needLoginTemplate(val) {
      this.needLogin(val);
    },
    needLoginUser(val) {
      this.needLogin(val);
    },
    needLoginBirthday(val) {
      this.needLogin(val);
    },

    importWishQuotesResult(data) {
      this.importResult(data);
    },
    importTemplatesResult(data) {
      this.importResult(data);
    },
    importUsersResult(data) {
      this.importResult(data);
    },
    importBirthdaysResult(data) {
      this.importResult(data);
    },
  },
  methods: {
    ...Vuex.mapActions({
      setToastMessage: 'appStore/setToastMessage',

      setErrorImportWishQuotes: 'wishQuoteStore/setErrorImportWishQuotes',
      setWishQuoteRefreshList: 'wishQuoteStore/setRefreshList',
      importWishQuotes: 'wishQuoteStore/importWishQuotes',
      setShowModalImportWishQuotes: 'wishQuoteStore/setShowModalImport',
      setNeedLoginWishQuote: 'wishQuoteStore/setNeedLogin',

      setErrorImportTemplates: 'templateStore/setErrorImportTemplates',
      setTemplateRefreshList: 'templateStore/setRefreshList',
      loadTemplates: 'templateStore/loadTemplates',
      importTemplates: 'templateStore/importTemplates',
      setShowModalImportTemplates: 'templateStore/setShowModalImport',
      setNeedLoginTemplate: 'templateStore/setNeedLogin',

      setErrorImportUsers: 'userStore/setErrorImportUsers',
      setUserRefreshList: 'userStore/setRefreshList',
      loadUsers: 'userStore/loadUsers',
      importUsers: 'userStore/importUsers',
      setShowModalImportUsers: 'userStore/setShowModalImport',
      setNeedLoginUser: 'userStore/setNeedLogin',

      setErrorImportBirthdays: 'birthdayStore/setErrorImportBirthdays',
      setBirthdayRefreshList: 'birthdayStore/setRefreshList',
      loadBirthdays: 'birthdayStore/loadBirthdays',
      importBirthdays: 'birthdayStore/importBirthdays',
      setShowModalImportBirthdays: 'birthdayStore/setShowModalImport',
      setNeedLoginBirthday: 'birthdayStore/setNeedLogin',
    }),
    importResult(data) {
      if (!data)
        return;

      this.$bvModal.hide('modal-import');

      this[`set${this.importType}RefreshList`](true);
      this.setToastMessage(this.$root.$t('modal-import.imported', { message: data.message, header_name: this.headerName }));
    },
    showModalImport(type) {
      this.importType = type;
      this.$bvModal.show('modal-import');
    },
    resetForm() {
      this.form = { ...emptyForm };
      this[`setErrorImport${this.importType}s`](null);
    },
    handleOk(bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault();

      this.$refs['modal-form'].validate().then(success => {
        if (!success)
          return;

        this[`import${this.importType}s`](this.form);
      });
    },
    onHidden() {
      this[`set${this.importType}RefreshList`](false);
      this[`setShowModalImport${this.importType}s`](null);

      //reset form
      this.resetForm();
    },
    onShown() {
      document.getElementById('txt-url').focus();
    },
    onHide(bvModalEvt) {
      if (this.importing) {
        // Prevent modal from closing
        bvModalEvt.preventDefault();
        return;
      }
      this[`setNeedLogin${this.importType}`](false);
    },
    needLogin(val) {
      if (val && this.importType) {
        console.log('You need to login before action.');
        // this.$router.push({ name: 'login', query: { returnTo: this.$route.fullPath } });
        this.setToastMessage(this.$sessionTimeout());
      }
    },
  }
};
