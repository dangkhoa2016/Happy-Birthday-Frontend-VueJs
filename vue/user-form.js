/*jshint esversion: 9 */

const defaultDate = new Date();
defaultDate.setHours(0, 0, 0, 0);
defaultDate.setFullYear(defaultDate.getFullYear() - 18);
const isValidURL = window.isValidURL;

export default {
  data() {
    return {
      form: {
        username: null,
        name: null,
        gender: null,
        avatar: null,
        birthday: moment(defaultDate).format('D-M-YYYY'),
        enabled: true
      },
      genders: [{
        text: 'female', value: 'Nam',
      }, {
        text: 'male', value: 'Nữ',
      }],
      isEdit: false,
    };
  },
  components: {
    'date-picker': window.DatePicker,
    'eye-icon': vueFeatherIcons.EyeIcon,
    'v-select': VueSelect.VueSelect,
  },
  computed: {
    ...Vuex.mapGetters({
      modalData: 'userStore/getModalData',
      saveUserResult: 'userStore/getSaveUserResult',
      savingUser: 'userStore/getSavingUser',
      errorSaveUser: 'userStore/getErrorSaveUser',
      needLogin: 'userStore/getNeedLogin',
    }),
    validAvatarUrl() {
      return isValidURL(this.form && this.form.avatar);
    },
    errorAction() {
      if (this.needLogin)
        return this.$sessionTimeout;
      return this.errorSaveUser || '';
    },
    formValid() {
      const modalForm = this.$refs['modal-form'];
      return this.form.username && modalForm && modalForm.flags.valid;
    },
  },
  watch: {
    modalData(data) {
      if (data) {
        this.isEdit = true;
        this.form = data;
        this.$bvModal.show('modal-user-form');
      }
    },
    saveUserResult(data) {
      if (!data)
        return;

      //reset validate
      this.$refs['modal-form'].reset();
      this.$bvModal.hide('modal-user-form');
      if (this.isEdit)
        this.setToastMessage(this.$root.$t('user-form.updated', data));
      else
        this.setToastMessage(this.$root.$t('user-form.created', data));
      this.isEdit = false;

      //reset form
      this.resetForm();
    },
  },
  methods: {
    ...Vuex.mapActions({
      loadUsers: 'userStore/loadUsers',
      setToastMessage: 'appStore/setToastMessage',
      saveUser: 'userStore/saveUser',
      setErrorSaveUser: 'userStore/setErrorSaveUser',
    }),
    resetForm() {
      this.form = {
        username: null,
        name: null,
        gender: null,
        avatar: null,
        birthday: moment(defaultDate).format('D-M-YYYY'),
        enabled: true
      };
      this.setErrorSaveUser(null);
    },
    handleOk(bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault();

      this.$refs['modal-form'].validate().then(success => {
        if (!success)
          return;

        this.saveUser(this.form);
      });
    },
    onHidden() {
      this.isEdit = false;
      this.resetForm();
      this.$refs['modal-form'].reset();
    },
    disabledBeforeTodayAndAfterAWeek(date) {
      return date > defaultDate;
    },
    onHide(bvModalEvt) {
      if (this.savingUser) {
        // Prevent modal from closing
        bvModalEvt.preventDefault();
      }
    },
    onShown() {
      document.getElementById('txt-fullname').focus();
    },
  },
};
