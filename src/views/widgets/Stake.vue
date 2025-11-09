<script setup>
// Vue
import { computed, onMounted, ref } from 'vue'

// Store
import { useConnectWalletStore } from '@/stores/connectWallet'
import { useStakeStore } from '@/stores/stake'

// Alert
import { appendAlert } from '@/assets/js/Alerts'

// Composabless
import useForm from '@/composables/useForm.js'
import useCallContract from '@/composables/useCallContract.js'

// UUID For Unique ID
import { v4 as uuidv4 } from 'uuid'

// Vuelidate
import useVuelidate from '@vuelidate/core'
import { helpers, required } from '@vuelidate/validators'

// Componenets
import SelectDropdown from '../../components/globals/SelectDropdown.vue'
import StakeItems from '../../components/widgets/stake/StakeItems.vue'
import StakeItemsLoading from '../../components/widgets/stake/StakeItemsLoading.vue'

// ----- START ----- //

// Generals
const { showFeedBacks } = useForm()
const { callContract, fromSun, toSun } = useCallContract()
const connectWalletStore = useConnectWalletStore()
const stakeStore = useStakeStore()

// Refs
const tokens = ref([])
const selectedCoin = ref({})
const tokenBalanace = ref('')
const userStakeProfiles = ref([])
const interestRate = ref(0)
const stakeTokenPrice = ref(0)
const blocksPerYear = 10512000

const approveInterval = ref(null)
const loadings = ref({
  balance: false,
  tokens: false,
  wallet: false,
  network: false,
  stake: false,
  stakeList: false
})

// Computeds
const walletAddress = computed(() => connectWalletStore.walletAddress)
const connectedNetwork = computed(() => connectWalletStore.connectedNetwork)
const btnDisable = computed(() => {
  if (selectedCoin.value.status == 0) return true

  if (loadings.value.wallet || loadings.value.network || loadings.value.stake) return true

  if (+form.value.amount > +tokenBalanace.value) return true

  return false
})

const btnText = computed(() => {
  if (selectedCoin.value.status == 0) return 'Just Redeem'

  if (loadings.value.wallet || loadings.value.network || loadings.value.stake) return 'Loading...'

  if (!walletAddress.value) return 'Connect your wallet'

  if (+form.value.amount > +tokenBalanace.value) return 'More than balance'

  return 'Stake'
})

const calculatedAPY = computed(() => {
  // Convert the rate from the protocol's scale to a normal percentage scale
  let ratePerBlockScaled = interestRate.value / 1e18

  // Calculate the annual rate
  let annualRate = (1 + ratePerBlockScaled) ** blocksPerYear - 1

  // Convert to percentage
  let apy = annualRate * 100

  return apy.toFixed(2)
})

const calcilatedBenefit = computed(() => {
  let apy = calculatedAPY.value
  let amount = +form.value.amount

  let extra = (amount * apy) / 100
  return amount + extra
})

// Vuelidate
const form = ref({
  tokenId: null,
  amount: null
})

const rules = {
  tokenId: {
    required: helpers.withMessage('Token is required', required)
  },
  amount: {
    required: helpers.withMessage('Amount is required', required)
  }
}

const v$ = useVuelidate(rules, form)

// Functions
const getWithoutLast = (address) => {
  let stringWithoutLast10 = address.substring(0, address.length - 10)
  return stringWithoutLast10
}

const getLastEight = (address) => {
  let last10Characters = address.substring(address.length - 10)
  return last10Characters
}

const copy = () => {
  navigator.clipboard.writeText(walletAddress.value)
  appendAlert('Copied to clipboard', {
    color: 'success',
    type: 'alert'
  })
}

const toggleSelectedCoin = (token) => {
  let beforeSelected = selectedCoin.value.stake_contract_address

  selectedCoin.value = token
  form.value.tokenId = token.id

  if (beforeSelected != token.stake_contract_address) {
    connectNetwork()
  }
}

const connectWallet = async () => {
  // Start Loading
  loadings.value.wallet = true

  // Connect Wallet
  await connectWalletStore.connectToMetaMask()

  // Stop Loading
  loadings.value.wallet = false
}

const connectNetwork = async () => {
  // Start Loading
  loadings.value.network = true

  // Connect Wallet
  await connectWalletStore
    .connectToChain(selectedCoin.value.network.nick_name)
    .then(async (res) => {
      if (res) {
        // Stop Loading
        loadings.value.network = false
        await getTokenBalance()
        await getInterestRate()
        await getStakeTokenPrice()
        await getUserStakeIds()
      } else {
        // Stop Loading
        loadings.value.network = false
        selectedCoin.value = {}
        tokenBalanace.value = ''
        interestRate.value = 0
        stakeTokenPrice.value = 0
        userStakeProfiles.value = []
      }
    })
}

