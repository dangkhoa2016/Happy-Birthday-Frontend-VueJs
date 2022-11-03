/*jshint esversion: 9 */

export default {
  components: {
    'menu-icon': vueFeatherIcons.MenuIcon,
    'log-out-icon': vueFeatherIcons.LogOutIcon,
  },
  methods: {
    ...Vuex.mapActions({
      setAccessToken: 'appStore/setAccessToken',
      setRefreshToken: 'appStore/setRefreshToken',
      setSidebarVisible: 'appStore/setSidebarVisible',
    }),
    logout() {
      this.setAccessToken('');
      this.setRefreshToken('');
      this.$router.push({ name: 'login', query: { returnTo: this.$route.fullPath } }); 
    },
  },
};
