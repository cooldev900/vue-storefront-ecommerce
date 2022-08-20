/**
 * List of modal names
 */
export enum ModalList {
  Auth = 'm-modal-authentication',
  FeatureNotImplemented = 'm-modal-feature-not-implemented',
  OrderConfirmation = 'm-modal-order-confirmation',
  OmSelectorModal = 'om-selector-modal',
  OmLocatorsModal = 'om-locators-modal',
  OmVehicleViewerModal = 'om-vehicle-viewer-modal',
  OmCartPopupModal = 'om-cart-popup-modal',
  OmInfoModal = 'om-info-modal',
  OmCartCheckoutModal = 'om-cart-checkout-modal',
  OmEnquiryModal = 'om-enquiry-modal',
  OmContactModal = 'om-contact-modal',
  OmAppointmentModal = "om-appointment-modal"
}

/**
 * List of modal components files
 */
export const modalComponents = new Map([
  [ModalList.Auth, () => import(/* webpackChunkName: "vsf-modals" */ 'theme/components/molecules/modals/m-modal-authentication.vue')],
  [ModalList.FeatureNotImplemented, () => import(/* webpackChunkName: "vsf-modals" */ 'theme/components/molecules/modals/m-modal-feature-not-implemented.vue')],
  [ModalList.OrderConfirmation, () => import(/* webpackChunkName: "vsf-modals" */ 'theme/components/molecules/modals/m-modal-order-confirmation.vue')],
  [ModalList.OmSelectorModal, () => import(/* webpackChunkName: "vsf-modals" */ 'theme/components/omni/om-selector-modal/index.vue')],
  [ModalList.OmLocatorsModal, () => import(/* webpackChunkName: "vsf-modals" */ 'theme/components/omni/modals/om-locators-modal.vue')],
  [ModalList.OmVehicleViewerModal, () => import(/* webpackChunkName: "vsf-modals" */ 'theme/components/omni/modals/om-vehicle-viewer-modal.vue')],
  [ModalList.OmCartPopupModal, () => import(/* webpackChunkName: "vsf-modals" */ 'theme/components/omni/modals/om-cart-popup.vue')],
  [ModalList.OmCartCheckoutModal, () => import(/* webpackChunkName: "vsf-modals" */ 'theme/components/omni/modals/om-cart-checkout.vue')],
  [ModalList.OmInfoModal, () => import(/* webpackChunkName: "vsf-modals" */ 'theme/components/omni/modals/om-info-modal.vue')],
  [ModalList.OmEnquiryModal, () => import(/* webpackChunkName: "vsf-modals" */ 'theme/components/omni/modals/om-enquiry-modal.vue')],
  [ModalList.OmContactModal, () => import(/* webpackChunkName: "vsf-modals" */ 'theme/components/omni/modals/om-contact-modal.vue')],
  [ModalList.OmAppointmentModal, () => import(/* webpackChunkName: "vsf-modals" */ 'theme/components/omni/modals/om-appointment-modal.vue')]
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
