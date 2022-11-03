/*jshint esversion: 9 */

export default {
  components: {
    'v-select': VueSelect.VueSelect,
  },
  methods: {
    ...Vuex.mapActions({
      setEndpoint: 'appStore/setEndpoint',
      setToastMessage: 'appStore/setToastMessage',

      setUsersPageSize: 'appStore/setUsersPageSize',
      setUsersSortBy: 'appStore/setUsersSortBy',
      setUsersSortDirection: 'appStore/setUsersSortDirection',

      setBirthdaysSortBy: 'appStore/setBirthdaysSortBy',
      setBirthdaysSortDirection: 'appStore/setBirthdaysSortDirection',
    }),
    reset() {
      this.form.endpoint = this.defaultEndpoint;
      this.form.usersPageSize = this.defaultUsersPageSize;
      this.form.usersSortBy = this.defaultUsersSortBy;
      this.form.usersSortDirection = this.defaultUsersSortDirection;
      this.form.birthdaysSortBy = this.defaultBirthdaysSortBy;
      this.form.birthdaysSortDirection = this.defaultBirthdaysSortDirection;
    },
    save() {
      this.setEndpoint(this.form.endpoint);

      this.setUsersPageSize(this.form.usersPageSize);
      this.setUsersSortBy(this.form.usersSortBy);
      this.setUsersSortDirection(this.form.usersSortDirection);

      this.setBirthdaysSortBy(this.form.birthdaysSortBy);
      this.setBirthdaysSortDirection(this.form.birthdaysSortDirection);

      this.setToastMessage(this.$root.$t('settings.saved'));
    },
  },
  data() {
    return {
      form: {
        endpoint: '',

        //users page
        usersPageSize: 0,
        usersSortBy: '',
        usersSortDirection: true,

        //birthdays page
        birthdaysSortBy: '',
        birthdaysSortDirection: true,
      },
    };
  },
  computed: {
    ...Vuex.mapGetters({
      defaultEndpoint: 'appStore/getEndpoint',

      usersPageOptions: 'appStore/getUsersPageOptions',
      usersSortOptions: 'appStore/getUsersSortOptions',
      defaultUsersPageSize: 'appStore/getUsersPageSize',
      defaultUsersSortDirection: 'appStore/getUsersSortDirection',
      directionOptions: 'appStore/getDirectionOptions',
      defaultUsersSortBy: 'appStore/getUsersSortBy',

      defaultBirthdaysSortDirection: 'appStore/getBirthdaysSortDirection',
      birthdaysSortOptions: 'appStore/getBirthdaysSortOptions',
      defaultBirthdaysSortBy: 'appStore/getBirthdaysSortBy',
    }),
  },
  mounted() {
    this.reset();
  },
};