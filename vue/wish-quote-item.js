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
      ...this.dataWishQuote,
      saving: false, error: null, error_token: null
    };
  },
  watch: {
    dataWishQuote(val) {
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
    dataWishQuote: {
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
      mainSaveWishQuote: 'wishQuoteStore/saveWishQuote',
      setToastMessage: 'appStore/setToastMessage',
      setSelectedWishQuoteId: 'wishQuoteStore/setSelectedWishQuoteId',
    }),
    showConfirmDelete() {
      this.setSelectedWishQuoteId(this.item.id);
      this.$bvModal.show('confirm-delete-wish-quote');
    },
    saveWishQuote() {
      this.item.saving = true;
      this.item.error = null;
      this.item.error_token = null;
      const isTemporatory = this.isTemporatory;
      this.mainSaveWishQuote(this.item).then((res) => {
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
          this.setToastMessage(this.$root.$t('wish-quote-item.created', { id: res.id }));
        else
          this.setToastMessage(this.$root.$t('wish-quote-item.updated', { id: res.id }));
      });
    },
  },
};
