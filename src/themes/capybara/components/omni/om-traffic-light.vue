<template>
  <div class="om-traffic-light">
    <div class="om-traffic-light-dot" :style="{ backgroundColor: dotColor }"></div>
    <div class="om-traffic-light-description">{{ description }}</div>
  </div>
</template>

<script>
export default {
  name: 'OmTrafficLight',
  props: {
    status: {
      type: String,
      default: 'unavailable'
    },
    description: {
      type: String,
      default: 'Hello'
    }
  },
  computed: {
    dotColor () {
      if (this.status === 'available') {
        return 'green';
      } else if (this.status === 'warn') {
        return 'orange';
      } else if (this.status === 'unavailable') {
        return 'red';
      }
    }
  }
}
</script>

<style lang="scss">
.om-traffic-light {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;

  &-dot {
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background-color: green;
    margin-right: var(--spacer-xs);
    min-width: 15px;
  }

  &-description {
    word-break: break-all;
  }
}
</style>
