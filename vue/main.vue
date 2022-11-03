
<script>
import TopHeader from './top-header.vue';
import Sidebar from './sidebar.vue';
import ModalBirthdayForm from './modal-birthday-form.vue';
import ToastMessage from './toast-message.vue';
import PageNotFound from './page-not-found.vue';
import UserForm from './user-form.vue';
import ModalImport from './modal-import.vue';
import ErrorLoadRoute from './error-load-route.vue';
const folderPath = '/vue';

Vue.use(VueRouter);

const excludeCheckAuthenticates = ['login', 'not-found'];

async function loadRouteComponent(path) {
  return new Promise(async (resolve) => {

    app.setErrorLoadRouteComponent(false);
    app.setLoadingRouteComponent(true);

    try {
      path = `${folderPath}/${path}`;
      await fetch(path, { method: 'HEAD' });
      const component = await import(path);
      app.setLoadingRouteComponent(false);
      resolve(component);
    } catch (ex) {
      console.log(ex);
      app.setErrorLoadRouteComponent(true);
      app.setLoadingRouteComponent(false);

      resolve();
    }
  });
}

const routes = [
  {
    path: '/',
    name: 'home',
    component: async () => await loadRouteComponent('home.vue'),
  },
  {
    path: '/settings',
    name: 'settings',
    component: async () => await loadRouteComponent('settings.vue'),
  },
  {
    path: '/login',
    name: 'login',
    component: async () => await loadRouteComponent('login.vue'),
  },
  {
    path: '/birthdays',
    name: 'birthdays',
    component: async () => await loadRouteComponent('birthdays.vue'),
  },
  {
    path: '/users', 
    name: 'users',
    component: async () => await loadRouteComponent('users.vue'),
  },
  {
    path: '/templates',
    name: 'templates',
    component: async () => await loadRouteComponent('templates.vue'),
  },
  {
    path: '/wish-quotes',
    name: 'wish-quotes',
    component: async () => await loadRouteComponent('wish-quotes.vue'),
  },
  { path: '*', name: 'not-found', component: PageNotFound },
];

const router = new VueRouter({
  routes, // short for `routes: routes`
});

const store = new Vuex.Store({
  modules: {
    appStore: window['store'].appStore,
    birthdayStore: window['store'].birthdayStore,
    userStore: window['store'].userStore,
    wishQuoteStore: window['store'].wishQuoteStore,
    templateStore: window['store'].templateStore,
  },
});

const checkAuth = async () => {
  const accessToken = await store.dispatch('appStore/getAccessToken',
    null, { root: true, });
  if (accessToken) return true;
  else return false;
};

router.beforeEach(async (to, from, next) => {
  if (
    !excludeCheckAuthenticates.includes(to.name.toLowerCase()) &&
    !(await checkAuth())
  ) {
    const returnTo = from.query.returnTo || to.fullPath;
    next({ name: 'login', query: { returnTo } });
  } else {
    app.setErrorLoadRouteComponent(false);
    next();
  }
});

const app = new Vue({
  components: {
    TopHeader,
    Sidebar,
    ModalBirthdayForm,
    UserForm,
    ToastMessage,
    ErrorLoadRoute,
    ModalImport,
    'arrow-up-circle-icon': vueFeatherIcons.ArrowUpCircleIcon,
  },
  template: window.app.html,
  store,
  i18n: window.i18n,
  el: '#app',
  router,
  data() {
    return {
      debouncedHeight: 0,
      debouncedWidth: 0,
      heightTimeout: null,
      widthTimeout: null,
      showGoToTop: false,
      loadingRouteComponent: null,
      errorLoadRouteComponent: null,
    };
  },
  computed: {
    ...Vuex.mapGetters({
      appLoaded: 'appStore/getAppLoaded',
      sidebarVisible: 'appStore/getSidebarVisible',
      windowWidthBreakpoint: 'appStore/getWindowWidthBreakpoint',
    }),
    isLoginPage() {
      return this.$route.name === 'login';
    },
    isNotFoundPage() {
      return this.$route.name === 'not-found';
    },
    windowHeight: {
      get() {
        return this.debouncedHeight;
      },
      set(val) {
        if (this.heightTimeout) clearTimeout(this.heightTimeout);
        this.heightTimeout = setTimeout(() => {
          this.debouncedHeight = val;
        }, 500);
      },
    },
    windowWidth: {
      get() {
        return this.debouncedWidth;
      },
      set(val) {
        if (this.widthTimeout) clearTimeout(this.widthTimeout);
        this.widthTimeout = setTimeout(() => {
          this.debouncedWidth = val;
        }, 500);
      },
    },
    overlayClass() {
      if (this.isLargeScreen) return '';
      else return this.sidebarVisible ? ' show' : '';
    },
    bodyEl() {
      return document.getElementsByTagName('body')[0];
    },
    isLargeScreen() {
      return this.windowWidth > this.windowWidthBreakpoint;
    },
  },
  watch: {
    sidebarVisible(val) {
      if (!this.bodyEl) return;

      if (val) {
        this.bodyEl.classList.remove('menu-hide', 'vertical-menu-modern');
        this.bodyEl.classList.add('menu-open', 'vertical-overlay-menu');
      } else {
        this.bodyEl.classList.add('menu-hide', 'vertical-menu-modern');
        this.bodyEl.classList.remove('menu-open');
      }
    },
    windowWidth(val) {
      if (!this.bodyEl) return;

      if (this.isLargeScreen) {
        this.bodyEl.classList.remove('vertical-overlay-menu');
        this.setToggleButtonVisible(false);
      } else {
        this.bodyEl.classList.add('vertical-overlay-menu');
        this.setToggleButtonVisible(true);
      }
    },
  },
  methods: {
    ...Vuex.mapActions({
      setAppLoaded: 'appStore/setAppLoaded',
      setSidebarVisible: 'appStore/setSidebarVisible',
      setToggleButtonVisible: 'appStore/setToggleButtonVisible',
    }),
    async setCompleted() {
      // console.log('setCompleted', this);
      delete window['store'];
      delete window['options'];
      delete window.handleErrors;
      delete window.sleep;
      delete window.setLocalStorageItem;
      delete window.getLocalStorageItem;
      delete window.i18n;
      delete window.isValidURL;
      // await this.sleep(1000);
      this.setAppLoaded(true);
    },
    handleResize() {
      this.windowWidth = window.innerWidth;
      this.windowHeight = window.innerHeight;
    },
    toggleSidebar() {
      if (this.windowWidth > this.const_windowWidth) {
        this.setSidebarVisible(true);
        this.setToggleButtonVisible(true);
      } else {
        this.setSidebarVisible(false);
        this.setToggleButtonVisible(false);
      }
    },
    handleScroll(ev) {
      this.showGoToTop = window.scrollY > 300;
    },
    goToTop() {
      window.scrollTo(0, 0);
    },
    setLoadingRouteComponent(value) {
      this.loadingRouteComponent = value;
    },
    setErrorLoadRouteComponent(value) {
      this.errorLoadRouteComponent = value;
      if (value)
        this.$bvModal.show('modal-error-load-route');
    },
    async reloadRoute() {
      this.setErrorLoadRouteComponent(false);
      router.push({ name: router.history.pending.name });
    },
  },
  created() {
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('scroll', this.handleScroll);
    this.handleResize();
    this.toggleSidebar();
  },
  destroyed() {
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('scroll', this.handleScroll);
  },
});

export default app;
</script>
