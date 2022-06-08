<template>
  <div class="payment-options">
    <div class="stripe-pay-wrapper" style="display: none">
      <div id="payment-request-button"></div>
      <!---->
      <div class="separator">
        <strong>OR</strong>
      </div>
    </div>
    <section class="option-selector">
      <p class="label">How would you like to pay?</p>
      <div class="option-selector__wrapper">
        <div class="payment-option card selectable-card is-selected">
          <svg
            width="24"
            height="24"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            focusable="false"
            class="icon-glyph"
          >
            <use
              xlink:href="https://victoriaplum.com/images/svg-sprite/icon-map.c4615edc7721dffaeffc.svg#glyph-secure-card"
            ></use>
          </svg>
          <span class="payment-option__label">Card</span>
        </div>
        <div class="payment-option card selectable-card">
          <!---->
          <img
            alt="PayPal"
            src="images/ui/paypal-logo-stacked.svg"
            width="60"
            height="60"
          />
        </div>
        <div class="payment-option card selectable-card">
          <svg
            width="24"
            height="24"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            focusable="false"
            class="icon-glyph"
          >
            <use
              xlink:href="https://victoriaplum.com/images/svg-sprite/icon-map.c4615edc7721dffaeffc.svg#glyph-bank"
            ></use>
          </svg>
          <span class="payment-option__label">Finance</span>
        </div>
        <div class="payment-option card selectable-card">
          <!---->
          <img
            alt="Clearpay"
            src="images/ui/clearpay.svg"
            width="60"
            height="60"
          />
        </div>
      </div>
    </section>
    <div
      id="addressSummary"
      class="address-summary billing-address-summary"
      style=""
    >
      <h3 class="address-summary__heading">billing Address</h3>
      <address data-hj-suppress="" class="address-summary__address">
        Alex Lu, 345/6 Leith Walk, Edinburgh, Midlothian, EH6 8SD, GB
      </address>
      <span class="address-summary__link"> Change billing address </span>
    </div>
    <div class="address-form billing-address" style="display: none">
      <button type="reset" class="address-form__btn">
        <span class="address-form__btn-inner">Clear <span>address</span></span>
      </button>
      <form class="form">
        <h2 class="address-form__title">What is your billing address?</h2>
        <div class="inputs">
          <label for="billing-first-name" class="label">
            First Name
            <span class="label--required"> * </span></label
          >
          <!---->
          <input
            id="billing-first-name"
            type="text"
            name="firstName"
            class="input"
          />
          <span class="error-message form__text" style="display: none"> </span>
        </div>
        <div class="inputs">
          <label for="billing-last-name" class="label">
            Last Name
            <span class="label--required"> * </span></label
          >
          <!---->
          <input
            id="billing-last-name"
            type="text"
            name="lastName"
            class="input"
          />
          <span class="error-message form__text" style="display: none"> </span>
        </div>
        <div class="inputs" style="display: none">
          <label for="billing-company" class="label">
            Company
            <!----></label
          >
          <!---->
          <input
            id="billing-company"
            type="text"
            name="companyName"
            class="input"
          />
          <span class="error-message form__text" style="display: none"> </span>
        </div>
        <div class="inputs">
          <label for="billing-street" class="label">
            Address
            <span class="label--required"> * </span></label
          >
          <!---->
          <input
            id="billing-street"
            type="text"
            name="street"
            class="input"
            autocomplete="pca-override"
          />
          <span class="error-message form__text" style="display: none"> </span>
        </div>
        <div class="inputs" style="display: none">
          <label for="billing-street2" class="label">
            Street 2
            <!----></label
          >
          <!---->
          <input
            id="billing-street2"
            type="text"
            name="street2"
            class="input"
          />
          <span class="error-message form__text" style="display: none"> </span>
        </div>
        <div class="address-link address-street2">
          + Add 2nd street details
          <span>(if applicable)</span>
        </div>
        <div class="inputs">
          <label for="billing-city" class="label">
            Town/City
            <span class="label--required"> * </span></label
          >
          <!---->
          <input id="billing-city" type="text" name="city" class="input" />
          <span class="error-message form__text" style="display: none"> </span>
        </div>
        <div class="inputs">
          <label for="billing-county" class="label">
            County
            <!----></label
          >
          <!---->
          <input id="billing-county" type="text" name="county" class="input" />
          <span class="error-message form__text" style="display: none"> </span>
        </div>
        <div class="inputs">
          <label for="billing-postal-code" class="label">
            Postcode
            <span class="label--required"> * </span></label
          >
          <!---->
          <input
            id="billing-postal-code"
            type="text"
            name="postalCode"
            class="input"
            autocomplete="pca-override"
          />
          <span class="error-message form__text" style="display: none"> </span>
        </div>
        <div class="inputs">
          <label for="billing-country" class="label">
            Country
            <span class="label--required"> * </span></label
          >
          <select id="billing-country" name="country" class="input-select">
            <option value="GB">United Kingdom</option>
            <option value="JE">Jersey</option>
            <option value="GG">Guernsey</option>
          </select>
          <span class="error-message form__text" style="display: none"> </span>
        </div>
        <div class="alert alert--error" style="display: none">
          <span class="alert__icon"
            ><svg
              width="16"
              height="16"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              focusable="false"
              class="icon-glyph"
            >
              <use
                xlink:href="https://victoriaplum.com/images/svg-sprite/icon-map.c4615edc7721dffaeffc.svg#glyph-caution"
              ></use></svg
          ></span>
          <span class="alert__message">
            Please enter all required billing address information
          </span>
          <!---->
        </div>
        <button
          type="submit"
          class="btn address-form__submit-btn btn--shopping"
        >
          Continue
        </button>
      </form>
    </div>
    <!---->
    <!---->
    <div>
      <!---->
      <!---->
      <div class="payment-option barclaycard-fuse" style="">
        <form id="card-form" class="payment-card">
          <div>
            <label class="label">
              Card number
              <span class="label--required">*</span></label
            >
            <div class="inputs">
              <div
                class="
                  input input-card-number input-card-number--
                  flex-microform
                "
              >
                <iframe
                  hspace="0"
                  vspace="0"
                  frameborder="0"
                  scrolling="no"
                  allowtransparency="true"
                  marginwidth="0"
                  marginheight="0"
                  src='https://flex.cybersource.com/cybersource/assets/microform/0.11.4/iframe.html?keyId=03EYd9KXgoca2FavEwTKxcNkY5oUgk4T#{"microformId":"9c010c74-fc5b-4ff9-8de5-00fd0d2d4090","fieldId":"752d6220-e998-4e19-8eb1-4c840eb7cc77","jwt":"eyJraWQiOiJ3ZiIsImFsZyI6IlJTMjU2In0.eyJmbHgiOnsicGF0aCI6Ii9mbGV4L3YyL3Rva2VucyIsImRhdGEiOiJUaTRtWkVXdVY4WnN2T0pnTEM1OHRCQUFFTEFHUWdsQ1U5a0dGSVd5YlFOTTVSZEFQUUE2d3dNZ1RpNmM0M0FzRXJQTm9oeTFzVDRINFIwKzVvTGp1dnR1MnZ6bGh5Y090Y0dZc01vbHlKR0JiZW9ra0hRTy90d1M2a3A2SXJCUWw4UUEiLCJvcmlnaW4iOiJodHRwczovL2ZsZXguY3liZXJzb3VyY2UuY29tIiwiandrIjp7Imt0eSI6IlJTQSIsImUiOiJBUUFCIiwidXNlIjoiZW5jIiwibiI6ImszNWozQWFYOXBSY3NvV2Z3MDRWRVZ6RHo0WUd1bXZVSUpBdm9JQjVoRUE3cjVNYTNnamFOVXA3R25uUVcxOFZrVkNKN0FJUEg1MTZBdU9weTNLMGxQajd4VzRHb2dPbEtmWi1wMFI5c1V1UHowWlpLcGgyY2NIeFdTdG5RcVY1Z0tMU0UyMHNQUzZHRDhodlNLYmtvS29VNVlqMGNLSldBYUdMdXR0V0hhZVJsTzd2VE9RYVRjRFpNTFY4UlBMcXdYUHlnZGRnRWxtYWZoX0tDUzRqLVZ1MkdZMC1hMUFhODJBUXdBMDVTRDhhb0tGQkc0M09rUUw0ODJReTFKdk5DMTh2bE1LU3RrOXMzLXRuUlFEdXEwQUNoMTd2TnhvX0JoaGlzemJkbE1xd3o5eHRER2tuai1RcEtpX0t5WlkzVWdBNHhZd0FDazB6bFcxRU0zakxNUSIsImtpZCI6IjAzRVlkOUtYZ29jYTJGYXZFd1RLeGNOa1k1b1VnazRUIn19LCJjdHgiOlt7ImRhdGEiOnsidGFyZ2V0T3JpZ2lucyI6WyJodHRwczovL3ZpY3RvcmlhcGx1bS5jb20iXSwibWZPcmlnaW4iOiJodHRwczovL2ZsZXguY3liZXJzb3VyY2UuY29tIn0sInR5cGUiOiJtZi0wLjExLjAifV0sImlzcyI6IkZsZXggQVBJIiwiZXhwIjoxNjUwNjA1NzE5LCJpYXQiOjE2NTA2MDQ4MTksImp0aSI6ImRFZEFWTjZycFRPdTJ4R3EifQ.g5Fo2GXuljmQ1b0b9tAdPfGfRb6E6xTq7lKQofK_l1MekJJ6FXlfpyD-hSXy2W4h9oAhBUhpbUPAfjwsWodpJDcrMaEE7eE3gu5XpNfootUBGmCzpEqqhNy4AxipcxamVOxxgrk1JYrfktlAs3DeTUxGpwvCAZNB3lMOtP_sVfDI7Lmm2yot6xbhS9xh6uJhs-8xVMtcKsGkcYZ18tDju5ojH5GqXpBC4iXOnYwL1cLP-JlM1vTHGhzVQIkRuljkQrC-x8FspAKoFkUrQ5bxS_m14SP23CAxjTLZyp8RvXu1l0uXFd9WO31OPoqy48bw5kJJi_s-TpEy1IMJ01zVrA","microformConfig":{"styles":{"input":{"font-size":"16px","font-family":"Arial, sans-serif"}}},"config":{},"fieldType":"number"}'
                  id="card-number-iframe"
                  style="
                    overflow: hidden;
                    position: relative;
                    border: none;
                    width: 100%;
                    height: 100%;
                  "
                ></iframe>
              </div>
            </div>
            <div class="payment-card-expiry-csc">
              <fieldset>
                <label for="barclaycard-expiry" class="label">
                  Expiry date MM/YY
                  <span class="label--required">*</span></label
                >
                <div class="inputs">
                  <input
                    id="barclaycard-expiry"
                    type="tel"
                    data-encrypted-name="expiryMonth"
                    autocomplete="cc-exp-month"
                    class="input payment-card__expiry"
                  />
                  <span class="payment-card__expiry--separator">/</span>
                  <input
                    type="tel"
                    autocomplete="cc-exp-year"
                    maxlength="2"
                    class="input payment-card__expiry"
                  />
                  <input
                    id="barclaycard-expiry-year"
                    type="hidden"
                    data-encrypted-name="expiryYear"
                  />
                </div>
              </fieldset>
              <fieldset class="payment-card__security">
                <label class="label label--csc">
                  Security code
                  <span class="label--required">*</span></label
                >
                <svg
                  width="14"
                  height="14"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  focusable="false"
                  class="icon-glyph vue-tooltip payment-card-csc-tooltip"
                >
                  <use
                    xlink:href="https://victoriaplum.com/images/svg-sprite/icon-map.c4615edc7721dffaeffc.svg#glyph-info"
                  ></use>
                </svg>
                <div class="inputs">
                  <div class="input payment-card__csc flex-microform">
                    <iframe
                      hspace="0"
                      vspace="0"
                      frameborder="0"
                      scrolling="no"
                      allowtransparency="true"
                      marginwidth="0"
                      marginheight="0"
                      src='https://flex.cybersource.com/cybersource/assets/microform/0.11.4/iframe.html?keyId=03EYd9KXgoca2FavEwTKxcNkY5oUgk4T#{"microformId":"9c010c74-fc5b-4ff9-8de5-00fd0d2d4090","fieldId":"9bf0cfac-eaa3-4f81-a6d4-9b50e4cae068","jwt":"eyJraWQiOiJ3ZiIsImFsZyI6IlJTMjU2In0.eyJmbHgiOnsicGF0aCI6Ii9mbGV4L3YyL3Rva2VucyIsImRhdGEiOiJUaTRtWkVXdVY4WnN2T0pnTEM1OHRCQUFFTEFHUWdsQ1U5a0dGSVd5YlFOTTVSZEFQUUE2d3dNZ1RpNmM0M0FzRXJQTm9oeTFzVDRINFIwKzVvTGp1dnR1MnZ6bGh5Y090Y0dZc01vbHlKR0JiZW9ra0hRTy90d1M2a3A2SXJCUWw4UUEiLCJvcmlnaW4iOiJodHRwczovL2ZsZXguY3liZXJzb3VyY2UuY29tIiwiandrIjp7Imt0eSI6IlJTQSIsImUiOiJBUUFCIiwidXNlIjoiZW5jIiwibiI6ImszNWozQWFYOXBSY3NvV2Z3MDRWRVZ6RHo0WUd1bXZVSUpBdm9JQjVoRUE3cjVNYTNnamFOVXA3R25uUVcxOFZrVkNKN0FJUEg1MTZBdU9weTNLMGxQajd4VzRHb2dPbEtmWi1wMFI5c1V1UHowWlpLcGgyY2NIeFdTdG5RcVY1Z0tMU0UyMHNQUzZHRDhodlNLYmtvS29VNVlqMGNLSldBYUdMdXR0V0hhZVJsTzd2VE9RYVRjRFpNTFY4UlBMcXdYUHlnZGRnRWxtYWZoX0tDUzRqLVZ1MkdZMC1hMUFhODJBUXdBMDVTRDhhb0tGQkc0M09rUUw0ODJReTFKdk5DMTh2bE1LU3RrOXMzLXRuUlFEdXEwQUNoMTd2TnhvX0JoaGlzemJkbE1xd3o5eHRER2tuai1RcEtpX0t5WlkzVWdBNHhZd0FDazB6bFcxRU0zakxNUSIsImtpZCI6IjAzRVlkOUtYZ29jYTJGYXZFd1RLeGNOa1k1b1VnazRUIn19LCJjdHgiOlt7ImRhdGEiOnsidGFyZ2V0T3JpZ2lucyI6WyJodHRwczovL3ZpY3RvcmlhcGx1bS5jb20iXSwibWZPcmlnaW4iOiJodHRwczovL2ZsZXguY3liZXJzb3VyY2UuY29tIn0sInR5cGUiOiJtZi0wLjExLjAifV0sImlzcyI6IkZsZXggQVBJIiwiZXhwIjoxNjUwNjA1NzE5LCJpYXQiOjE2NTA2MDQ4MTksImp0aSI6ImRFZEFWTjZycFRPdTJ4R3EifQ.g5Fo2GXuljmQ1b0b9tAdPfGfRb6E6xTq7lKQofK_l1MekJJ6FXlfpyD-hSXy2W4h9oAhBUhpbUPAfjwsWodpJDcrMaEE7eE3gu5XpNfootUBGmCzpEqqhNy4AxipcxamVOxxgrk1JYrfktlAs3DeTUxGpwvCAZNB3lMOtP_sVfDI7Lmm2yot6xbhS9xh6uJhs-8xVMtcKsGkcYZ18tDju5ojH5GqXpBC4iXOnYwL1cLP-JlM1vTHGhzVQIkRuljkQrC-x8FspAKoFkUrQ5bxS_m14SP23CAxjTLZyp8RvXu1l0uXFd9WO31OPoqy48bw5kJJi_s-TpEy1IMJ01zVrA","microformConfig":{"styles":{"input":{"font-size":"16px","font-family":"Arial, sans-serif"}}},"config":{},"fieldType":"securityCode"}'
                      id="cvc-iframe"
                      style="
                        overflow: hidden;
                        position: relative;
                        border: none;
                        width: 100%;
                        height: 100%;
                      "
                    ></iframe>
                  </div>
                  <span class="payment-card__csc-icon"
                    ><img
                      src="/images/ui/card-csc.svg"
                      alt="Payment card CSC location"
                      title="The 3 or 4 digit number on the back of your card"
                  /></span>
                </div>
              </fieldset>
            </div>
            <label for="payment-card-name" class="label">
              Name on card
              <span class="label--required">*</span></label
            >
            <div class="inputs">
              <input
                id="payment-card-name"
                type="text"
                data-encrypted-name="holderName"
                autocomplete="cc-name"
                class="input"
              />
            </div>
            <button
              id="barclaycard-submit"
              disabled="disabled"
              type="submit"
              role="button"
              aria-pressed="false"
              class="
                btn btn--shopping btn--lg
                payment-card__submit
                t-checkout-payment-submit
              "
            >
              <span class="btn__icon btn__icon--left"
                ><svg
                  width="16"
                  height="16"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  focusable="false"
                  class="icon-glyph"
                >
                  <use
                    xlink:href="https://victoriaplum.com/images/svg-sprite/icon-map.c4615edc7721dffaeffc.svg#glyph-padlock"
                  ></use></svg></span
              >Pay Securely
            </button>
            <button
              type="button"
              aria-disabled="true"
              role="button"
              aria-pressed="true"
              disabled="disabled"
              class="
                btn btn--shopping btn--lg
                payment-card__submit
                t-checkout-payment-submit
              "
              style="display: none"
            >
              Please wait …
            </button>
          </div>
        </form>
        <iframe
          name="ddc-iframe"
          width="1"
          height="1"
          style="display: none"
        ></iframe>
        <form id="ddc-form" target="ddc-iframe" method="POST" action="">
          <input type="hidden" name="JWT" />
        </form>
        <!---->
      </div>
      <!---->
      <!---->
      <div class="payment-option" style="display: none">
        <div class="logo-wrapper">
          <img
            src="https://images.victoriaplum.com/checkout/paypal-2x.png?auto=format%2Ccompress&amp;q=55"
            class="payment-logo payment-logo--paypal"
          />
        </div>
        <p class="body-text info">
          Continuing to PayPal will take you to the PayPal site to confirm your
          payment. You will then be returned to VictoriaPlum.com.
        </p>
        <button
          class="
            btn btn--shopping btn--lg btn--full-width
            t-checkout-payment-paypal
          "
        >
          <svg
            width="16"
            height="16"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            focusable="false"
            class="icon-glyph"
          >
            <use
              xlink:href="https://victoriaplum.com/images/svg-sprite/icon-map.c4615edc7721dffaeffc.svg#glyph-padlock"
            ></use>
          </svg>
          <span>Continue to PayPal</span>
          <span style="display: none">Place Order</span>
          <span style="display: none">Please wait …</span>
        </button>
      </div>
      <div class="barclays-partner-finance" style="display: none">
        <div>
          <div>
            <img
              src="https://images.victoriaplum.com/brands/logos/barclays-partnership-logo.png?auto=format%2Ccompress&amp;q=55&amp;w=150"
              width="150"
              height="42"
              alt="In partnership with Barclays logo"
              title="An image displaying the In partnership with Barclays logo"
              class="barclays-partner-finance__logo"
            />
            <p class="body-text">
              You'll need your bank details at the ready and you'll be asked to
              fill out a short but straightforward form.
            </p>
            <p class="body-text">
              Once you've submitted your form, you'll receive your decision.
            </p>
            <p class="text--v5 finance-legal">
              0% APR Representative. Victoria Plum acts as a credit broker and
              not the lender. Barclays Partner Finance acts as the lender.
              Subject to application, financial circumstances and borrowing
              history. Eligibility criteria applies.
            </p>
            <button
              class="
                btn btn--shopping btn--lg btn--full-width
                t-checkout-payment-finance
              "
            >
              <svg
                width="16"
                height="16"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                focusable="false"
                class="icon-glyph"
              >
                <use
                  xlink:href="https://victoriaplum.com/images/svg-sprite/icon-map.c4615edc7721dffaeffc.svg#glyph-padlock"
                ></use>
              </svg>
              <span>Pay on finance</span>
              <span style="display: none">Please wait …</span>
            </button>
          </div>
        </div>
      </div>
      <!---->
      <div class="payment-option clearpay" style="display: none">
        <div>
          <div class="clearpay__message">
            <img
              src="https://images.victoriaplum.com/checkout/clearpay/clearpay-redirect-grey.svg?auto=format%2Ccompress&amp;q=55"
              alt="Redirect to Clearpay"
              width="185"
              height="128"
              class="clearpay__message-redirect-icon"
            />
            <p class="clearpay__message-text">
              After clicking "Pay with Clearpay" you will be redirected to
              Clearpay to complete your purchase securely.
            </p>
            <p class="clearpay__message-text">
              Please ensure your delivery address is correct. Once redirected to
              Clearpay, this cannot be amended.
            </p>
          </div>
          <!---->
          <button class="btn btn--shopping btn--lg btn--full-width">
            <svg
              width="16"
              height="16"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              focusable="false"
              class="icon-glyph"
            >
              <use
                xlink:href="https://victoriaplum.com/images/svg-sprite/icon-map.c4615edc7721dffaeffc.svg#glyph-padlock"
              ></use>
            </svg>
            <span>Pay with Clearpay</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "OmCheckoutPayment",
  data() {
    return {};
  },
};
</script>

