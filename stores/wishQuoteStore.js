/*jshint esversion: 9 */

(function () {

  const handleErrors = window.handleErrors;
  // const sleep = window.sleep;

  const state = {
    wishQuotes: [],
    selectedWishQuoteId: null,
    addAction: null,

    errorLoadWishQuotes: null,
    loadingWishQuotes: false,
    needLogin: false,

    errorSaveWishQuote: null,
    savingWishQuote: false,
    saveWishQuoteResult: null,

    deleteWishQuoteResult: null,
    errorDeleteWishQuote: null,
    deletingWishQuote: false,

    refreshList: null,
    importWishQuotesResult: null,
    showModalImport: null,
    errorImportWishQuotes: null,
    importingWishQuotes: false,
  };

  const mutations = {
    SET_NEED_LOGIN(state, payload) {
      state.needLogin = payload;
    },
    SET_SELECTED_WISH_QUOTE_ID(state, payload) {
      state.selectedWishQuoteId = payload;
    },
    SET_REFRESH_LIST(state, payload) {
      state.refreshList = payload;
    },


    SET_ERROR_LOAD_WISH_QUOTES(state, payload) {
      state.errorLoadWishQuotes = payload && payload.error ? payload.error : payload;
    },
    SET_LOADING_WISH_QUOTES(state, payload) {
      state.loadingWishQuotes = payload;
    },
    SET_WISH_QUOTES(state, payload) {
      state.wishQuotes = payload;
    },

    SET_SAVE_WISH_QUOTE_RESULT(state, payload) {
      state.saveWishQuoteResult = payload;
    },
    SET_ERROR_SAVE_WISH_QUOTE(state, payload) {
      state.errorSaveWishQuote = payload && payload.error ? payload.error : payload;
    },
    SET_SAVING_WISH_QUOTE(state, payload) {
      state.savingWishQuote = payload;
    },


    SET_ERROR_DELETE_WISH_QUOTE(state, payload) {
      state.errorDeleteWishQuote = payload && payload.error ? payload.error : payload;
    },
    SET_DELETING_WISH_QUOTE(state, payload) {
      state.deletingWishQuote = payload;
    },
    SET_DELETE_WISH_QUOTE_RESULT(state, payload) {
      state.deleteWishQuoteResult = payload;
    },
    REMOVE_SELECTED_WISH_QUOTE(state) {
      if (!state.selectedWishQuoteId)
        return;

      const indx = state.wishQuotes.findIndex(t => t.id.toString() === state.selectedWishQuoteId.toString());
      if (indx < 0)
        return;

      state.wishQuotes.splice(indx, 1);
      state.selectedWishQuoteId = '';
    },


    ADD_TEMPORATORY_WISH_QUOTE(state, action) {
      state.wishQuotes[action]({
        id: `t-${(new Date()).valueOf()}`,
        quote: '', enabled: true,
      });
    },
    ADD_ACTION(state, action) {
      state.addAction = action;
    },


    INTERNAL_UPDATE_DATA(state, payload) {
      const wishQuotes = state.wishQuotes;
      let id = null;
      if (payload.tempId) {
        id = payload.tempId;
        delete payload.tempId;
      } else
        id = payload.id.toString();
      const indx = wishQuotes.findIndex(n => n.id.toLowerCase() === id);
      if (indx !== -1) {
        wishQuotes[indx] = { ...wishQuotes[indx], ...payload };
        state.wishQuotes = [...wishQuotes];
      }
    },


    SET_SHOW_MODAL_IMPORT(state, payload) {
      state.showModalImport = payload;
    },
    SET_ERROR_IMPORT_WISH_QUOTES(state, payload) {
      state.errorImportWishQuotes = payload;
    },
    SET_IMPORTING_WISH_QUOTES(state, payload) {
      state.importingWishQuotes = payload;
    },
    SET_IMPORT_WISH_QUOTES_RESULT(state, payload) {
      state.importWishQuotesResult = payload;
    },
  };

  const actions = {
    setNeedLogin(context, payload) {
      const { commit } = context;
      commit('SET_NEED_LOGIN', payload);
    },
    setRefreshList(context, payload) {
      const { commit } = context;
      commit('SET_REFRESH_LIST', payload);
    },
    loadWishQuotes(context, payload) {
      const { commit, dispatch, rootGetters } = context;
      const endpoint = rootGetters['appStore/getEndpoint'];

      return new Promise(async resolve => {
        commit('SET_LOADING_WISH_QUOTES', true);
        commit('SET_ERROR_LOAD_WISH_QUOTES', null);
        commit('SET_NEED_LOGIN', null);
        commit('SET_WISH_QUOTES', []);
        const accessToken = await dispatch('appStore/getAccessToken', null, { root: true });

        fetch(`${endpoint}/api/wish_quotes`, {
          method: 'get', redirect: 'manual',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
        }).then(handleErrors)
          .then(result => {
            commit('SET_LOADING_WISH_QUOTES', false);

            if (typeof (result) === 'object' && result.error_token)
              commit('SET_NEED_LOGIN', true);
            else {
              if (typeof (result) === 'object' && result.error)
                commit('SET_ERROR_LOAD_WISH_QUOTES', result.error);
              else {
                commit('SET_WISH_QUOTES', result);
              }
            }

            resolve();
          }).catch(err => {
            console.log('Error load wish quotes', err);
            commit('SET_LOADING_WISH_QUOTES', false);
            commit('SET_ERROR_LOAD_WISH_QUOTES', err);

            resolve();
          });
      });
    },
    setErrorSaveWishQuote(context, payload) {
      const { commit } = context;
      commit('SET_ERROR_SAVE_WISH_QUOTE', payload);
    },
    addTemporatoryWishQuote(context, action) {
      const { commit } = context;
      commit('ADD_TEMPORATORY_WISH_QUOTE', action);
      commit('ADD_ACTION', action);
    },
    setAddAction(context, payload) {
      const { commit } = context;
      commit('ADD_ACTION', payload);
    },
    setSelectedWishQuoteId(context, payload) {
      const { commit } = context;
      commit('SET_SELECTED_WISH_QUOTE_ID', payload);
    },
    setDeletingWishQuote(context, payload) {
      const { commit } = context;
      commit('SET_DELETING_WISH_QUOTE', payload);
    },
    saveWishQuote(context, payload) {
      const { commit, dispatch, rootGetters } = context;
      const endpoint = rootGetters['appStore/getEndpoint'];
      let { quote, enabled = false, id, tempId = '' } = payload;
      const isTemporatory = id.indexOf('t-') === 0;
      if (isTemporatory) {
        tempId = id;
        id = null;
      }

      return new Promise(async resolve => {
        commit('SET_SAVING_WISH_QUOTE', true);
        commit('SET_ERROR_SAVE_WISH_QUOTE', null);
        commit('SET_NEED_LOGIN', null);
        commit('SET_SAVE_WISH_QUOTE_RESULT', null);
        const accessToken = await dispatch('appStore/getAccessToken', null, { root: true });

        fetch(`${endpoint}/api/wish_quotes`, {
          method: 'post', redirect: 'manual',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify({ quote, enabled, id })
        }).then(handleErrors)
          .then(result => {
            commit('SET_SAVING_WISH_QUOTE', false);

            if (typeof (result) === 'object' && !result.error_token) {
              if (result.error)
                commit('SET_ERROR_SAVE_WISH_QUOTE', result.error);
              else {
                if (isTemporatory)
                  result.tempId = tempId;
                commit('SET_SAVE_WISH_QUOTE_RESULT', result);
                commit('INTERNAL_UPDATE_DATA', result);
              }
            }
            resolve(result);
          }).catch(err => {
            console.log('Error save wish quote', err);
            commit('SET_SAVING_WISH_QUOTE', false);
            commit('SET_ERROR_SAVE_WISH_QUOTE', err);

            resolve({ error: err.message });
          });
      });
    },
    deleteWishQuote(context) {
      const { commit, getters, dispatch, rootGetters } = context;
      const endpoint = rootGetters['appStore/getEndpoint'];
      const wishQuote = getters.getSelectedWishQuote;
      const isTemporatory = wishQuote.id.indexOf('t-') === 0;

      if (!wishQuote.id) {
        commit('SET_DELETE_WISH_QUOTE_RESULT', {});
        return;
      } else if (isTemporatory) {
        commit('SET_DELETE_WISH_QUOTE_RESULT', true);
        commit('REMOVE_SELECTED_WISH_QUOTE');
        return;
      }

      return new Promise(async resolve => {
        commit('SET_DELETING_WISH_QUOTE', true);
        commit('SET_ERROR_DELETE_WISH_QUOTE', null);
        commit('SET_NEED_LOGIN', null);
        commit('SET_DELETE_WISH_QUOTE_RESULT', null);
        const accessToken = await dispatch('appStore/getAccessToken', null, { root: true });

        fetch(`${endpoint}/api/wish_quotes/${wishQuote.id}`, {
          method: 'delete', redirect: 'manual',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
        }).then(handleErrors)
          .then(result => {
            commit('SET_DELETING_WISH_QUOTE', false);

            if (result.error_token)
              commit('SET_NEED_LOGIN', true);
            else {
              if (result.error)
                commit('SET_ERROR_DELETE_WISH_QUOTE', result.error);
              else {
                commit('SET_DELETE_WISH_QUOTE_RESULT', { id: !isTemporatory && wishQuote.id });
                commit('REMOVE_SELECTED_WISH_QUOTE');
              }
            }

            resolve();
          }).catch(err => {
            console.log('Error delete wish quote', err);
            commit('SET_DELETING_WISH_QUOTE', false);
            commit('SET_ERROR_DELETE_WISH_QUOTE', err);

            resolve();
          });
      });
    },

    downloadWishQuotes(context, type) {
      const { rootGetters, dispatch } = context;
      const endpoint = rootGetters['appStore/getEndpoint'];

      return new Promise(async resolve => {
        const accessToken = await dispatch('appStore/getAccessToken', null, { root: true });
        fetch(`${endpoint}/api/wish_quotes/export?format=${type}`, {
          redirect: 'manual', headers: {
            Authorization: `Bearer ${accessToken}`
          },
        }).then(async res => {
          const disposition = res.headers.get('Content-Disposition');
          let fileName = disposition.split(/;(.+)/)[1].split(/=(.+)/)[1];
          if (fileName.toLowerCase().startsWith("utf-8''"))
            fileName = decodeURIComponent(fileName.replace("utf-8''", ''));
          else
            fileName = fileName.replace(/['"]/g, '');

          resolve([fileName, await res.blob()]);
        }).catch((ex) => {
          console.log('Error download wish quotes', ex);
          resolve([]);
        });
      });
    },

    importWishQuotes(context, payload) {
      const { commit, dispatch, rootGetters } = context;
      const endpoint = rootGetters['appStore/getEndpoint'];

      return new Promise(async resolve => {
        commit('SET_IMPORTING_WISH_QUOTES', true);
        commit('SET_ERROR_IMPORT_WISH_QUOTES', null);
        commit('SET_NEED_LOGIN', null);
        commit('SET_IMPORT_WISH_QUOTES_RESULT', null);
        const accessToken = await dispatch('appStore/getAccessToken', null, { root: true });

        fetch(`${endpoint}/api/wish_quotes/import`, {
          method: 'post', redirect: 'manual',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify(payload)
        }).then(handleErrors)
          .then(result => {
            commit('SET_IMPORTING_WISH_QUOTES', false);

            if (typeof (result) === 'object' && result.status === 411)
              result.message = 0;
            if (typeof (result) === 'object' && result.error_token)
              commit('SET_NEED_LOGIN', true);
            else {
              if (typeof (result) === 'object' && result.error)
                commit('SET_ERROR_IMPORT_WISH_QUOTES', result.error);
              else
                commit('SET_IMPORT_WISH_QUOTES_RESULT', result);
            }

            resolve();
          }).catch(err => {
            console.log('Error import wish quotes', err);
            commit('SET_IMPORTING_WISH_QUOTES', false);
            commit('SET_ERROR_IMPORT_WISH_QUOTES', err);

            resolve();
          });
      });
    },
    setErrorImportWishQuotes(context, payload) {
      const { commit } = context;
      commit('SET_ERROR_IMPORT_WISH_QUOTES', payload);
    },
    setShowModalImport(context, payload) {
      const { commit } = context;
      commit('SET_SHOW_MODAL_IMPORT', payload);
    },
  };

  const getters = {
    getNeedLogin: (state) => state.needLogin,
    getAddAction: (state) => state.addAction,

    getSelectedWishQuote: (state) => {
      if (!state.selectedWishQuoteId || !Array.isArray(state.wishQuotes) || state.wishQuotes.length === 0)
        return;

      return state.wishQuotes.find(w => w.id.toString() === state.selectedWishQuoteId.toString());
    },

    getCachedWishQuotes: (state) => (onlyHasId = false) => {
      if (!Array.isArray(state.wishQuotes))
        return [];

      if (onlyHasId)
        return state.wishQuotes.filter(t => t.id.toString().toLowerCase().indexOf('t-') === -1);
      else
        return state.wishQuotes;
    },
    getErrorLoadWishQuotes: (state) => state.errorLoadWishQuotes,
    getLoadingWishQuotes: (state) => state.loadingWishQuotes,

    getErrorSaveWishQuote: (state) => state.errorSaveWishQuote,
    getSavingWishQuote: (state) => state.savingWishQuote,
    getSaveWishQuoteResult: (state) => state.saveWishQuoteResult,

    getDeleteWishQuoteResult: (state) => state.deleteWishQuoteResult,
    getDeletingWishQuote: (state) => state.deletingWishQuote,
    getErrorDeleteWishQuote: (state) => state.errorDeleteWishQuote,

    getImportWishQuotesResult: (state) => state.importWishQuotesResult,
    getImportingWishQuotes: (state) => state.importingWishQuotes,
    getShowModalImport: (state) => state.showModalImport,
    getErrorImportWishQuotes: (state) => state.errorImportWishQuotes,
    getRefreshList: (state) => state.refreshList,
  };

  if (!window.store)
    window.store = {};
  window.store.wishQuoteStore = {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
  };

})();
