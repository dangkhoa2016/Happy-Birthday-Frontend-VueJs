/*jshint esversion: 9 */

export default {
  components: {
    'x-icon': vueFeatherIcons.XIcon,
    'layout-icon': vueFeatherIcons.LayoutIcon,
    'users-icon': vueFeatherIcons.UsersIcon,
    'zap-icon': vueFeatherIcons.ZapIcon,
    'home-icon': vueFeatherIcons.HomeIcon,
    'codesandbox-icon': vueFeatherIcons.CodesandboxIcon,
    'sliders-icon': vueFeatherIcons.SlidersIcon,
  },
  data() {
    return {
    };
  },
  methods: {
    ...Vuex.mapActions({
      setSidebarVisible: 'appStore/setSidebarVisible',
    }),
  },
  computed: {
    ...Vuex.mapGetters({
      toggleButtonVisible: 'appStore/getToggleButtonVisible',
      navigations: 'appStore/getNavigations',
    }),
  },
};
