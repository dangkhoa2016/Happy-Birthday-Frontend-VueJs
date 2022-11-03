/*jshint esversion: 9 */

import WishQuoteItem from './wish-quote-item.vue';
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
    'wish-quote-item': WishQuoteItem
  },
  mounted() {
    this.loadWishQuotes();
  },
  computed: {
    ...Vuex.mapGetters({
      getCachedWishQuotes: 'wishQuoteStore/getCachedWishQuotes',
      loadingWishQuotes: 'wishQuoteStore/getLoadingWishQuotes',
      errorLoadWishQuotes: 'wishQuoteStore/getErrorLoadWishQuotes',

      savingWishQuote: 'wishQuoteStore/getSavingWishQuote',
      errorSaveWishQuote: 'wishQuoteStore/getErrorSaveWishQuote',

      needLogin: 'wishQuoteStore/getNeedLogin',
      selectedWishQuote: 'wishQuoteStore/getSelectedWishQuote',

      deleteWishQuoteResult: 'wishQuoteStore/getDeleteWishQuoteResult',
      deletingWishQuote: 'wishQuoteStore/getDeletingWishQuote',
      errorDeleteWishQuote: 'wishQuoteStore/getErrorDeleteWishQuote',

      addAction: 'wishQuoteStore/getAddAction',
      refreshList: 'wishQuoteStore/getRefreshList',
    }),
    wishQuotes() {
      return this.getCachedWishQuotes() || [];
    },
    errorAction() {
      if (this.needLogin)
        return this.$sessionTimeout;
      return this.errorLoadWishQuotes || this.errorDeleteWishQuote || '';
    },
    hasData() {
      return this.wishQuotes.length > 0;
    },
    countTemporatory() {
      const isTemporatory = this.$isTemporatory;
      return this.wishQuotes.filter(t => isTemporatory(t)).length;
    },
    confirmDeletedMessage() {
      const selectedWishQuote = this.selectedWishQuote;
      if (!selectedWishQuote)
        return;
      return this.$isTemporatory(selectedWishQuote) ? this.$root.$t('not_saved').toLowerCase() : selectedWishQuote.id;
    },
    statusOptions() {
      if (!Array.isArray(this.wishQuotes))
        return [];

      const isTemporatory = this.$isTemporatory;
      const countActive = this.wishQuotes.filter(b => b.enabled && !isTemporatory(b)).length;
      const countTemporatory = this.countTemporatory;

      return [
        { value: null, text: this.$root.$t('all') },
        { value: true, text: `${this.$root.$t('active')} [${countActive}]` },
        { value: -1, text: `${this.$root.$t('not_saved')} [${countTemporatory}]` },
        { value: false, text: `${this.$root.$t('inactive')} [${this.wishQuotes.length - countTemporatory - countActive}]` }
      ];
    },
  },
  watch: {
    refreshList(val) {
      if (val)
        this.loadWishQuotes();
    },
    addAction(newVal) {
      this.$nextTick(function () {
        if (!newVal)
          return;

        let inputId = '';
        if (newVal == 'push')
          inputId = this.wishQuotes[this.wishQuotes.length - 1].id;
        else if (newVal == 'unshift')
          inputId = this.wishQuotes[0].id;

        if (inputId) {
          this.setAddAction('');
          setTimeout(function () {
            document.getElementById(`txt-wish-quote-${inputId}`).focus();
          }, 50);
        }
      });
    },
    search: debounce(function (newVal) {
      this.debounceSearch = (newVal || '').toLowerCase();
    }, 500),
    deleteWishQuoteResult(data) {
      if (!data)
        return;

      this.$bvModal.hide('confirm-delete-wish-quote');

      if (data.id)
        this.setToastMessage(this.$root.$t('wish-quotes.deleted', data));
      else
        this.setToastMessage(this.$root.$t('wish-quotes.deleted_not_saved'));
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

      setNeedLogin: 'wishQuoteStore/setNeedLogin',
      loadWishQuotes: 'wishQuoteStore/loadWishQuotes',
      deleteWishQuote: 'wishQuoteStore/deleteWishQuote',
      setShowModalImport: 'wishQuoteStore/setShowModalImport',
      mainSaveWishQuote: 'wishQuoteStore/saveWishQuote',
      addTemporatoryWishQuote: 'wishQuoteStore/addTemporatoryWishQuote',
      setAddAction: 'wishQuoteStore/setAddAction',
      downloadWishQuotes: 'wishQuoteStore/downloadWishQuotes',
    }),
    handleOk(bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault();

      if (this.selectedWishQuote)
        this.deleteWishQuote();
      else {
        this.$nextTick(() => {
          this.$bvModal.hide('confirm-delete-wish-quote');
        });
      }
    },
    showItem(item) {
      if (!item)
        return false;

      const { quote, enabled } = item;
      let show = true;
      if (this.debounceSearch && this.debounceSearch.length > 1)
        show = quote.toLowerCase().includes(this.debounceSearch);

      if (show && this.status !== null) {
        if (this.$isTemporatory(item))
          show = this.status === -1;
        else
          show = enabled === this.status;
      }
      return show;
    },
    download(type) {
      this.downloadWishQuotes(type).then(result => {
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