const getStakeTokens = async () => {
  await stakeStore.getStakeTokens().then((res) => {
    if (res) {
      tokens.value = res
    }
  })
}

const getTokenBalance = async () => {
  await callContract(
    selectedCoin.value.address,
    'balanceOf',
    [walletAddress.value],
    (res) => {
      if (res) {
        tokenBalanace.value = fromSun(+res, +selectedCoin.value.decimals)
      }
    },
    false
  )
}

const getInterestRate = async () => {
  await callContract(
    selectedCoin.value.stake_contract_address,
    'getSupplyRatePerBlock',
    [],
    (res) => {
      if (res) {
        interestRate.value = +res
      }
    },
    false
  )
}

const getStakeTokenPrice = async () => {
  await callContract(
    selectedCoin.value.stake_contract_address,
    'getExchangeRateStored',
    [],
    (res) => {
      if (res) {
        stakeTokenPrice.value = +fromSun(+res, +selectedCoin.value.decimals + 12)
      }
    },
    false
  )
}

const getUserStakeIds = async () => {
  userStakeProfiles.value = []
  loadings.value.stakeList = true
  await callContract(
    selectedCoin.value.stake_contract_address,
    'getUserStakeIds',
    [walletAddress.value],
    async (res) => {
      if (res) {
        if (res.length) {
          for (let i = 0; i < res.length; i++) {
            const element = res[i]
            await getStakeProfile(element)
          }
        }
      }
    },
    false
  )
  loadings.value.stakeList = false
}

const getStakeProfile = async (id) => {
  await callContract(
    selectedCoin.value.stake_contract_address,
    'stakeProfiles',
    [id],
    (res) => {
      if (res) {
        console.log(res)
        userStakeProfiles.value.push({
          ...res,
          id,
          key: uuidv4()
        })
      }
    },
    false
  )
}

const startIntreval = () => {
  loadings.value.stake = true

  approveInterval.value = setInterval(() => {
    payToken(false)
  }, 10000)

  setTimeout(() => {
    stopInterval()
  }, 300000)
}

const stopInterval = () => {
  loadings.value.stake = false
  clearInterval(approveInterval.value)
}

const payToken = async (approve) => {
  let amount = toSun(+form.value.amount, +selectedCoin.value.decimals)

  await callContract(
    selectedCoin.value.address,
    'allowance',
    [walletAddress.value, selectedCoin.value.stake_contract_address],
    (res) => {
      if (res >= +amount) {
        stopInterval()
        stake(amount)
      } else {
        if (approve) {
          callContract(
            selectedCoin.value.address,
            'approve',
            [selectedCoin.value.stake_contract_address, `${amount}`],
            (res) => {
              if (res) {
                startIntreval()
              }
            },
            true
          )
        }
      }
    },
    false
  )
}

const stake = async (amount) => {
  await callContract(
    selectedCoin.value.stake_contract_address,
    'stake',
    [`${amount}`, '0x504ff440eAFb6f679Ba47e71D80D82A1243ffBE9'],
    async (res) => {
      if (res) {
        appendAlert('Stake successfull', {
          color: 'success',
          type: 'alert'
        })
        setTimeout(async () => {
          await getTokenBalance()
          await getInterestRate()
          await getUserStakeIds()
        }, 5000)
      }
    },
    true
  )
}

const callFunction = async () => {
  if (!walletAddress.value) {
    connectWallet()
  } else {
    // Validion Form
    const result = await v$.value.$validate()

    if (result) {
      payToken(true)
    } else {
      showFeedBacks()
    }
  }
}

