<template>
  <h2 class="step-heading heading heading-sm" :id="id">
    <span class="progress-step" v-if="!isComplete"><span class="checkout__step-title">Step</span> {{ step }} of {{allStep}}
    </span>
    <span v-else class="progress-step progress-step--complete"><svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
width="16" height="16"
viewBox="0 0 30 30"
style=" fill:#fff;"><path d="M9.293,23.707a1,1,0,0,0,1.414,0l17-17a1,1,0,1,0-1.414-1.414L10,21.586,4.707,16.293a1,1,0,0,0-1.414,1.414Z"></path></svg></span>
    {{ title }}
  </h2>
</template>
<script>
export default {
  name: 'OmCheckoutAccordionHeader',
  props: {
    allStep: {
      type: String,
      default: '3'
    },
    step: {
      type: String,
      default: '1'
    },
    title: {
      type: String,
      default: ''
    },
    id: {
      type: String,
      default: ''
    },
    isComplete: {
      type: Boolean,
      default: false
    }
  }
};
</script>
<style lang="scss">
.step.is-active .step-body,
.step.is-active .step-heading,
.step.is-complete .step-body,
.step.is-complete .step-heading {
  opacity: 1;
}

.step-heading {
  display: flex;
  align-items: center;
  color: #333;
  font-size: 1.25rem;
  font-weight: 700;
  text-transform: none !important;
}

.heading {
  font-weight: 600;
  font-size: 18px;
  text-transform: none;
}
.progress-step {
  display: inline-block;
  background: grey;
  color: #fff;
  border-radius: 20px;
  margin-right: 8px;
  padding: 4px 12px;
  font-size: 0.9375rem;
  &--complete{
    background: green;
    border-radius: 50%;
    width: 30px;
    padding: 0;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.checkout__step-title {
    display: none;
}

@media (min-width: 600px) {
  .checkout__step-title {
    display: initial;
  }
}
</style>
