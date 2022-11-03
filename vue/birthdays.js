/*jshint esversion: 9 */

const debounce = Vue.prototype.$debounce;
import BirthdayItem from './birthday-item.vue';

export default {
  data() {
    return {
      birthdayStatus: null,
      search: '',
      templateId: null,
      debounceSearch: '',
    };
  },
  components: {
    'refresh-cw-icon': vueFeatherIcons.RefreshCwIcon,
    'v-select': VueSelect.VueSelect,
    'server-icon': vueFeatherIcons.ServerIcon,
    'home-icon': vueFeatherIcons.HomeIcon,
    'plus-icon': vueFeatherIcons.PlusIcon,
    'birthday-item': BirthdayItem
  },
  mounted() {
    this.loadBirthdays();
    if (!this.hasTemplates)
      this.loadTemplates();
  },
  computed: {
    ...Vuex.mapGetters({
      endpoint: 'appStore/getEndpoint',

      loadingBirthdays: 'birthdayStore/getLoadingBirthdays',
      errorLoadBirthdays: 'birthdayStore/getErrorLoadBirthdays',
      deletingBirthday: 'birthdayStore/getDeletingBirthday',
      errorDeleteBirthday: 'birthdayStore/getErrorDeleteBirthday',
      errorUpdateStatusBirthday: 'birthdayStore/getErrorUpdateStatusBirthday',
      updatingStatusBirthday: 'birthdayStore/getUpdatingStatusBirthday',
      birthdayNeedLogin: 'birthdayStore/getNeedLogin',
      birthdays: 'birthdayStore/getCachedBirthdays',
      selectedBirthdayAction: 'birthdayStore/getSelectedBirthdayAction',
      refreshList: 'birthdayStore/getRefreshList',
      selectedBirthday: 'birthdayStore/getSelectedBirthday',

      userNeedLogin: 'userStore/getNeedLogin',

      getCachedTemplates: 'templateStore/getCachedTemplates',
      loadingTemplates: 'templateStore/loadingTemplates',
    }),
    hasData() {
      return Array.isArray(this.birthdays) && this.birthdays.length > 0;
    },
    templates() {
      return this.getCachedTemplates(true) || [];
    },
    hasTemplates() {
      return Array.isArray(this.templates) && this.templates.length > 0;
    },
    templateOptions() {
      return [{ name: this.$root.$t('all'), id: null }, ...this.templates];
    },
    selectedUser() {
      const { id = '', user: { username = '' } } = this.selectedBirthday || { user: {} };
      return `${username} - id: ${id}`;
    },
    errorAction() {
      if (this.birthdayNeedLogin)
        return this.$sessionTimeout;
      if (this.errorUpdateStatusBirthday === 404)
        return this.$root.$t('birthdays.not_found', { user: this.selectedUser });
      return this.errorLoadBirthdays || this.errorDeleteBirthday || this.errorUpdateStatusBirthday || '';
    },
    birthdayStatusOptions() {
      if (!Array.isArray(this.birthdays))
        return [];

      const countActive = this.birthdays.filter(b => b.enabled).length;
      const countMissingTemplate = this.birthdays.filter(b => !b.template).length;
      const countMissingUser = this.birthdays.filter(b => !b.user).length;
      return [
        { value: null, text: this.$root.$t('all') },
        { value: true, text: `${this.$root.$t('active')} [${countActive}]` },
        { value: -2, text: `${this.$root.$t('birthdays.missing_templates')} [${countMissingTemplate}]` },
        { value: -1, text: `${this.$root.$t('birthdays.missing_users')} [${countMissingUser}]` },
        { value: false, text: `${this.$root.$t('inactive')} [${this.birthdays.length - countMissingUser - countMissingTemplate - countActive}]` }
      ];
    },
    actionColor() {
      const { action } = this.selectedBirthdayAction || {};
      if (!action)
        return;

      if (action.toLowerCase() === 'delete')
        return 'danger';
      else if (action.toLowerCase() === 'enable')
        return 'info';
      else if (action.toLowerCase() === 'disable')
        return 'warning';
    },
    confirmMessage() {
      const { action } = this.selectedBirthdayAction || {};
      if (!action)
        return;

      if (action.toLowerCase() === 'delete')
        return this.$root.$t('birthdays.confirm_action', { action: this.$root.$t('action.delete').toLowerCase(), user: this.selectedUser });
      else if (action.toLowerCase() === 'enable')
        return this.$root.$t('birthdays.confirm_action', { action: this.$root.$t('action.enable').toLowerCase(), user: this.selectedUser });
      else if (action.toLowerCase() === 'disable')
        return this.$root.$t('birthdays.confirm_action', { action: this.$root.$t('action.disable').toLowerCase(), user: this.selectedUser });
    },
  },
  watch: {
    refreshList(val) {
      if (val)
        this.loadBirthdays();
    },
    userNeedLogin(val) {
      this.needLogin(val);
    },
    birthdayNeedLogin(val) {
      this.needLogin(val);
    },
    search: debounce(function (newVal) {
      this.debounceSearch = (newVal || '').toLowerCase();
    }, 500),
  },
  methods: {
    ...Vuex.mapActions({
      setToastMessage: 'appStore/setToastMessage',

      loadTemplates: 'templateStore/loadTemplates',

      loadBirthdays: 'birthdayStore/loadBirthdays',
      updateStatusBirthday: 'birthdayStore/updateStatusBirthday',
      callDeleteBirthday: 'birthdayStore/deleteBirthday',
      setShowModalImport: 'birthdayStore/setShowModalImport',
      downloadBirthdays: 'birthdayStore/downloadBirthdays',
    }),
    deleteBirthday() {
      return this.callDeleteBirthday();
    },
    enableBirthday() {
      return this.callUpdateStatusBirthday();
    },
    disableBirthday() {
      return this.callUpdateStatusBirthday();
    },
    callUpdateStatusBirthday() {
      const { action } = this.selectedBirthdayAction || {};
      if (!action)
        return;

      return this.updateStatusBirthday();
    },
    handleOk(bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault();

      const { action } = this.selectedBirthdayAction || {};
      if (!action)
        return;

      this[`${action}Birthday`]().then(data => {
        if (this.errorAction)
          return;

        if (action.toLowerCase() === 'delete')
          this.setToastMessage(this.$root.$t('birthdays.deleted', data));
        else
          this.setToastMessage(this.$root.$t('birthdays.status_updated', { user: this.selectedUser }));

        this.$bvModal.hide('confirm-action-birthday');
      }).catch(err => {
        console.log(`Error ${action.toLowerCase() === 'delete' ? action : 'update status'} birthday`, err);
      });
    },
    needLogin(val) {
      if (val) {
        console.log('You need to login before action.');
        // this.$router.push({ name: 'login', query: { returnTo: this.$route.fullPath } });
        if (!this.hasData)
          this.setToastMessage(this.$sessionTimeout);
      }
    },
    showItem(item) {
      if (!item)
        return false;

      const { user = {}, template = {}, enabled } = item;
      let show = true;
      if (this.debounceSearch && this.debounceSearch.length > 1)
        show = (user.username && user.username.toLowerCase().includes(this.debounceSearch)) ||
          (user.name && user.name.toLowerCase().includes(this.debounceSearch));
      if (show && this.templateId)
        show = template.id === this.templateId;

      if (show && this.birthdayStatus !== null) {
        if (this.birthdayStatus === -2)
          show = (template.id === null || typeof (template.id) === 'undefined');
        else if (this.birthdayStatus === -1)
          show = (user.username === null || typeof (user.username) === 'undefined');
        else
          show = enabled === this.birthdayStatus;
      }

      return show;
    },
    onHide(bvModalEvt) {
      if (this.deletingBirthday || this.updatingStatusBirthday)
        bvModalEvt.preventDefault();
    },
    download(type) {
      this.downloadBirthdays(type).then(result => {
        const [fileName, blob] = result;
        if (!blob) {
          this.setToastMessage(this.$root.$t('error_download', { type }));
          return;
        }

        const link = document.createElement('a');
        link.style.display = 'none';
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName || `export-${(new Date()).valueOf()}.${type}`;
        link.click();
        window.URL.revokeObjectURL(link.href);
      });
    },
  },
};
