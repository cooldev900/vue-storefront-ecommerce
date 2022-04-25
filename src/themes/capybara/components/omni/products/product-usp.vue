<template>
 <div class="product__info--card product-usp">
     <h4>Product Highlights</h4>
    <div class="product-usp__message1">
        <span> ✔ {{product.usp1}}</span>
    </div>
    <div class="product-usp__message2">
        <span> ✔ {{product.usp2}}</span>
    </div>
      <div class="product-usp__message2">
        <span> ✔ {{getAttributeLabelById('oil_type', product.oil_type)}}</span>
    </div>
      <div class="product-usp__message2">
        <span> ✔ {{getAttributeLabelById('oe_brand', product.oe_brand)}}</span>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';

export default {
  name: 'OmProductUsp',
  props: {
     product: {
      type: Object,
      default: () => ({})
    },
  },
  computed: {
    ...mapGetters({
      getAttributeLabelById: 'vehicles/getAttributeLabelById'
    })
  }
}
</script>

<style lang="scss">
.product-usp{
    margin-top: 30px;
    padding: 15px !important;
}
</style>
