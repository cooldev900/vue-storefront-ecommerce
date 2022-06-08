<template>
    <div class="special-payment-method">
     <img class="payment-logo" src="/assets/klarna.svg" /> <p> Buy now, pay in interest free instalments.</p>
    </div>
</template>

<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";
.special-payment-method{
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    margin: 20px 0;
.payment-logo{
    width: 60px;
    margin-right: 20px;
}
}
</style>