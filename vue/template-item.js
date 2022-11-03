/*jshint esversion: 9 */

export default {
  components: {
    'x-icon': vueFeatherIcons.XIcon,
    'save-icon': vueFeatherIcons.SaveIcon,
  },
  data() {
    return {
      item: {},
    };
  },
  mounted() {
    this.item = {
      ...this.dataTemplate,
      saving: false, error: null, error_token: null
    };
  },
  watch: {
    dataTemplate(val) {
      this.item = { ...this.item, ...val };
    },
  },
  computed: {
    errorAction() {
      if (this.item.error_token)
        return this.$sessionTimeout;
      else
        return this.item.error || '';
    },
    isTemporatory() {
      return this.$isTemporatory(this.item);
    },
  },
  props: {
    dataTemplate: {
      type: Object,
      default: () => { return {}; }
    },
    index: {
      type: Number,
      default: () => { return 0; }
    }
  },
  methods: {
    ...Vuex.mapActions({
      mainSaveTemplate: 'templateStore/saveTemplate',
      setToastMessage: 'appStore/setToastMessage',
      setSelectedTemplateId: 'templateStore/setSelectedTemplateId',
    }),
    showConfirmDelete() {
      this.setSelectedTemplateId(this.item.id);
      this.$bvModal.show('confirm-delete-template');
    },
    saveTemplate() {
      this.item.saving = true;
      this.item.error = null;
      this.item.error_token = null;
      const isTemporatory = this.isTemporatory;
      this.mainSaveTemplate(this.item).then((res) => {
        this.item.saving = false;
        if (res) {
          this.item.error = res.error;
          this.item.error_token = res.error_token;
        }

        if (this.item.error_token) {
          this.setToastMessage(this.$sessionTimeout);
          return;
        }
        else if (this.errorAction)
          return;

        if (isTemporatory)
          this.setToastMessage(this.$root.$t('template-item.created', { name: this.item.name, id: res.id }));
        else
          this.setToastMessage(this.$root.$t('template-item.updated', { id: res.id }));
      });
    },
  },
};
