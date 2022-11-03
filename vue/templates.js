/*jshint esversion: 9 */

import TemplateItem from './template-item.vue';
const debounce = Vue.prototype.$debounce;

export default {
  data() {
    return {
      debounceSearch: '',
      search: '',
      status: null,
    };
  },
  components: {
    'plus-icon': vueFeatherIcons.PlusIcon,
    'refresh-cw-icon': vueFeatherIcons.RefreshCwIcon,
    'server-icon': vueFeatherIcons.ServerIcon,
    'v-select': VueSelect.VueSelect,
    'template-item': TemplateItem
  },
  mounted() {
    this.loadTemplates();
  },
  computed: {
    ...Vuex.mapGetters({

      getCachedTemplates: 'templateStore/getCachedTemplates',
      loadingTemplates: 'templateStore/getLoadingTemplates',
      errorLoadTemplates: 'templateStore/getErrorLoadTemplates',

      savingTemplate: 'templateStore/getSavingTemplate',
      errorSaveTemplate: 'templateStore/getErrorSaveTemplate',

      needLogin: 'templateStore/getNeedLogin',
      selectedTemplate: 'templateStore/getSelectedTemplate',

      deleteTemplateResult: 'templateStore/getDeleteTemplateResult',
      deletingTemplate: 'templateStore/getDeletingTemplate',
      errorDeleteTemplate: 'templateStore/getErrorDeleteTemplate',

      addAction: 'templateStore/getAddAction',
      refreshList: 'templateStore/getRefreshList',
    }),
    templates() {
      return this.getCachedTemplates() || [];
    },
    errorAction() {
      if (this.needLogin)
        return this.$sessionTimeout;
      return this.errorLoadTemplates || this.errorDeleteTemplate || '';
    },
    hasData() {
      return this.templates.length > 0;
    },
    countTemporatory() {
      const isTemporatory = this.$isTemporatory;
      return this.templates.filter(t => isTemporatory(t)).length;
    },
    confirmDeletedMessage() {
      const selectedTemplate = this.selectedTemplate;
      if (!selectedTemplate)
        return;
      return this.$isTemporatory(selectedTemplate) ? this.$root.$t('not_saved').toLowerCase() : `${selectedTemplate.id} - ${selectedTemplate.name}`;
    },
    statusOptions() {
      if (!Array.isArray(this.templates))
        return [];

      const isTemporatory = this.$isTemporatory;
      const countActive = this.templates.filter(b => b.enabled && !isTemporatory(b)).length;
      const countTemporatory = this.countTemporatory;

      return [
        { value: null, text: this.$root.$t('all') },
        { value: true, text: `${this.$root.$t('active')} [${countActive}]` },
        { value: -1, text: `${this.$root.$t('not_saved')} [${countTemporatory}]` },
        { value: false, text: `${this.$root.$t('inactive')} [${this.templates.length - countTemporatory - countActive}]` }
      ];
    },
  },
  watch: {
    refreshList(val) {
      if (val)
        this.loadTemplates();
    },
    addAction(newVal) {
      this.$nextTick(function () {
        if (!newVal)
          return;

        let inputId = '';
        if (newVal == 'push')
          inputId = this.templates[this.templates.length - 1].id;
        else if (newVal == 'unshift')
          inputId = this.templates[0].id;

        if (inputId) {
          this.setAddAction('');
          setTimeout(function () {
            document.getElementById(`txt-name-${inputId}`).focus();
          }, 50);
        }
      });
    },
    search: debounce(function (newVal) {
      this.debounceSearch = (newVal || '').toLowerCase();
    }, 500),
    deleteTemplateResult(data) {
      if (!data)
        return;

      this.$bvModal.hide('confirm-delete-template');

      if (data.id)
        this.setToastMessage(this.$root.$t('templates.deleted', data));
      else
        this.setToastMessage(this.$root.$t('templates.deleted_not_saved'));
    },
    needLogin(val) {
      if (val) {
        console.log('You need to login before action.');
        // this.$router.push({ name: 'login', query: { returnTo: this.$route.fullPath } });
        this.setToastMessage(this.$sessionTimeout);
      }
    },
  },
  methods: {
    ...Vuex.mapActions({
      setToastMessage: 'appStore/setToastMessage',

      setNeedLogin: 'templateStore/setNeedLogin',
      loadTemplates: 'templateStore/loadTemplates',
      deleteTemplate: 'templateStore/deleteTemplate',
      mainSaveTemplate: 'templateStore/saveTemplate',
      addTemporatoryTemplate: 'templateStore/addTemporatoryTemplate',
      setShowModalImport: 'templateStore/setShowModalImport',
      setAddAction: 'templateStore/setAddAction',
      downloadTemplates: 'templateStore/downloadTemplates',
    }),
    handleOk(bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault();

      if (this.selectedTemplate)
        this.deleteTemplate();
      else {
        this.$nextTick(() => {
          this.$bvModal.hide('confirm-delete-template');
        });
      }
    },
    showItem(item) {
      if (!item)
        return false;

      const { name, url, thumb, enabled } = item;
      let show = true;
      if (this.debounceSearch && this.debounceSearch.length > 1)
        show = name.toLowerCase().includes(this.debounceSearch) ||
          url.toLowerCase().includes(this.debounceSearch) ||
          thumb.toLowerCase().includes(this.debounceSearch);

      if (show && this.status !== null) {
        if (this.$isTemporatory(item))
          show = this.status === -1;
        else
          show = enabled === this.status;
      }
      return show;
    },
    download(type) {
      this.downloadTemplates(type).then(result => {
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
  }
};
