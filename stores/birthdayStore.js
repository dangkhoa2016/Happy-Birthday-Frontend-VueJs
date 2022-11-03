/*jshint esversion: 9 */

(function () {

  const handleErrors = window.handleErrors;
  // const sleep = window.sleep;

  const state = {
    modalData: null,
    needLogin: false,
    selectedBirthdayAction: null,

    birthdays: [],
    errorLoadBirthdays: null,
    loadingBirthdays: false,

    errorSaveBirthday: null,
    savingBirthday: false,
    saveBirthdayResult: null,

    updateBirthdayStatusResult: null,
    errorUpdateStatusBirthday: null,
    updatingStatusBirthday: false,

    deleteBirthdayResult: null,
    errorDeleteBirthday: null,
    deletingBirthday: false,

    importBirthdaysResult: null,
    showModalImport: null,
    errorImportBirthdays: null,
    importingBirthdays: false,
    refreshList: null,
  };

  const mutations = {
    SET_MODAL_DATA(state, payload) {
      state.modalData = payload;
    },
    SET_SELECTED_BIRTHDAY_ACTION(state, payload) {
      state.selectedBirthdayAction = payload;
    },
    SET_NEED_LOGIN(state, payload) {
      state.needLogin = payload;
    },
    SET_REFRESH_LIST(state, payload) {
      state.refreshList = payload;
    },

    SET_ERROR_LOAD_BIRTHDAYS(state, payload) {
      state.errorLoadBirthdays = payload && payload.error ? payload.error : payload;
    },
    SET_LOADING_BIRTHDAYS(state, payload) {
      state.loadingBirthdays = payload;
    },
    SET_BIRTHDAYS(state, payload) {
      state.birthdays = payload;
    },

    SET_SAVE_BIRTHDAY_RESULT(state, payload) {
      state.saveBirthdayResult = payload;
    },
    SET_ERROR_SAVE_BIRTHDAY(state, payload) {
      state.errorSaveBirthday = payload && payload.error ? payload.error : payload;
    },
    SET_SAVING_BIRTHDAY(state, payload) {
      state.savingBirthday = payload;
    },

    SET_UPDATE_BIRTHDAY_STATUS_RESULT(state, payload) {
      state.updateBirthdayStatusResult = payload;
    },
    SET_ERROR_UPDATE_STATUS_BIRTHDAY(state, payload) {
      state.errorUpdateStatusBirthday = payload && payload.error ? payload.error : payload;
    },
    SET_UPDATING_STATUS_BIRTHDAY(state, payload) {
      state.updatingStatusBirthday = payload;
    },
    INTERNAL_UPDATE_BIRTHDAY(state, payload) {
      if (!payload.id)
        return;

      const birthdays = state.birthdays;
      const indx = birthdays.findIndex(n => n.id.toString() === payload.id.toString());
      if (indx !== -1) {
        birthdays[indx] = { ...birthdays[indx], ...payload };
        state.birthdays = [...birthdays];
      }
      else
        birthdays.push(payload);
    },

    SET_ERROR_DELETE_BIRTHDAY(state, payload) {
      state.errorDeleteBirthday = payload && payload.error ? payload.error : payload;
    },
    SET_DELETING_BIRTHDAY(state, payload) {
      state.deletingBirthday = payload;
    },
    SET_DELETE_BIRTHDAY_RESULT(state, payload) {
      state.deleteBirthdayResult = payload;
    },
    REMOVE_BIRTHDAY(state, id) {
      if (!id)
        return;

      const indx = state.birthdays.findIndex(t => t.id.toString() === id.toString());
      if (indx !== -1)
        state.birthdays.splice(indx, 1);
    },


    SET_SHOW_MODAL_IMPORT(state, payload) {
      state.showModalImport = payload;
    },
    SET_ERROR_IMPORT_BIRTHDAYS(state, payload) {
      state.errorImportBirthdays = payload;
    },
    SET_IMPORTING_BIRTHDAYS(state, payload) {
      state.importingBirthdays = payload;
    },
    SET_IMPORT_BIRTHDAYS_RESULT(state, payload) {
      state.importBirthdaysResult = payload;
    },
  };

  const actions = {
    setModalData(context, payload) {
      const { commit } = context;
      commit('SET_MODAL_DATA', payload);
    },
    setNeedLogin(context, payload) {
      const { commit } = context;
      commit('SET_NEED_LOGIN', payload);
    },
    setSelectedBirthdayAction(context, payload) {
      const { commit } = context;
      commit('SET_SELECTED_BIRTHDAY_ACTION', payload);
    },
    setRefreshList(context, payload) {
      const { commit } = context;
      commit('SET_REFRESH_LIST', payload);
    },
    loadBirthdays(context, payload) {
      const { commit, dispatch, rootGetters } = context;
      const endpoint = rootGetters['appStore/getEndpoint'];

      return new Promise(async resolve => {
        commit('SET_LOADING_BIRTHDAYS', true);
        commit('SET_ERROR_LOAD_BIRTHDAYS', null);
        commit('SET_NEED_LOGIN', null);
        commit('SET_BIRTHDAYS', []);
        const accessToken = await dispatch('appStore/getAccessToken', null, { root: true });

        fetch(`${endpoint}/api/birthdays`, {
          method: 'get', redirect: 'manual',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
        }).then(handleErrors)
          .then(result => {
            commit('SET_LOADING_BIRTHDAYS', false);

            if (typeof (result) === 'object' && result.error_token)
              commit('SET_NEED_LOGIN', true);
            else {
              if (typeof (result) === 'object' && result.error)
                commit('SET_ERROR_LOAD_BIRTHDAYS', result.error);
              else
                commit('SET_BIRTHDAYS', result);
            }

            resolve();
          }).catch(err => {
            console.log('Error load birthdays', err);
            commit('SET_LOADING_BIRTHDAYS', false);
            commit('SET_ERROR_LOAD_BIRTHDAYS', err);

            resolve();
          });
      });
    },
    setErrorSaveBirthday(context, payload) {
      const { commit } = context;
      commit('SET_ERROR_SAVE_BIRTHDAY', payload);
    },
    saveBirthday(context, payload) {
      const { commit, dispatch, rootGetters } = context;
      const endpoint = rootGetters['appStore/getEndpoint'];

      return new Promise(async resolve => {
        commit('SET_SAVING_BIRTHDAY', true);
        commit('SET_ERROR_SAVE_BIRTHDAY', null);
        commit('SET_NEED_LOGIN', null);
        commit('SET_SAVE_BIRTHDAY_RESULT', null);
        const accessToken = await dispatch('appStore/getAccessToken', null, { root: true });

        fetch(`${endpoint}/api/birthdays`, {
          method: 'post', redirect: 'manual',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify(payload)
        }).then(handleErrors)
          .then(result => {
            commit('SET_SAVING_BIRTHDAY', false);

            if (typeof (result) === 'object' && result.error_token)
              commit('SET_NEED_LOGIN', true);
            else {
              if (typeof (result) === 'object' && result.error)
                commit('SET_ERROR_SAVE_BIRTHDAY', result.error);
              else {
                commit('SET_SAVE_BIRTHDAY_RESULT', result);
                commit('INTERNAL_UPDATE_BIRTHDAY', result);
              }
            }

            resolve();
          }).catch(err => {
            console.log('Error save birthday', err);
            commit('SET_SAVING_BIRTHDAY', false);
            commit('SET_ERROR_SAVE_BIRTHDAY', err);

            resolve();
          });
      });
    },
    updateStatusBirthday(context) {
      const { commit, getters, dispatch, rootGetters } = context;
      const endpoint = rootGetters['appStore/getEndpoint'];
      const birthday = getters.getSelectedBirthday;
      const { id, action } = getters.getSelectedBirthdayAction;
      const payload = { id, username: birthday.user.username, status: action };

      return new Promise(async resolve => {
        commit('SET_UPDATING_STATUS_BIRTHDAY', true);
        commit('SET_ERROR_UPDATE_STATUS_BIRTHDAY', null);
        commit('SET_NEED_LOGIN', null);
        commit('SET_UPDATE_BIRTHDAY_STATUS_RESULT', null);
        const accessToken = await dispatch('appStore/getAccessToken', null, { root: true });

        fetch(`${endpoint}/api/birthdays/status`, {
          method: 'post', redirect: 'manual',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify(payload)
        }).then(handleErrors)
          .then(result => {
            commit('SET_UPDATING_STATUS_BIRTHDAY', false);

            if (typeof (result) === 'object' && result.status === 404)
              result.error = result.status;
            if (typeof (result) === 'object' && result.error_token)
              commit('SET_NEED_LOGIN', true);
            else {
              if (typeof (result) === 'object' && result.error)
                commit('SET_ERROR_UPDATE_STATUS_BIRTHDAY', result.error);
              else {
                commit('SET_UPDATE_BIRTHDAY_STATUS_RESULT', result);
                commit('INTERNAL_UPDATE_BIRTHDAY', { id, enabled: result.enabled, updated_at: result.updated_at });
              }
            }

            resolve();
          }).catch(err => {
            console.log('Error update birthday status', err);
            commit('SET_UPDATING_STATUS_BIRTHDAY', false);
            commit('SET_ERROR_UPDATE_STATUS_BIRTHDAY', err);

            resolve();
          });
      });
    },
    deleteBirthday(context) {
      const { getters } = context;
      const selected = getters.getSelectedBirthdayAction;
      const id = selected && selected.id;

      if (!id)
        return;

      const { commit, dispatch, rootGetters } = context;
      const endpoint = rootGetters['appStore/getEndpoint'];

      return new Promise(async resolve => {
        commit('SET_DELETING_BIRTHDAY', true);
        commit('SET_ERROR_DELETE_BIRTHDAY', null);
        commit('SET_NEED_LOGIN', null);
        commit('SET_DELETE_BIRTHDAY_RESULT', null);
        const accessToken = await dispatch('appStore/getAccessToken', null, { root: true });

        fetch(`${endpoint}/api/birthdays/${id}`, {
          method: 'delete', redirect: 'manual',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
        }).then(handleErrors)
          .then(result => {
            commit('SET_DELETING_BIRTHDAY', false);

            if (typeof (result) === 'object' && result.error_token)
              commit('SET_NEED_LOGIN', true);
            else {
              if (typeof (result) === 'object' && result.error)
                commit('SET_ERROR_DELETE_BIRTHDAY', result.error);
              else {
                result = { id };
                commit('SET_DELETE_BIRTHDAY_RESULT', result);
                commit('REMOVE_BIRTHDAY', id);
              }
            }

            resolve(result);
          }).catch(err => {
            console.log('Error delete birthday', err);
            commit('SET_DELETING_BIRTHDAY', false);
            commit('SET_ERROR_DELETE_BIRTHDAY', err);

            resolve();
          });
      });
    },

    downloadBirthdays(context, type) {
      const { rootGetters, dispatch } = context;
      const endpoint = rootGetters['appStore/getEndpoint'];

      return new Promise(async resolve => {
        const accessToken = await dispatch('appStore/getAccessToken', null, { root: true });
        fetch(`${endpoint}/api/birthdays/export?format=${type}`, {
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
          console.log('Error download birthdays', ex);
          resolve([]);
        });
      });
    },

    importBirthdays(context, payload) {
      const { commit, dispatch, rootGetters } = context;
      const endpoint = rootGetters['appStore/getEndpoint'];

      return new Promise(async resolve => {
        commit('SET_IMPORTING_BIRTHDAYS', true);
        commit('SET_ERROR_IMPORT_BIRTHDAYS', null);
        commit('SET_NEED_LOGIN', null);
        commit('SET_IMPORT_BIRTHDAYS_RESULT', null);
        const accessToken = await dispatch('appStore/getAccessToken', null, { root: true });

        fetch(`${endpoint}/api/birthdays/import`, {
          method: 'post', redirect: 'manual',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify(payload)
        }).then(handleErrors)
          .then(result => {
            commit('SET_IMPORTING_BIRTHDAYS', false);

            if (typeof (result) === 'object' && result.status === 411)
              result.message = 0;
            if (typeof (result) === 'object' && result.error_token)
              commit('SET_NEED_LOGIN', true);
            else {
              if (typeof (result) === 'object' && result.error)
                commit('SET_ERROR_IMPORT_BIRTHDAYS', result.error);
              else
                commit('SET_IMPORT_BIRTHDAYS_RESULT', result);
            }

            resolve();
          }).catch(err => {
            console.log('Error import birthdays', err);
            commit('SET_IMPORTING_BIRTHDAYS', false);
            commit('SET_ERROR_IMPORT_BIRTHDAYS', err);

            resolve();
          });
      });
    },
    setErrorImportBirthdays(context, payload) {
      const { commit } = context;
      commit('SET_ERROR_IMPORT_BIRTHDAYS', payload);
    },
    setShowModalImport(context, payload) {
      const { commit } = context;
      commit('SET_SHOW_MODAL_IMPORT', payload);
    },
  };

  const getters = {
    getModalData: (state) => state.modalData,
    getNeedLogin: (state) => state.needLogin,

    getCachedBirthdays: (state) => state.birthdays,
    getErrorLoadBirthdays: (state) => state.errorLoadBirthdays,
    getLoadingBirthdays: (state) => state.loadingBirthdays,

    getErrorSaveBirthday: (state) => state.errorSaveBirthday,
    getSavingBirthday: (state) => state.savingBirthday,
    getSaveBirthdayResult: (state) => state.saveBirthdayResult,

    getUpdateBirthdayStatusResult: (state) => state.updateBirthdayStatusResult,
    getUpdatingStatusBirthday: (state) => state.updatingStatusBirthday,
    getErrorUpdateStatusBirthday: (state) => state.errorUpdateStatusBirthday,

    getDeleteBirthdayResult: (state) => state.deleteBirthdayResult,
    getDeletingBirthday: (state) => state.deletingBirthday,
    getErrorDeleteBirthday: (state) => state.errorDeleteBirthday,
    getSelectedBirthdayAction: (state) => state.selectedBirthdayAction,
    getSelectedBirthday: (state) => {
      if (!Array.isArray(state.birthdays))
        return;

      if (!state.selectedBirthdayAction)
        return;

      let { action, id } = state.selectedBirthdayAction;
      if (!action || !id)
        return;

      id = id.toString();
      return state.birthdays.find(b => (b.id.toString() === id));
    },

    getImportBirthdaysResult: (state) => state.importBirthdaysResult,
    getImportingBirthdays: (state) => state.importingBirthdays,
    getShowModalImport: (state) => state.showModalImport,
    getErrorImportBirthdays: (state) => state.errorImportBirthdays,
    getRefreshList: (state) => state.refreshList,
  };

  if (!window.store)
    window.store = {};
  window.store.birthdayStore = {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
  };

})();