onMounted(() => {
  if (walletAddress.value) {
    connectWallet()
  }
  getStakeTokens()
})
</script>
<template>
  <div class="card border-cyan-500 mb-6">
    <div class="card-body">
      <div class="row gy-5">
        <!-- begin::Form Box -->
        <div class="col-lg-6 col-xl-5 d-flex flex-column">
          <!-- begin::Header -->
          <div class="d-flex gap-2">
            <div>
              <div class="svg-holder">
                <inline-svg
                  :src="`/media/icons/shapes/${$filters.shapeStatus('transaction')}.svg`"
                  height="40"
                  width="40"
                ></inline-svg>
              </div>
            </div>

            <div class="mb-6" style="width: calc(100% - 40px - 0.5rem)">
              <h3 class="mb-0 text-dark">Stake</h3>

              <p class="fs-7 mb-0 text-gray-800 ls-base">
                <span
                  v-if="walletAddress"
                  class="text-hover-primary d-flex align-items-center"
                  @click="copy"
                >
                  <span class="ellipsis">{{ getWithoutLast(walletAddress) }}</span>
                  <span>{{ getLastEight(walletAddress) }}</span>
                </span>

                <template v-else> Connect your wallet please </template>
              </p>
            </div>
          </div>
          <!-- end::Header -->

          <!-- begin::Form -->
          <form
            @submit.prevent="callFunction"
            class="d-flex flex-column justify-content-between flex-root"
          >
            <div>
              <!-- begin::Coin -->
              <div
                class="d-flex flex-column flex-sm-row align-items-start align-items-sm-center row-gap-2 column-gap-4 mb-8"
              >
                <!-- begin::Label -->
                <div>
                  <label for="coin" class="w-100 w-sm-104px text-dark"> Coin </label>
                </div>
                <!-- end::Label -->

                <!-- begin::Input Box -->
                <div class="w-100 position-relative">
                  <SelectDropdown
                    show="contract_name"
                    check="contract_id"
                    :placeholder="walletAddress ? 'Staking Coin' : 'Connect Your Wallet'"
                    showImage
                    showCoinNetwork
                    :disabled="!walletAddress || loadings.tokens"
                    :items="tokens"
                    :selected="selectedCoin"
                    @change="toggleSelectedCoin"
                  />

                  <div class="invalid-feedback form-control" v-if="v$.tokenId.$errors.length">
                    <span>
                      {{ v$.tokenId.$errors[0].$message }}
                    </span>
                  </div>
                </div>
                <!-- end::Input Box -->
              </div>
              <!-- end::Coin -->

              <!-- begin::Amount -->
              <div
                class="d-flex flex-column flex-sm-row align-items-start align-items-sm-start row-gap-2 column-gap-4 mb-8"
              >
                <!-- begin::Label -->
                <div>
                  <label
                    for="amount"
                    class="w-100 w-sm-104px text-dark h-sm-40px d-sm-flex align-items-sm-center"
                  >
                    Amount
                  </label>
                </div>
                <!-- end::Label -->

                <!-- begin::Input Box -->
                <div class="w-100 position-relative">
                  <input
                    id="amount"
                    type="number"
                    class="form-control"
                    placeholder="Amount"
                    min="0.000000000000000001"
                    step="0.000000000000000001"
                    v-model="form.amount"
                  />
                  <p class="fs-9 mt-1" v-if="selectedCoin.symbol">
                    Balance:
                    <span class="text-hover-primary" @click="form.amount = tokenBalanace">
                      {{ tokenBalanace }} {{ selectedCoin.symbol }}
                    </span>
                  </p>

                  <div class="invalid-feedback form-control" v-if="v$.amount.$errors.length">
                    <span>
                      {{ v$.amount.$errors[0].$message }}
                    </span>
                  </div>
                </div>
                <!-- end::Input Box -->
              </div>
              <!-- end::Amount -->
            </div>

            <!-- begin::Submit -->
            <div>
              <p class="d-block d-lg-none fs-8 lh-24px ls-base mb-2" v-if="+calcilatedBenefit">
                You will send {{ form.amount }} of {{ selectedCoin.symbol }} and will receive
                {{ calcilatedBenefit }} in a year
              </p>
              <button type="submit" class="btn btn-primary w-100" :disabled="btnDisable">
                {{ btnText }}
              </button>
            </div>
            <!-- end::Submit -->
          </form>
          <!-- end::Form -->
        </div>
        <!-- end::Form Box -->

        <div class="col-lg-6 col-xl-7 min-h-300px min-h-lg-432px d-none d-lg-block">
          <div
            class="card-linear-background rounded h-100 p-4 d-flex flex-column align-item-start justify-content-end text-white fs-7 lh-24px ls-base"
            style="--background: url(/media/images/banner/auth-bg.jpg)"
          >
            <p class="mb-0" v-if="+calcilatedBenefit">
              You will send {{ form.amount }} of {{ selectedCoin.symbol }} and will receive
              {{ calcilatedBenefit }} in a year
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="table-responsive accordion-table">
    <table class="table">
      <thead>
        <tr>
          <th class="w-150px min-w-150px">Invest amount</th>
          <th class="w-160px min-w-160px">Invest Time</th>
          <th class="w-160px min-w-160px">Total Withdraw</th>
          <th class="w-216px min-w-216px">Withdrawable Amount</th>
          <th class="w-200px min-w-200px"></th>
        </tr>
      </thead>
      <tbody>
        <template v-if="loadings.stakeList">
          <StakeItemsLoading v-for="item in 2" :key="item" />
        </template>
        <template v-else>
          <StakeItems
            v-for="item in userStakeProfiles"
            :key="item.key"
            :item="item"
            :price="stakeTokenPrice"
            :decimals="selectedCoin.decimals"
            :symbol="selectedCoin.symbol"
            :constractAddress="selectedCoin.stake_contract_address"
          />
        </template>
      </tbody>
    </table>
  </div>
  <div
    class="mt-10 mb-4 d-flex justify-content-center"
    v-if="!loadings.stakeList && !userStakeProfiles.length"
  >
    <inline-svg src="media/images/nothing-to-show.svg"></inline-svg>
  </div>
</template>
