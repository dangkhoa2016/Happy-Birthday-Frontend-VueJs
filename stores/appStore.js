/*jshint esversion: 9 */

(function () {

  const setLocalStorageItem = window.setLocalStorageItem;
  const getLocalStorageItem = window.getLocalStorageItem;
  const handleErrors = window.handleErrors;

  const state = {
    showModal: false,
    appLoaded: false,
    sidebarVisible: null,
    constWindowWidthBreakpoint: 1200,
    toggleButtonVisible: null,
    endpoint: 'https://happy-birthday.dangkhoa.dev',
    // endpoint: 'https://fuschia-zesty-baroness.glitch.me',
    directionOptions: [{ value: 'asc', text: 'sort_asc' }, { value: 'desc', text: 'sort_desc' }],

    //users page
    usersPageOptions: [{ value: 5, text: '5' }, { value: 10, text: '10' },
    { value: 15, text: '15' }, { value: 100, text: 'per_page_many' }],
    usersSortOptions: [{ value: 'name', text: 'users.name' },
    { value: 'age', text: 'users.age' }, { value: 'enabled', text: 'active' }],
    usersPageSize: 10,
    usersSortBy: '',
    usersSortDirection: 'asc',

    //birthdays page
    birthdaysSortBy: '',
    birthdaysSortOptions: [{ value: 'user.name', text: 'users.name' },
    { value: 'template.name', text: 'template_label' },
    { value: 'enabled', text: 'active' }],
    birthdaysSortDirection: 'asc',

    toastMessage: '',
    navigations: [
      {
        to: { name: 'home' },
        text: 'home',
        icon: 'home-icon',
        exact: true,
      },
      {
        to: { name: 'birthdays' },
        text: 'birthdays',
        icon: 'layout-icon'
      },
      {
        to: { name: 'users' },
        text: 'users',
        icon: 'users-icon'
      },
      {
        to: { name: 'wish-quotes' },
        text: 'wish_quotes',
        icon: 'sliders-icon'
      },
      {
        to: { name: 'templates' },
        text: 'templates',
        icon: 'zap-icon'
      },
      {
        to: { name: 'settings' },
        text: 'settings',
        icon: 'codesandbox-icon'
      },
    ]
  };

  const mutations = {
    SET_TOAST_MESSAGE(state, payload) {
      state.toastMessage = payload;
    },
    SET_ENDPOINT(state, payload) {
      state.endpoint = payload;
    },
    SET_REFRESH_TOKEN(state, payload) {
      const { expiresIn, refreshToken } = payload;
      setLocalStorageItem('refresh_token', refreshToken, expiresIn);
    },
    SET_ACCESS_TOKEN(state, payload) {
      const { expiresIn, accessToken } = payload;
      setLocalStorageItem('access_token', accessToken, expiresIn - 60);
    },
    SET_APP_LOADED(state, payload) {
      state.appLoaded = payload;
    },
    SET_SIDEBAR_VISIBLE(state, payload) {
      state.sidebarVisible = payload;
    },
    SET_TOGGLE_BUTTON_VISIBLE(state, payload) {
      state.toggleButtonVisible = payload;
    },


    SET_USERS_PAGE_SIZE(state, payload) {
      state.usersPageSize = payload;
    },
    SET_USERS_SORT_BY(state, payload) {
      state.usersSortBy = payload;
    },
    SET_USERS_SORT_ASC(state, payload) {
      state.usersSortDirection = payload;
    },


    SET_BIRTHDAYS_SORT_BY(state, payload) {
      state.birthdaysSortBy = payload;
    },
    SET_BIRTHDAYS_SORT_ASC(state, payload) {
      state.birthdaysSortDirection = payload;
    },
  };

  const actions = {
    setToastMessage({ commit }, payload) {
      commit('SET_TOAST_MESSAGE', payload);
    },
    setEndpoint(context, payload) {
      const { commit } = context;
      commit('SET_ENDPOINT', payload);
    },
    setSidebarVisible(context, payload) {
      const { commit } = context;
      commit('SET_SIDEBAR_VISIBLE', payload);
    },
    setAppLoaded(context, payload) {
      const { commit } = context;
      commit('SET_APP_LOADED', payload);
    },
    setToggleButtonVisible(context, payload) {
      const { commit } = context;
      commit('SET_TOGGLE_BUTTON_VISIBLE', payload);
    },
    setAccessToken(context, payload) {
      const { commit } = context;
      commit('SET_ACCESS_TOKEN', payload);
    },
    setRefreshToken(context, payload) {
      const { commit } = context;
      commit('SET_REFRESH_TOKEN', payload);
    },


    setUsersPageSize(context, payload) {
      const { commit } = context;
      commit('SET_USERS_PAGE_SIZE', payload);
    },
    setUsersSortBy(context, payload) {
      const { commit } = context;
      commit('SET_USERS_SORT_BY', payload);
    },
    setUsersSortDirection(context, payload) {
      const { commit } = context;
      commit('SET_USERS_SORT_ASC', payload);
    },


    setBirthdaysSortBy(context, payload) {
      const { commit } = context;
      commit('SET_BIRTHDAYS_SORT_BY', payload);
    },
    setBirthdaysSortDirection(context, payload) {
      const { commit } = context;
      commit('SET_BIRTHDAYS_SORT_ASC', payload);
    },


    getAccessToken(context) {
      return new Promise(async resolve => {
        const { dispatch } = context;
        const accessToken = getLocalStorageItem('access_token');
        if (accessToken)
          resolve(accessToken);
        else
          resolve(await dispatch('refreshToken'));
      });
    },

    refreshToken(context) {
      const { commit, rootGetters } = context;
      const endpoint = rootGetters['appStore/getEndpoint'];
      const refreshToken = getLocalStorageItem('refresh_token');
      if (!refreshToken)
        return;

      return new Promise(resolve => {
        fetch(`${endpoint}/admin/api/refresh_token`, {
          method: 'post', redirect: 'manual',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refresh_token: refreshToken })
        }).then(handleErrors)
          .then(json => {
            if (json && json.accessToken) {
              commit('SET_ACCESS_TOKEN', { accessToken: json.accessToken, expiresIn: json.accessTokenExpiresIn });
              if (json.refreshToken)
                commit('SET_REFRESH_TOKEN', { refreshToken: json.refreshToken, expiresIn: json.refreshTokenExpiresIn });
            }
            resolve(json && json.accessToken);
          }).catch(err => {
            console.log('Error refreshToken', err);
            resolve();
          });
      });
    },
  };

  const getters = {
    getEndpoint: (state) => {
      let endpoint = state.endpoint;
      if ((endpoint || '').length < 4)
        endpoint = '';

      return endpoint;
    },
    getAppLoaded: (state) => state.appLoaded,
    getSidebarVisible: (state) => state.sidebarVisible,
    getWindowWidthBreakpoint: (state) => state.constWindowWidthBreakpoint,
    getToggleButtonVisile: (state) => state.toggleButtonVisible,
    getDirectionOptions: (state) => state.directionOptions,

    getUsersPageSize: (state) => state.usersPageSize,
    getUsersPageOptions: (state) => state.usersPageOptions,
    getUsersSortOptions: (state) => state.usersSortOptions,
    getUsersSortDirection: (state) => state.usersSortDirection,
    getUsersSortBy: (state) => state.usersSortBy,

    getBirthdaysSortDirection: (state) => state.birthdaysSortDirection,
    getBirthdaysSortOptions: (state) => state.birthdaysSortOptions,
    getBirthdaysSortBy: (state) => state.birthdaysSortBy,

    getToastMessage: (state) => state.toastMessage,
    getNavigations: (state) => state.navigations,
  };

  if (!window.store)
    window.store = {};
  window.store.appStore = {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
  };

})();