<style scoped lang="scss">
.payment-options {
  padding-top: 24px;

  .option-selector,
  .option-selector .label {
    margin-bottom: 16px;
  }

  .option-selector__wrapper {
    display: -webkit-flex;
    display: flex;
    -webkit-flex-wrap: wrap;
    flex-wrap: wrap;
    padding-left: 10px;

    .payment-option:not(:last-of-type) {
      margin-right: 8px;
    }

    .selectable-card.is-selected[data-v-6e119ad4] {
      border-color: #c92c55;
      box-shadow: 0 0 0 1px #c92c55;
    }

    .selectable-card,
    .selectable-card.is-selected {
      transition: box-shadow 0.2s ease-out, border 0.2s ease;
    }

    fieldset,
    input,
    label,
    legend {
      margin: 0;
      padding: 0;
      border: none;
    }

    .payment-option {
      display: -webkit-flex;
      display: flex;
      -webkit-align-content: center;
      align-content: center;
      -webkit-align-items: center;
      align-items: center;
      -webkit-justify-content: center;
      justify-content: center;
      text-align: center;
      -webkit-flex-wrap: wrap;
      flex-wrap: wrap;
      min-height: 76px;
      width: calc(33% - 8px);
    }

    .selectable-card {
      cursor: pointer;
      -webkit-user-select: none;
      -ms-user-select: none;
      user-select: none;
      padding: 12px;
      position: relative;
    }

    .card {
      position: relative;
      background: #fff;
      border-radius: 4px;
      font-family: arial, sans-serif;
      margin-bottom: 10px;
      overflow: hidden;
      border: 1px solid #d6d6d6;
      border-bottom-color: #c2c2c2;
      transition: box-shadow 0.2s ease-in-out;
    }
  }

  .billing-address-summary {
    margin-bottom: 24px;
  }

  .address-summary {
    display: block;
    font-size: 1rem;

    &__heading {
      font-weight: 600;
      line-height: 1.5rem;
      text-transform: capitalize;
    }

    &__address {
      line-height: 1.5rem;
      margin: 8px 0;
    }

    &__link {
      color: #4a1639;
      font-size: 0.875rem;
      cursor: pointer;
    }
  }

  .payment-option {
    max-width: 377px;

    .payment-card {
      max-width: 410px;

      .label {
        display: block;
        font-weight: 600;
        font-size: 0.875rem;
        text-align: left;

        display: block;
        margin-bottom: 4px;
        font-weight: 700;

        &--required {
          color: #ca444d;
        }
      }

      .input,
      .inputs {
        position: relative;
      }

      .inputs {
        margin: 8px 0 20px;
        text-align: left;

        .payment-card .input-card-number {
          padding: 0 60px 0 10px;
          background-size: 42px 32px;
          background-position: right 8px center;
          background-repeat: no-repeat;
          background-origin: padding-box;
          margin-bottom: 8px;
        }
      }
    }
  }

  .payment-card-expiry-csc {
    display: -webkit-flex;
    display: flex;
    -webkit-flex-direction: row;
    flex-direction: row;
    -webkit-flex-wrap: wrap;
    flex-wrap: wrap;

    fieldset:first-child {
      margin-right: auto;
      -webkit-flex: 1 1 100%;
      flex: 1 1 100%;
    }

    .payment-card__security {
      position: relative;
      min-width: 140px;

      .payment-card-csc-tooltip {
        fill: #4a1639;
        position: absolute;
        top: 0;
        right: 18px;
      }
    }

    .payment-card__expiry {
      display: inline-block;
      max-width: 58px;
    }
  }

  @media (min-width: 375px) {
    .payment-card-expiry-csc {
      -webkit-flex-wrap: nowrap;
      flex-wrap: nowrap;

      fieldset:first-child {
        -webkit-flex: 1 1 auto;
        flex: 1 1 auto;
      }
    }
  }

  @media (min-width: 768px) {
    .option-selector__wrapper {
      -webkit-flex-wrap: nowrap;
      flex-wrap: nowrap;
      padding-left: 0;
    }
  }
}
</style>
