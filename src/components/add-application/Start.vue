<script setup>
import { onMounted, ref } from 'vue'

// Emit
const emit = defineEmits(['goNext'])

// ----- START ----- //
const term = ref(false)

// Functions

/**
 * Submit Form
 * send data to parent for store
 */
const submitForm = () => {
  if (term.value) {
    // Set Variable
    const content = {
      agree: term.value
    }

    // Emit
    emit('goNext', content)
  }
}

onMounted(() => {
  document.addEventListener('submitStep0', function () {
    submitForm()
  })
})
</script>

<template>
  <div class="d-flex flex-column justify-content-between flex-root h-100">
    <div>
      <!-- begin::Title -->
      <h4 class="text-primary mb-6 fw-normal px-6">Start</h4>
      <!-- begin::Title -->

      <!-- begin::Title -->
      <div class="lh-24px ls-base custom-scroll overflow-auto mh-644px px-6">
        <p>
          Welcome to Easybitpay! We provide a cryptocurrency payment gateway service that allows
          merchants to accept various cryptocurrencies, including Bitcoin, Ethereum, Tether, and
          Tron, as payment options in their stores or applications.
        </p>
        <h5>Acceptance of Terms</h5>
        <p>
          By accessing and using our payment gateway, you acknowledge and agree to these Terms of
          Service and our Privacy Policy. If you do not agree with any part of these terms, you must
          not use our services.
        </p>
        <h5>Account Registration and Requirements</h5>
        <p>
          To use our payment gateway, you must register for an account using your Google account.
          Ensure that all information you provide is accurate and up to date. You are responsible
          for maintaining the confidentiality of your account information and for all activities
          that occur under your account.
        </p>
        <h5>Service Description</h5>
        <p>
          Easybitpay provides a cryptocurrency payment gateway that supports various
          cryptocurrencies. Our service enables merchants to accept these currencies as payment,
          providing a faster, secure, and innovative payment solution.
        </p>
        <h5>Fees and Payments</h5>
        <p>
          Our fee policy for using the Easybitpay payment gateway is based on the following three
          factors: Merchant KYC Level: The level of Know Your Customer (KYC) verification the
          merchant has completed impacts the fee structure. By default, the fee is 1$ + 5% of the
          payment amount. However, merchants who pass KYC level 1 are eligible for reduced fees, as
          low as 0.1%. Selected Payment Network: The network chosen for processing payments
          influences the total fee due to network-specific transaction costs. For example, using the
          Bitcoin (BTC) network might incur fees up to $50, while the Polygon network might have
          fees as low as $0.1. These network fees are added on top of our service fees.
          Customization Services: Additional fees apply for customization services provided to the
          payment gateway. These services include the use of custom tokens (not default supported
          tokens by the system), using a custom template for the payment page, or mapping the
          merchant's domain to the payment page.
        </p>
        <h5>User Responsibilities</h5>
        <p>
          Users are responsible for ensuring that their use of the payment gateway complies with all
          applicable laws and regulations. You must secure your account credentials and authorize
          transactions responsibly.
        </p>
        <h5>Prohibited Activities</h5>
        <p>
          You may not use our services for illegal activities, fraud, money laundering, or to
          support terrorist activities. Any attempt to undermine the functionality or integrity of
          our service is prohibited.
        </p>
        <h5>Security</h5>
        <p>
          We implement industry-standard security measures to protect your transactions and personal
          information. However, we cannot guarantee absolute security. Users should maintain their
          own security measures, such as secure passwords and two-factor authentication.
        </p>
        <h5>Data Privacy</h5>
        <p>
          Your privacy is important to us. Our Privacy Policy outlines how we collect, use, and
          protect your personal information. By using our service, you consent to such processing
          and you warrant that all data provided by you is accurate.
        </p>
        <h5>Intellectual Property</h5>
        <p>
          All content on the Easybitpay website, including text, graphics, logos, and software, is
          the property of Easybitpay or its content suppliers and protected by international
          copyright and trademark laws.
        </p>
        <h5>Termination and Suspension</h5>
        <p>
          Easybitpay reserves the right to suspend or terminate your account if you violate these
          Terms of Service or engage in activities that we deem harmful to our service or other
          users.
        </p>
        <h5>Limitation of Liability</h5>
        <p>
          Easybitpay shall not be liable for any direct, indirect, incidental, special, or
          consequential damages resulting from the use or inability to use our services.
        </p>
        <h5>Indemnification</h5>
        <p>
          You agree to indemnify and hold Easybitpay harmless from any claim or demand, including
          reasonable attorneys' fees, made by any third party due to or arising out of your breach
          of these Terms of Service or the documents they incorporate by reference, or your
          violation of any law or the rights of a third party.
        </p>
        <h5>Dispute Resolution</h5>
        <p>
          Any disputes arising out of or related to these Terms of Service shall be governed by and
          construed in accordance with the laws of [Jurisdiction], without giving effect to any
          principles of conflicts of law.
        </p>
        <h5>Amendments to Terms</h5>
        <p>
          Easybitpay reserves the right to modify these Terms of Service at any time. Your continued
          use of the service after any such changes indicates your acceptance of the new terms.
        </p>
        <h5>Contact Information</h5>
        <p>
          For any questions or concerns regarding these Terms of Service, please contact us at
          [Contact Information].
        </p>
        <h5>Miscellaneous</h5>
        <p>
          These Terms of Service constitute the entire agreement between you and Easybitpay and
          govern your use of the service, superseding any prior agreements between you and
          Easybitpay.
        </p>
      </div>
      <!-- end::Text -->
    </div>

    <div class="px-6 mt-6">
      <div class="form-check">
        <input
          class="form-check-input cursor-pointer"
          type="radio"
          name="flexRadioDefault"
          id="createAppTerm"
          :checked="term"
          @click="term = !term"
        />
        <label class="form-check-label cursor-pointer fw-medium fs-5" for="createAppTerm">
          Aggre with Term & Conditions
        </label>
      </div>
    </div>
  </div>
</template>
