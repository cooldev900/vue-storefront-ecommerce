/**
 * List of modal names
 */
export enum ModalList {
  Review = 'm-modal-review',
  Auth = 'm-modal-authentication',
  SizeGuide = 'm-modal-size-guide',
  TermsAndConditions = 'm-modal-terms-and-conditions',
  FeatureNotImplemented = 'm-modal-feature-not-implemented',
  LanguageSwitcher = 'm-modal-language-switcher',
  OrderConfirmation = 'm-modal-order-confirmation',
  Newsletter = 'm-modal-newsletter',
  OmSelectorModal = 'om-selector-modal',
  OmLocatorsModal = 'om-locators-modal',
  OmVehicleViewerModal = 'om-vehicle-viewer-modal',
  OmCartPopupModal = 'om-cart-popup-modal',
  OmInfoModal = 'om-info-modal',
  OmCartCheckoutModal = 'om-cart-checkout-modal',
  OmEnquiryModal = 'om-enquiry-modal',
  OmContactModal = 'om-contact-modal'
}

/**
 * List of modal components files
 */
export const modalComponents = new Map([
  [ModalList.Review, () => import(/* webpackChunkName: "vsf-modals" */ 'theme/components/molecules/modals/m-modal-review.vue')],
  [ModalList.Auth, () => import(/* webpackChunkName: "vsf-modals" */ 'theme/components/molecules/modals/m-modal-authentication.vue')],
  [ModalList.SizeGuide, () => import(/* webpackChunkName: "vsf-modals" */ 'theme/components/molecules/modals/m-modal-size-guide.vue')],
  [ModalList.TermsAndConditions, () => import(/* webpackChunkName: "vsf-modals" */ 'theme/components/molecules/modals/m-modal-terms-and-conditions.vue')],
  [ModalList.FeatureNotImplemented, () => import(/* webpackChunkName: "vsf-modals" */ 'theme/components/molecules/modals/m-modal-feature-not-implemented.vue')],
  [ModalList.LanguageSwitcher, () => import(/* webpackChunkName: "vsf-modals" */ 'theme/components/molecules/modals/m-modal-language-switcher.vue')],
  [ModalList.OrderConfirmation, () => import(/* webpackChunkName: "vsf-modals" */ 'theme/components/molecules/modals/m-modal-order-confirmation.vue')],
  [ModalList.OmSelectorModal, () => import(/* webpackChunkName: "vsf-modals" */ 'theme/components/omni/om-selector-modal/index.vue')],
  [ModalList.OmLocatorsModal, () => import(/* webpackChunkName: "vsf-modals" */ 'theme/components/omni/modals/om-locators-modal.vue')],
  [ModalList.OmVehicleViewerModal, () => import(/* webpackChunkName: "vsf-modals" */ 'theme/components/omni/modals/om-vehicle-viewer-modal.vue')],
  [ModalList.OmCartPopupModal, () => import(/* webpackChunkName: "vsf-modals" */ 'theme/components/omni/modals/om-cart-popup.vue')],
  [ModalList.OmCartCheckoutModal, () => import(/* webpackChunkName: "vsf-modals" */ 'theme/components/omni/modals/om-cart-checkout.vue')],
  [ModalList.OmInfoModal, () => import(/* webpackChunkName: "vsf-modals" */ 'theme/components/omni/modals/om-info-modal.vue')],
  [ModalList.OmEnquiryModal, () => import(/* webpackChunkName: "vsf-modals" */ 'theme/components/omni/modals/om-enquiry-modal.vue')],
  [ModalList.OmContactModal, () => import(/* webpackChunkName: "vsf-modals" */ 'theme/components/omni/modals/om-contact-modal.vue')]
])

/**
 * Optional payload for modal
 */
export const modalPayload = new Map([])

export const modalStore = {
  state: {
    activeModals: [],
    loadedModals: []
  },
  getters: {
    activeModals: state => state.activeModals.map((name) => ({
      name,
      payload: modalPayload.get(name)
    })),
    loadedModals: state => state.loadedModals
  },
  mutations: {
    openModal (state, name) {
      if (!state.loadedModals.includes(name)) {
        state.loadedModals = [...state.loadedModals, name];
      }
      state.activeModals = [...state.activeModals, name];
    },
    closeModal (state, name) {
      state.activeModals = state.activeModals.filter(modal => modal !== name);
    }
  },
  actions: {
    openModal ({ commit }, { name, payload }) {
      modalPayload.set(name, payload)
      commit('closeModal', name)
      commit('openModal', name)
    },
    closeModal ({ commit }, { name }) {
      modalPayload.delete(name)
      commit('closeModal', name)
    }
  }
}
