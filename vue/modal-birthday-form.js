/*jshint esversion: 9 */

const defaultTemplateThumb = 'https://cdn-icons-png.flaticon.com/256/8288/8288255.png';

export default {
  data() {
    return {
      form: {
        username: null,
        template: null,
        enabled: true
      },
      isEdit: false,
      modalShown: false,
    };
  },
  components: {
    'v-select': VueSelect.VueSelect,
  },
  mounted() {
    this.$root.$on('bv::modal::shown', (bvEvent, modalId) => {
      if (modalId === 'modal-birthday-form') {
        this.modalShown = true;
        if (this.$refs['modal-form'])
          this.$refs['modal-form'].reset();
        if (!this.hasUsers)
          this.loadUsers();
        if (!this.hasTemplates)
          this.loadTemplates();
      }
    });
  },
  computed: {
    ...Vuex.mapGetters({
      endpoint: 'appStore/getEndpoint',

      modalData: 'birthdayStore/getModalData',
      saveBirthdayResult: 'birthdayStore/getSaveBirthdayResult',
      savingBirthday: 'birthdayStore/getSavingBirthday',
      errorSaveBirthday: 'birthdayStore/getErrorSaveBirthday',

      users: 'userStore/getCachedUsers',
      loadingUsers: 'userStore/getLoadingUsers',
      needLogin: 'userStore/getNeedLogin',

      loadingTemplates: 'templateStore/loadingTemplates',
      getCachedTemplates: 'templateStore/getCachedTemplates',
    }),
    templates() {
      return this.getCachedTemplates(true) || [];
    },
    allDataLoaded() {
      return !this.loadingUsers && !this.loadingTemplates;
    },
    hasUsers() {
      return Array.isArray(this.users) && this.users.length > 0;
    },
    hasTemplates() {
      return Array.isArray(this.templates) && this.templates.length > 0;
    },
    formValid() {
      const modalForm = this.$refs['modal-form'];
      return this.modalShown && this.form.username && modalForm.flags.valid;
    },
    errorAction() {
      if (this.needLogin)
        return this.$sessionTimeout;
      return this.errorSaveBirthday || '';
    },
  },
  watch: {
    modalData(data) {
      if (data) {
        this.isEdit = true;
        this.form = { id: data.id, username: data.username, enabled: data.enabled, template: data.template };
        this.$bvModal.show('modal-birthday-form');
      }
    },
    saveBirthdayResult(data) {
      if (!data)
        return;

      if (this.isEdit)
        this.setToastMessage(this.$root.$t('modal-birthday-form.updated', this.form));
      else
        this.setToastMessage(this.$root.$t('modal-birthday-form.created', { username: this.form.username, id: data.id }));

      //reset validate
      this.$refs['modal-form'].reset();
      this.$bvModal.hide('modal-birthday-form');
      this.isEdit = false;

      //reset form
      this.resetForm();
    },
  },
  methods: {
    ...Vuex.mapActions({
      setToastMessage: 'appStore/setToastMessage',

      setNeedLogin: 'userStore/setNeedLogin',
      loadUsers: 'userStore/loadUsers',

      saveBirthday: 'birthdayStore/saveBirthday',
      setErrorSaveBirthday: 'birthdayStore/setErrorSaveBirthday',
      loadTemplates: 'templateStore/loadTemplates',
    }),
    resetForm() {
      this.form = { id: null, username: null, enabled: true, template: null };
      this.setErrorSaveBirthday(null);
    },
    handleOk(bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault();

      this.$refs['modal-form'].validate().then(success => {
        if (!success)
          return;

        this.setNeedLogin(null);
        this.saveBirthday(this.form);
      });
    },
    onHidden() {
      this.isEdit = false;
      this.resetForm();
    },
    replaceDefault(e) {
      var isMan = (e.target.getAttribute('data-gender') || '').toLowerCase() === 'nam';
      e.target.src = isMan ? this.$defaultImageMan : this.$defaultImageWoman;
    },
    getDefaultAvatar(gender) {
      var isMan = (gender || '').toLowerCase() === 'nam';
      return isMan ? this.$defaultImageMan : this.$defaultImageWoman;
    },
    replaceDefaultTemplate(e) {
      e.target.src = defaultTemplateThumb;
    },
    onHide(bvModalEvt) {
      if (!bvModalEvt.defaultPrevented)
        this.modalShown = false;

      if (this.savingBirthday)
        bvModalEvt.preventDefault();
    },
  }
};
