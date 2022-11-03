/*jshint esversion: 9 */

(function () {

  const handleErrors = window.handleErrors;
  // const sleep = window.sleep;

  const state = {
    templates: [],
    selectedTemplateId: null,
    addAction: null,

    errorLoadTemplates: null,
    loadingTemplates: false,
    needLogin: false,

    errorSaveTemplate: null,
    savingTemplate: false,
    saveTemplateResult: null,

    deleteTemplateResult: null,
    errorDeleteTemplate: null,
    deletingTemplate: false,

    importTemplatesResult: null,
    showModalImport: null,
    errorImportTemplates: null,
    importingTemplates: false,
    refreshList: null,
  };

  const mutations = {
    SET_NEED_LOGIN(state, payload) {
      state.needLogin = payload;
    },
    SET_SELECTED_TEMPLATE_ID(state, payload) {
      state.selectedTemplateId = payload;
    },
    SET_REFRESH_LIST(state, payload) {
      state.refreshList = payload;
    },


    SET_ERROR_LOAD_TEMPLATES(state, payload) {
      state.errorLoadTemplates = payload && payload.error ? payload.error : payload;
    },
    SET_LOADING_TEMPLATES(state, payload) {
      state.loadingTemplates = payload;
    },
    SET_TEMPLATES(state, payload) {
      state.templates = payload;
    },

    SET_SAVE_TEMPLATE_RESULT(state, payload) {
      state.saveTemplateResult = payload;
    },
    SET_ERROR_SAVE_TEMPLATE(state, payload) {
      state.errorSaveTemplate = payload && payload.error ? payload.error : payload;
    },
    SET_SAVING_TEMPLATE(state, payload) {
      state.savingTemplate = payload;
    },


    SET_ERROR_DELETE_TEMPLATE(state, payload) {
      state.errorDeleteTemplate = payload && payload.error ? payload.error : payload;
    },
    SET_DELETING_TEMPLATE(state, payload) {
      state.deletingTemplate = payload;
    },
    SET_DELETE_TEMPLATE_RESULT(state, payload) {
      state.deleteTemplateResult = payload;
    },
    REMOVE_SELECTED_TEMPLATE(state) {
      if (!state.selectedTemplateId)
        return;

      const indx = state.templates.findIndex(t => t.id.toString() === state.selectedTemplateId.toString());
      if (indx < 0)
        return;

      state.templates.splice(indx, 1);
      state.selectedTemplateId = '';
    },


    ADD_TEMPORATORY_TEMPLATE(state, action) {
      state.templates[action]({
        id: `t-${(new Date()).valueOf()}`,
        name: '', url: '', thumb: '', enabled: true,
      });
    },
    ADD_ACTION(state, action) {
      state.addAction = action;
    },


    INTERNAL_UPDATE_DATA(state, payload) {
      const templates = state.templates;
      let id = null;
      if (payload.tempId) {
        id = payload.tempId;
        delete payload.tempId;
      } else
        id = payload.id.toString();
      const indx = templates.findIndex(n => n.id.toLowerCase() === id);
      if (indx !== -1) {
        templates[indx] = { ...templates[indx], ...payload };
        state.templates = [...templates];
      }
    },


    SET_SHOW_MODAL_IMPORT(state, payload) {
      state.showModalImport = payload;
    },
    SET_ERROR_IMPORT_TEMPLATES(state, payload) {
      state.errorImportTemplates = payload;
    },
    SET_IMPORTING_TEMPLATES(state, payload) {
      state.importingTemplates = payload;
    },
    SET_IMPORT_TEMPLATES_RESULT(state, payload) {
      state.importTemplatesResult = payload;
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
    loadTemplates(context, payload) {
      const { commit, dispatch, rootGetters } = context;
      const endpoint = rootGetters['appStore/getEndpoint'];

      return new Promise(async resolve => {
        commit('SET_LOADING_TEMPLATES', true);
        commit('SET_ERROR_LOAD_TEMPLATES', null);
        commit('SET_NEED_LOGIN', null);
        commit('SET_TEMPLATES', []);
        const accessToken = await dispatch('appStore/getAccessToken', null, { root: true });

        fetch(`${endpoint}/api/templates`, {
          method: 'get', redirect: 'manual',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
        }).then(handleErrors)
          .then(result => {
            commit('SET_LOADING_TEMPLATES', false);

            if (typeof (result) === 'object' && result.error_token)
              commit('SET_NEED_LOGIN', true);
            else {
              if (typeof (result) === 'object' && result.error)
                commit('SET_ERROR_LOAD_TEMPLATES', result.error);
              else {
                commit('SET_TEMPLATES', result);
              }
            }

            resolve();
          }).catch(err => {
            console.log('Error load templates', err);
            commit('SET_LOADING_TEMPLATES', false);
            commit('SET_ERROR_LOAD_TEMPLATES', err);

            resolve();
          });
      });
    },
    setErrorSaveTemplate(context, payload) {
      const { commit } = context;
      commit('SET_ERROR_SAVE_TEMPLATE', payload);
    },
    addTemporatoryTemplate(context, action) {
      const { commit } = context;
      commit('ADD_TEMPORATORY_TEMPLATE', action);
      commit('ADD_ACTION', action);
    },
    setAddAction(context, payload) {
      const { commit } = context;
      commit('ADD_ACTION', payload);
    },
    setSelectedTemplateId(context, payload) {
      const { commit } = context;
      commit('SET_SELECTED_TEMPLATE_ID', payload);
    },
    setDeletingTemplate(context, payload) {
      const { commit } = context;
      commit('SET_DELETING_TEMPLATE', payload);
    },
    saveTemplate(context, payload) {
      const { commit, dispatch, rootGetters } = context;
      const endpoint = rootGetters['appStore/getEndpoint'];
      let { name, thumb, url, enabled = false, id, tempId = '' } = payload;
      const isTemporatory = id.indexOf('t-') === 0;
      if (isTemporatory) {
        tempId = id;
        id = null;
      }

      return new Promise(async resolve => {
        commit('SET_SAVING_TEMPLATE', true);
        commit('SET_ERROR_SAVE_TEMPLATE', null);
        commit('SET_NEED_LOGIN', null);
        commit('SET_SAVE_TEMPLATE_RESULT', null);
        const accessToken = await dispatch('appStore/getAccessToken', null, { root: true });

        fetch(`${endpoint}/api/templates`, {
          method: 'post', redirect: 'manual',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify({ name, thumb, url, enabled, id })
        }).then(handleErrors)
          .then(result => {
            commit('SET_SAVING_TEMPLATE', false);

            if (typeof (result) === 'object' && !result.error_token) {
              if (result.error)
                commit('SET_ERROR_SAVE_TEMPLATE', result.error);
              else {
                if (isTemporatory)
                  result.tempId = tempId;
                commit('SET_SAVE_TEMPLATE_RESULT', result);
                commit('INTERNAL_UPDATE_DATA', result);
              }
            }
            resolve(result);
          }).catch(err => {
            console.log('Error save template', err);
            commit('SET_SAVING_TEMPLATE', false);
            commit('SET_ERROR_SAVE_TEMPLATE', err);

            resolve({ error: err.message });
          });
      });
    },
    deleteTemplate(context) {
      const { commit, getters, dispatch, rootGetters } = context;
      const endpoint = rootGetters['appStore/getEndpoint'];
      const template = getters.getSelectedTemplate;
      const isTemporatory = template.id.indexOf('t-') === 0;

      if (!template.id) {
        commit('SET_DELETE_TEMPLATE_RESULT', {});
        return;
      } else if (isTemporatory) {
        commit('SET_DELETE_TEMPLATE_RESULT', true);
        commit('REMOVE_SELECTED_TEMPLATE');
        return;
      }

      return new Promise(async resolve => {
        commit('SET_DELETING_TEMPLATE', true);
        commit('SET_ERROR_DELETE_TEMPLATE', null);
        commit('SET_NEED_LOGIN', null);
        commit('SET_DELETE_TEMPLATE_RESULT', null);
        const accessToken = await dispatch('appStore/getAccessToken', null, { root: true });

        fetch(`${endpoint}/api/templates/${template.id}`, {
          method: 'delete', redirect: 'manual',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
        }).then(handleErrors)
          .then(result => {
            commit('SET_DELETING_TEMPLATE', false);

            if (typeof (result) === 'object' && result.error_token)
              commit('SET_NEED_LOGIN', true);
            else {
              if (typeof (result) === 'object' && result.error)
                commit('SET_ERROR_DELETE_TEMPLATE', result.error);
              else {
                commit('SET_DELETE_TEMPLATE_RESULT', { id: !isTemporatory && template.id });
                commit('REMOVE_SELECTED_TEMPLATE');
              }
            }

            resolve();
          }).catch(err => {
            console.log('Error delete template', err);
            commit('SET_DELETING_TEMPLATE', false);
            commit('SET_ERROR_DELETE_TEMPLATE', err);

            resolve();
          });
      });
    },
    downloadTemplates(context, type) {
      const { rootGetters, dispatch } = context;
      const endpoint = rootGetters['appStore/getEndpoint'];

      return new Promise(async resolve => {
        const accessToken = await dispatch('appStore/getAccessToken', null, { root: true });
        fetch(`${endpoint}/api/templates/export?format=${type}`, {
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
          console.log('Error download templates', ex);
          resolve([]);
        });
      });
    },

    importTemplates(context, payload) {
      const { commit, dispatch, rootGetters } = context;
      const endpoint = rootGetters['appStore/getEndpoint'];

      return new Promise(async resolve => {
        commit('SET_IMPORTING_TEMPLATES', true);
        commit('SET_ERROR_IMPORT_TEMPLATES', null);
        commit('SET_NEED_LOGIN', null);
        commit('SET_IMPORT_TEMPLATES_RESULT', null);
        const accessToken = await dispatch('appStore/getAccessToken', null, { root: true });

        fetch(`${endpoint}/api/templates/import`, {
          method: 'post', redirect: 'manual',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify(payload)
        }).then(handleErrors)
          .then(result => {
            commit('SET_IMPORTING_TEMPLATES', false);

            if (typeof (result) === 'object' && result.status === 411)
              result.message = 0;
            if (typeof (result) === 'object' && result.error_token)
              commit('SET_NEED_LOGIN', true);
            else {
              if (typeof (result) === 'object' && result.error)
                commit('SET_ERROR_IMPORT_TEMPLATES', result.error);
              else
                commit('SET_IMPORT_TEMPLATES_RESULT', result);
            }

            resolve();
          }).catch(err => {
            console.log('Error import templates', err);
            commit('SET_IMPORTING_TEMPLATES', false);
            commit('SET_ERROR_IMPORT_TEMPLATES', err);

            resolve();
          });
      });
    },
    setErrorImportTemplates(context, payload) {
      const { commit } = context;
      commit('SET_ERROR_IMPORT_TEMPLATES', payload);
    },
    setShowModalImport(context, payload) {
      const { commit } = context;
      commit('SET_SHOW_MODAL_IMPORT', payload);
    },
  };

  const getters = {
    getNeedLogin: (state) => state.needLogin,
    getAddAction: (state) => state.addAction,

    getSelectedTemplate: (state) => {
      if (!state.selectedTemplateId || !Array.isArray(state.templates) || state.templates.length === 0)
        return;

      id = state.selectedTemplateId.toString();
      return state.templates.find(w => w.id.toString() === id);
    },

    getCachedTemplates: (state) => (onlyHasId = false) => {
      if (!Array.isArray(state.templates))
        return [];

      if (onlyHasId)
        return state.templates.filter(t => t.id.toString().toLowerCase().indexOf('t-') === -1);
      else
        return state.templates;
    },
    getErrorLoadTemplates: (state) => state.errorLoadTemplates,
    getLoadingTemplates: (state) => state.loadingTemplates,

    getErrorSaveTemplate: (state) => state.errorSaveTemplate,
    getSavingTemplate: (state) => state.savingTemplate,
    getSaveTemplateResult: (state) => state.saveTemplateResult,

    getDeleteTemplateResult: (state) => state.deleteTemplateResult,
    getDeletingTemplate: (state) => state.deletingTemplate,
    getErrorDeleteTemplate: (state) => state.errorDeleteTemplate,

    getImportTemplatesResult: (state) => state.importTemplatesResult,
    getImportingTemplates: (state) => state.importingTemplates,
    getShowModalImport: (state) => state.showModalImport,
    getErrorImportTemplates: (state) => state.errorImportTemplates,
    getRefreshList: (state) => state.refreshList,
  };

  if (!window.store)
    window.store = {};
  window.store.templateStore = {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
  };

})();
