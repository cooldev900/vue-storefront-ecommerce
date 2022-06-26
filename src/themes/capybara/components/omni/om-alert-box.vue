<template>
  <div class="om-alert-box">
    <img :src="icons[type]" />
    <slot name="message">
      <p>{{ message }}</p>
    </slot>
  </div>
</template>

<script>
export default {
  name: 'OmAlertBox',
  props: {
    type: {
      type: String,
      default: 'info' // waring/info
    },
    message: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      icons: {
        info: '/assets/icons/InfoBlue.svg',
        warning: '/assets/icons/warning-yellow.svg'
      }
    }
  }
}
</script>

<style lang="scss">
.om-alert-box {
  display: flex;
  align-items: center;
  gap: var(--spacer-base);
  justify-content: flex-start;
  padding: 16px;
  background-color: #f6f6f6;
  margin-bottom: var(--spacer-sm);
}
</style>
