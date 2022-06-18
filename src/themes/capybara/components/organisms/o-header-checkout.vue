<template>
  <div class="o-header-checkout">
<div class="o-header-checkout__inner">
    <ALogo />
  </div>
  </div>
</template>

<script>
import ALogo from 'theme/components/atoms/a-logo';
import { SfImage, SfIcon } from '@storefront-ui/vue';

export default {
  name: 'OCheckoutHeader',
  components: { ALogo, SfImage, SfIcon }
};
</script>

<style lang="scss" scoped>
.o-header-checkout {
  height: var(--height-header);
  box-shadow: var(--header-shadow);
  background: #000;
  &__inner{
    max-width: 1400px;
    margin: auto;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 15px;
  }
  .checkout-icon {
    display: flex;
    align-items: center;
    margin-right: 40px;
      display: flex;
  justify-content: space-between;
  align-items: center;
  margin: auto;
  }
}
</style>
