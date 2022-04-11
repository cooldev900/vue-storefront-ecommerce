<template>
  <div class="l-hero">
    <div v-if="item">
      <div class="title">
        {{ item.title }}
      </div>
    </div>
  </div>
</template>

<script>
import LexascmsItemMixin from 'src/modules/vsf-lexascms/src/mixins/LexascmsItem';

export default {
  mixins: [ LexascmsItemMixin ],

  props: {
    contentType: {
      type: String,
      default: 'hero'
    }
  }
}
</script>
<style lang="scss" scoped>
.l-hero {
  .title {
    color: white;
    font-size: 45px;
    font-weight: 700;
  }
}
</style>
