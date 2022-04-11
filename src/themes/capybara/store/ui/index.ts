import supportsWebP from 'supports-webp';
import { modalStore } from './modals';
export const uiStore = {
  namespaced: true,
  modules: {
    modal: modalStore
  },
  state: {
    sidebar: {
      open: false,
      type: 'microcart'
    },
    microcart: false,
    searchpanel: false,
    overlay: false,
    loader: false,
    checkoutMode: false,
    openMyAccount: false,
    submenu: {
      depth: false,
      path: []
    },
    isWebpSupported: true,
    isReviewProductTab: false,
    isMobileMenu: false
  },
  getters: {
    isMicrocartOpen: ({ sidebar }) => {
      return sidebar.type === 'microcart' && sidebar.open;
    },
    isVehicleCartOpen: ({ sidebar }) => {
      return sidebar.type === 'vehiclecart' && sidebar.open;
    },
    isLocationCartOpen: ({ sidebar }) => {
      return sidebar.type === 'locationcart' && sidebar.open;
    },
    isSidebarOpen: ({ sidebar }) => {
      return sidebar.open;
    }
  },
  mutations: {
    setCheckoutMode (state, action) {
      state.checkoutMode = action === true;
    },
    setMicrocart (state, action) {
      state.microcart = action === true;
      state.overlay = action === true;
    },
    setSidebar (state, action) {
      state.sidebar = action;
      state.overlay = true;
    },
    setSubmenu (state, { id, depth }) {
      if (id) {
        state.submenu.path.push(id);
      } else if (state.submenu.path.length) {
        setTimeout(() => {
          state.submenu.path.pop();
        }, 300);
      }
      state.submenu.depth = state.submenu.depth > 0 && depth;
    },
    setSearchpanel (state, action) {
      state.searchpanel = action === true;
      state.overlay = action === true;
    },
    setOverlay (state, action) {
      state.overlay = action === true;
    },
    setLoader (state, action) {
      state.loader = action === true;
    },
    setWebpSupport (state, action) {
      state.isWebpSupported = action;
    },
    setReviewProductTab (state, action) {
      state.isReviewProductTab = action;
    },
    openMenu (state) {
      state.isMobileMenu = true;
    },
    closeMenu (state) {
      state.isMobileMenu = false;
    }
  },
  actions: {
    toggleMicrocart ({ commit, state }) {
      commit('setMicrocart', !state.microcart);
    },
    toggleSidebar ({ commit, state }, { type }) {
      if (type !== state.type) {
        commit('setSidebar', { open: true, type });
      } else {
        commit('setSidebar', { open: !state.sidebar.open, type });
      }
    },
    checkWebpSupport ({ commit }) {
      supportsWebP.then(isWebpSupported => {
        commit('setWebpSupport', isWebpSupported);
      });
    },
    closeMicrocart ({ commit, state }) {
      if (state.microcart) commit('setMicrocart', false);
    },
    closeSidebar ({ commit, state }) {
      if (state.sidebar) {
        commit('setSidebar', { open: false, type: state.sidebar.type });
      }
    },
    closeWishlist ({ commit, state }) {
      if (state.wishlist) commit('setWishlist', false);
    }
  }
};
