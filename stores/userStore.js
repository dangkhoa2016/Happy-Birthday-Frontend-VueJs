/*jshint esversion: 9 */

(function () {

  const handleErrors = window.handleErrors;
  // const sleep = window.sleep;

  const state = {
    users: [],
    modalData: null,

    errorLoadUsers: null,
    loadingUsers: false,
    needLogin: false,

    errorSaveUser: null,
    savingUser: false,
    saveUserResult: null,

    updateUserStatusResult: null,
    errorUpdateStatusUser: null,
    updatingStatusUser: false,

    deleteUserResult: null,
    errorDeleteUser: null,
    deletingUser: false,

    refreshList: null,
    importUsersResult: null,
    showModalImport: null,
    errorImportUsers: null,
    importingUsers: false,
  };

  const mutations = {
    SET_NEED_LOGIN(state, payload) {
      state.needLogin = payload;
    },
    SET_MODAL_DATA(state, payload) {
      state.modalData = { ...payload };
    },
    SET_REFRESH_LIST(state, payload) {
      state.refreshList = payload;
    },

    SET_ERROR_LOAD_USERS(state, payload) {
      state.errorLoadUsers = payload;
    },
    SET_LOADING_USERS(state, payload) {
      state.loadingUsers = payload;
    },
    SET_USERS(state, payload) {
      state.users = payload;
    },

    INTERNAL_UPDATE_DATA(state, payload) {
      const users = state.users;
      const username = payload.username.toLowerCase();
      const indx = users.findIndex(n => n.username.toLowerCase() === username);
      if (indx !== -1) {
        users[indx] = { ...users[indx], ...payload };
        state.users = [...users];
      } else
        users.push(payload);
    },
    SET_SAVE_USER_RESULT(state, payload) {
      state.saveUserResult = payload;
    },
    SET_ERROR_SAVE_USER(state, payload) {
      state.errorSaveUser = payload && payload.error ? payload.error : payload;
    },
    SET_SAVING_USER(state, payload) {
      state.savingUser = payload;
    },

    SET_UPDATE_USER_STATUS_RESULT(state, payload) {
      state.updateUserStatusResult = payload;
    },
    SET_ERROR_UPDATE_STATUS_USER(state, payload) {
      state.errorUpdateStatusUser = payload && payload.error ? payload.error : payload;
    },
    SET_UPDATING_STATUS_USER(state, payload) {
      state.updatingStatusUser = payload;
    },

    SET_ERROR_DELETE_USER(state, payload) {
      state.errorDeleteUser = payload && payload.error ? payload.error : payload;
    },
    SET_DELETING_USER(state, payload) {
      state.deletingUser = payload;
    },
    SET_DELETE_USER_RESULT(state, payload) {
      state.deleteUserResult = payload;
    },
    REMOVE_USER(state, username) {
      if (!username)
        return;

      const indx = state.users.findIndex(t => t.username.toLowerCase() === username.toLowerCase());
      if (indx !== -1)
        state.users.splice(indx, 1);
    },


    SET_SHOW_MODAL_IMPORT(state, payload) {
      state.showModalImport = payload;
    },
    SET_ERROR_IMPORT_USERS(state, payload) {
      state.errorImportUsers = payload;
    },
    SET_IMPORTING_USERS(state, payload) {
      state.importingUsers = payload;
    },
    SET_IMPORT_USERS_RESULT(state, payload) {
      state.importUsersResult = payload;
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
    setRefreshList(context, payload) {
      const { commit } = context;
      commit('SET_REFRESH_LIST', payload);
    },
    loadUsers(context, payload) {
      const { commit, dispatch, rootGetters } = context;
      const endpoint = rootGetters['appStore/getEndpoint'];

      return new Promise(async resolve => {
        commit('SET_LOADING_USERS', true);
        commit('SET_ERROR_LOAD_USERS', null);
        commit('SET_NEED_LOGIN', null);
        commit('SET_USERS', []);
        const accessToken = await dispatch('appStore/getAccessToken', null, { root: true });

        fetch(`${endpoint}/api/users`, {
          method: 'get', redirect: 'manual',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
        }).then(handleErrors)
          .then(result => {
            commit('SET_LOADING_USERS', false);

            if (typeof (result) === 'object' && result.error_token)
              commit('SET_NEED_LOGIN', true);
            else {
              if (typeof (result) === 'object' && result.error)
                commit('SET_ERROR_LOAD_USERS', result.error);
              else {
                const current_year = moment().year();
                commit('SET_USERS', result.map(user => {
                  date = window.moment(user.birthday, 'D-M-YYYY');
                  user.age = current_year - date.year();
                  return user;
                }));
              }
            }

            resolve();
          }).catch(err => {
            console.log('Error load users', err);
            commit('SET_LOADING_USERS', false);
            commit('SET_ERROR_LOAD_USERS', err);

            resolve();
          });
      });
    },
    setErrorSaveUser(context, payload) {
      const { commit } = context;
      commit('SET_ERROR_SAVE_USER', payload);
    },
    saveUser(context, payload) {
      const { commit, dispatch, rootGetters } = context;
      const endpoint = rootGetters['appStore/getEndpoint'];

      return new Promise(async resolve => {
        commit('SET_SAVING_USER', true);
        commit('SET_ERROR_SAVE_USER', null);
        commit('SET_NEED_LOGIN', null);
        commit('SET_SAVE_USER_RESULT', null);
        const accessToken = await dispatch('appStore/getAccessToken', null, { root: true });

        fetch(`${endpoint}/api/users`, {
          method: 'post', redirect: 'manual',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify(payload)
        }).then(handleErrors)
          .then(result => {
            commit('SET_SAVING_USER', false);

            if (typeof (result) === 'object' && result.error_token)
              commit('SET_NEED_LOGIN', true);
            else {
              if (typeof (result) === 'object' && result.error)
                commit('SET_ERROR_SAVE_USER', result.error);
              else {
                commit('INTERNAL_UPDATE_DATA', result);
                commit('SET_SAVE_USER_RESULT', result);
              }
            }

            resolve();
          }).catch(err => {
            console.log('Error save user', err);
            commit('SET_SAVING_USER', false);
            commit('SET_ERROR_SAVE_USER', err);

            resolve();
          });
      });
    },
    updateStatusUser(context, payload) {
      const { commit, dispatch, rootGetters } = context;
      const endpoint = rootGetters['appStore/getEndpoint'];

      return new Promise(async resolve => {
        commit('SET_UPDATING_STATUS_USER', true);
        commit('SET_ERROR_UPDATE_STATUS_USER', null);
        commit('SET_NEED_LOGIN', null);
        commit('SET_UPDATE_USER_STATUS_RESULT', null);
        const accessToken = await dispatch('appStore/getAccessToken', null, { root: true });

        fetch(`${endpoint}/api/users/status`, {
          method: 'post', redirect: 'manual',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify(payload)
        }).then(handleErrors)
          .then(result => {
            commit('SET_UPDATING_STATUS_USER', false);

            if (typeof (result) === 'object' && result.status === 404)
              result.error = result.status;
            if (typeof (result) === 'object' && result.error_token)
              commit('SET_NEED_LOGIN', true);
            else {
              if (typeof (result) === 'object' && result.error)
                commit('SET_ERROR_UPDATE_STATUS_USER', result.error);
              else {
                commit('INTERNAL_UPDATE_DATA', {
                  username: payload.username, updated_at: result.updated_at,
                  enabled: payload.status.toLowerCase() === 'enable'
                });
                commit('SET_UPDATE_USER_STATUS_RESULT', result);
              }
            }

            resolve();
          }).catch(err => {
            console.log('Error update user status', err);
            commit('SET_UPDATING_STATUS_USER', false);
            commit('SET_ERROR_UPDATE_STATUS_USER', err);

            resolve();
          });
      });
    },
    deleteUser(context, username) {
      const { commit, dispatch, rootGetters } = context;
      const endpoint = rootGetters['appStore/getEndpoint'];

      return new Promise(async resolve => {
        commit('SET_DELETING_USER', true);
        commit('SET_ERROR_DELETE_USER', null);
        commit('SET_NEED_LOGIN', null);
        commit('SET_DELETE_USER_RESULT', null);
        const accessToken = await dispatch('appStore/getAccessToken', null, { root: true });

        fetch(`${endpoint}/api/users/${username}`, {
          method: 'delete', redirect: 'manual',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
        }).then(handleErrors)
          .then(result => {
            commit('SET_DELETING_USER', false);

            if (typeof (result) === 'object' && result.error_token)
              commit('SET_NEED_LOGIN', true);
            else {
              if (typeof (result) === 'object' && result.error)
                commit('SET_ERROR_DELETE_USER', result.error);
              else {
                commit('SET_DELETE_USER_RESULT', result);
                commit('REMOVE_USER', username);
              }
            }

            resolve();
          }).catch(err => {
            console.log('Error delete user', err);
            commit('SET_DELETING_USER', false);
            commit('SET_ERROR_DELETE_USER', err);

            resolve();
          });
      });
    },

    downloadUsers(context, type) {
      const { rootGetters, dispatch } = context;
      const endpoint = rootGetters['appStore/getEndpoint'];

      return new Promise(async resolve => {
        const accessToken = await dispatch('appStore/getAccessToken', null, { root: true });
        fetch(`${endpoint}/api/users/export?format=${type}`, {
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
          console.log('Error download users', ex);
          resolve([]);
        });
      });
    },

    importUsers(context, payload) {
      const { commit, dispatch, rootGetters } = context;
      const endpoint = rootGetters['appStore/getEndpoint'];

      return new Promise(async resolve => {
        commit('SET_IMPORTING_USERS', true);
        commit('SET_ERROR_IMPORT_USERS', null);
        commit('SET_NEED_LOGIN', null);
        commit('SET_IMPORT_USERS_RESULT', null);
        const accessToken = await dispatch('appStore/getAccessToken', null, { root: true });

        fetch(`${endpoint}/api/users/import`, {
          method: 'post', redirect: 'manual',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify(payload)
        }).then(handleErrors)
          .then(result => {
            commit('SET_IMPORTING_USERS', false);

            if (typeof (result) === 'object' && result.status === 411)
              result.message = 0;
            if (typeof (result) === 'object' && result.error_token)
              commit('SET_NEED_LOGIN', true);
            else {
              if (typeof (result) === 'object' && result.error)
                commit('SET_ERROR_IMPORT_USERS', result.error);
              else
                commit('SET_IMPORT_USERS_RESULT', result);
            }

            resolve();
          }).catch(err => {
            console.log('Error import wish quotes', err);
            commit('SET_IMPORTING_USERS', false);
            commit('SET_ERROR_IMPORT_USERS', err);

            resolve();
          });
      });
    },
    setErrorImportUsers(context, payload) {
      const { commit } = context;
      commit('SET_ERROR_IMPORT_USERS', payload);
    },
    setShowModalImport(context, payload) {
      const { commit } = context;
      commit('SET_SHOW_MODAL_IMPORT', payload);
    },
  };

  const getters = {
    getNeedLogin: (state) => state.needLogin,
    getModalData: (state) => state.modalData,

    getErrorLoadUsers: (state) => state.errorLoadUsers,
    getCachedUsers: (state) => state.users,
    getLoadingUsers: (state) => state.loadingUsers,

    getErrorSaveUser: (state) => state.errorSaveUser,
    getSavingUser: (state) => state.savingUser,
    getSaveUserResult: (state) => state.saveUserResult,

    getUpdateUserStatusResult: (state) => state.updateUserStatusResult,
    getUpdatingStatusUser: (state) => state.updatingStatusUser,
    getErrorUpdateStatusUser: (state) => state.errorUpdateStatusUser,

    getDeleteUserResult: (state) => state.deleteUserResult,
    getDeletingUser: (state) => state.deletingUser,
    getErrorDeleteUser: (state) => state.errorDeleteUser,

    getImportUsersResult: (state) => state.importUsersResult,
    getImportingUsers: (state) => state.importingUsers,
    getShowModalImport: (state) => state.showModalImport,
    getErrorImportUsers: (state) => state.errorImportUsers,
    getRefreshList: (state) => state.refreshList,
  };

  if (!window.store)
    window.store = {};
  window.store.userStore = {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
  };

})();
