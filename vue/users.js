/*jshint esversion: 9 */

export default {
  components: {
    'align-center-icon': vueFeatherIcons.AlignCenterIcon,
    'activity-icon': vueFeatherIcons.ActivityIcon,
    'refresh-cw-icon': vueFeatherIcons.RefreshCwIcon,
    'plus-icon': vueFeatherIcons.PlusIcon,
    'server-icon': vueFeatherIcons.ServerIcon,
    'trash-2-icon': vueFeatherIcons.Trash2Icon,
    'pen-tool-icon': vueFeatherIcons.PenToolIcon,
  },
  data() {
    return {
      selectedUsername: '',
      action: '',
      fields: [
        { key: 'name', label: this.$root.$t('users.name'), sortable: true, sortDirection: 'desc' },
        { key: 'age', label: this.$root.$t('users.age'), sortable: true, class: 'text-center' },
        {
          key: 'enabled',
          label: this.$root.$t('active'),
          formatter: (value, key, item) => {
            return this.$root.$t(`users.${value ? 'yes' : 'no'}`);
          },
          sortable: true,
          sortByFormatted: true,
          filterByFormatted: true
        },
        { key: 'actions', label: this.$root.$t('action.name') }
      ],
      totalRows: 1,
      currentPage: 1,
      perPage: null,
      sortBy: '',
      sortDesc: false,
      sortDirection: 'asc',
      filter: null,
      filterOn: [],
      infoModal: {
        id: 'info-modal',
        title: '',
        content: ''
      }
    };
  },
  watch: {
    refreshList(val) {
      if (val)
        this.loadUsers();
    },
    users(val) {
      // Set the initial number of items
      this.totalRows = val.length;
    },
    needLogin(val) {
      if (val) {
        console.log('You need to login before action.');
        // this.$router.push({ name: 'login', query: { returnTo: this.$route.fullPath } });
        this.setToastMessage(this.$sessionTimeout);
      }
    },
  },
  computed: {
    ...Vuex.mapGetters({
      pageOptions: 'appStore/getUsersPageOptions',
      usersPageSize: 'appStore/getUsersPageSize',

      users: 'userStore/getCachedUsers',
      needLogin: 'userStore/getNeedLogin',
      loadingUsers: 'userStore/getLoadingUsers',
      errorUpdateStatusUser: 'userStore/getErrorUpdateStatusUser',
      updatingStatusUser: 'userStore/getUpdatingStatusUser',
      errorDeleteUser: 'userStore/getErrorDeleteUser',
      deletingUser: 'userStore/getDeletingUser',
      refreshList: 'userStore/getRefreshList',
    }),
    sortOptions() {
      // Create an options list from our fields
      const arr = this.fields
        .filter(f => f.sortable)
        .map(f => {
          return { text: f.label, value: f.key };
        });
      return [{ text: this.$root.$t('users.sort_none'), value: '' }, ...arr];
    },
    displaySortOption() {
      return this.sortOptions.find(f => f.value === this.sortBy).text;
    },
    displayPageOption() {
      return this.perPage ? this.pageOptions.find(f => f.value === this.perPage).text : '';
    },
    errorAction() {
      if (this.needLogin)
        return this.$sessionTimeout;
      if (this.errorUpdateStatusUser === 404)
        return this.$root.$t('users.user_not_exists', { username: this.selectedUsername });
      return this.errorDeleteUser || this.errorUpdateStatusUser || '';
    },
    actionColor() {
      if (!this.action)
        return;

      if (this.action.toLowerCase() === 'delete')
        return 'danger';
      else if (this.action.toLowerCase() === 'enable')
        return 'info';
      else if (this.action.toLowerCase() === 'disable')
        return 'warning';
    },
    confirmMessage() {
      if (!this.action)
        return;

      if (this.action.toLowerCase() === 'delete')
        return this.$root.$t('users.confirm_action', { action: this.$root.$t('action.delete'), username: this.selectedUsername });
      else if (this.action.toLowerCase() === 'enable')
        return this.$root.$t('users.confirm_action', { action: this.$root.$t('action.enable').toLowerCase(), username: this.selectedUsername });
      else if (this.action.toLowerCase() === 'disable')
        return this.$root.$t('users.confirm_action', { action: this.$root.$t('action.disable').toLowerCase(), username: this.selectedUsername });
    },
  },
  mounted() {
    this.perPage = this.usersPageSize || 5;
    this.loadUsers();
  },
  methods: {
    ...Vuex.mapActions({
      setToastMessage: 'appStore/setToastMessage',

      setModalData: 'userStore/setModalData',
      setShowModalImport: 'userStore/setShowModalImport',
      loadUsers: 'userStore/loadUsers',
      updateStatusUser: 'userStore/updateStatusUser',
      setNeedLogin: 'userStore/setNeedLogin',
      callDeleteUser: 'userStore/deleteUser',
      downloadUsers: 'userStore/downloadUsers',
    }),
    info(item, index, button) {
      this.infoModal.title = `${this.$root.$t('users.row_index')}: ${index}`;
      this.infoModal.content = JSON.stringify(item, null, 2);
      this.$root.$emit('bv::show::modal', this.infoModal.id, button);
    },
    resetInfoModal() {
      this.infoModal.title = '';
      this.infoModal.content = '';
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    replaceDefault(e) {
      var isMan = (e.target.getAttribute('data-gender') || '').toLowerCase() === 'nam';
      e.target.src = isMan ? this.$defaultImageMan : this.$defaultImageWoman;
      e.target.classList = ['border-danger'];
    },
    handleOk(bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault();

      if (!this.action)
        return;

      this[`${this.action}User`]().then(res => {
        if (this.errorAction)
          return;

        if (this.action.toLowerCase() === 'delete')
          this.setToastMessage(this.$root.$t('users.deleted', { username: this.selectedUsername }));
        else
          this.setToastMessage(this.$root.$t('users.status_updated', { username: this.selectedUser }));

        this.$bvModal.hide('confirm-action-user');
        this.selectedUsername = '';
      }).catch(err => {
        console.log(`Error ${this.action.toLowerCase() === 'delete' ? this.action : 'update status'} user`, err);
      });
    },
    showConfirm(username, action) {
      this.selectedUsername = username;
      this.action = action;
      this.setNeedLogin(false);
      this.$bvModal.show('confirm-action-user');
    },
    deleteUser() {
      return this.callDeleteUser(this.selectedUsername);
    },
    enableUser() {
      return this.callUpdateStatusUser();
    },
    disableUser() {
      return this.callUpdateStatusUser();
    },
    callUpdateStatusUser() {
      return this.updateStatusUser({ status: this.action, username: this.selectedUsername });
    },
    showEdit(data) {
      if (data.username)
        this.setModalData(data);
    },
    download(type) {
      this.downloadUsers(type).then(result => {
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
