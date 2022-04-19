<template>
  <div class="om-quantity-selector" :aria-disabled="disabled">
      <select v-model="qty" @change="change">
        <option value="1">Qty: 1</option>
        <option value="2">Qty: 2</option>
        <option value="3">Qty: 3</option>
        <option value="4">Qty: 4</option>
        <option value="5">Qty: 5</option>
        <option value="6">Qty: 6</option>
      </select>
  </div>
</template>
<script>

export default {
  name: "OmQuantitySelector",
  components: {
  },
  inheritAttrs: false,
  props: {
    /** Quantity */
    qty: {
      type: [Number, String],
      default: 2,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
      change(value) {
          console.log(value.target.value, 'value')
          this.$emit('update:qty', value.target.value)
      }
  }
};
</script>
<style lang="scss">
 .om-quantity-selector {
    select {
        padding: 15px;
        border: 0;
        background-color: white;

        option {
            padding: 10px 15px;
        }
    }
 }
</style>
