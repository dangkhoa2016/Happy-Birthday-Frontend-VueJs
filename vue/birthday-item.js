/*jshint esversion: 9 */

export default {
  components: {
    'x-icon': vueFeatherIcons.XIcon,
    'layout-icon': vueFeatherIcons.LayoutIcon,
    'aperture-icon': vueFeatherIcons.ApertureIcon,
    'x-square-icon': vueFeatherIcons.XSquareIcon,
    'users-icon': vueFeatherIcons.UsersIcon,
    'eye-icon': vueFeatherIcons.EyeIcon,
    'home-icon': vueFeatherIcons.HomeIcon,
    'codesandbox-icon': vueFeatherIcons.CodesandboxIcon,
    'sliders-icon': vueFeatherIcons.SlidersIcon,
  },
  props: {
    birthday: {
      type: Object,
      default: () => { return {}; }
    }
  },
  data() {
    return {
      detailFields: [
        { label: 'ID', field: 'id' },
        { label: 'created_at', field: 'created_at' },
        { label: 'updated_at', field: 'updated_at' },
      ],
    };
  },
  methods: {
    ...Vuex.mapActions({
      setModalData: 'birthdayStore/setModalData',
      setNeedLogin: 'birthdayStore/setNeedLogin',
      setSelectedBirthdayAction: 'birthdayStore/setSelectedBirthdayAction',
    }),
    showConfirm(action) {
      this.setNeedLogin(false);
      this.setSelectedBirthdayAction({ action, id: this.birthday.id });
      this.$bvModal.show('confirm-action-birthday');
    },
    showEdit() {
      this.setModalData({
        id: this.birthday.id,
        username: this.birthday.user && this.birthday.user.username,
        template: this.birthday.template && this.birthday.template.id,
        enabled: this.birthday.enabled
      });
    },
  },
  computed: {
    ...Vuex.mapGetters({
      endpoint: 'appStore/getEndpoint',
    }),
  },
};
