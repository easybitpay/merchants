<script setup>
// Vue
import { computed, ref } from 'vue'

// Store
import { useConnectWalletStore } from '@/stores/connectWallet'

// Alert
import { appendAlert } from '@/assets/js/Alerts'

// Hooks
import useForm from '@/hooks/useForm.js'
import useConvertDate from '@/hooks/useConvertDate.js'
import useCallContract from '@/hooks/useCallContract.js'

// Props
const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  decimals: {
    type: String,
    required: true
  },
  constractAddress: {
    type: String,
    required: true
  }
})

// ----- START ----- //

// Generals
const { showFeedBacks } = useForm()
const { conevrtUnixToDate } = useConvertDate()
const { callContract, fromSun, toSun } = useCallContract()
const connectWalletStore = useConnectWalletStore()

// Refs
const redeemAmount = ref('')

const loading = ref(false)

// Computeds
const walletAddress = computed(() => connectWalletStore.walletAddress)

const calculatedRedeem = computed(() => {
  let receiveTokens = props.item.receivedTokens;
  let decimals = props.decimals;
  let percent = +redeemAmount.value
  let price = props.price
  let total = fromSun(receiveTokens * price, +decimals - 12)

  let amount = (percent * total) / 100

  return amount 
})

// Functions

const redeem = async () => {
  if (+redeemAmount.value) {
    console.log(props.item)
    // Start Loading
    loading.value = true

    // Request
    await callContract(
      props.constractAddress,
      'redeem',
      [props.item.id, redeemAmount.value],
      (res) => {
        if (res) {
          console.log(res);
        }
      },
      true
    )

    // Stop Loading
    loading.value = false
  }
}
</script>

<template>
  <tr class="collapsed">
    <td>
      <div class="h-32px d-flex align-items-center">
        {{ item.stakeAmount ? fromSun(+item.stakeAmount, +decimals) : '-' }}
      </div>
    </td>
    <td>
      <div class="max-content h-32px d-flex align-items-center">
        {{ item.timestamp ? conevrtUnixToDate(item.timestamp, 'DD.MMM.YYYY - hh:mm') : '-' }}
      </div>
    </td>
    <td>
      <div class="max-content h-32px d-flex align-items-center">
        {{ item.redeemedAmount ? fromSun(item.redeemedAmount, +decimals) : '-' }}
      </div>
    </td>
    <td>
      <div class="max-content h-32px d-flex align-items-center">
        {{ item.receivedTokens ? fromSun((item.receivedTokens - item.redeemedTokens) * price, +decimals - 12) : '-' }}
      </div>
    </td>
    <td>
      <div class="max-content" v-if="+item.receivedTokens > +item.redeemedTokens">
        <form @submit.prevent="redeem" class="d-flex justify-content-end gap-2">
          <input
            type="number"
            min="1"
            max="100"
            step="1"
            class="form-control form-control-sm w-100"
            placeholder="%"
            v-model="redeemAmount"
          />
          <div>
            <button type="submit" class="btn btn-sm btn-primary w-100px p-0" :disabled="loading">
              {{ loading ? 'Loading...' : 'Redeem' }}
            </button>
          </div>
        </form>

        <p class="fs-9 mb-0 mt-1" v-if="+calculatedRedeem">Receive: {{ calculatedRedeem }}</p>
      </div>

      <div class="max-content d-flex justify-content-end" v-else>
        <button class="btn btn-sm btn-primary w-100px p-0" disabled="true">Redeemed</button>
      </div>
    </td>
  </tr>

  <tr class="collapsed-row">
    <td colspan="5" class="px-0 pt-0 bg-transparent"></td>
  </tr>
</template>
