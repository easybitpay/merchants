<script setup>
// Vue
import { computed, onMounted, ref } from 'vue'

// Store
import { useConnectWalletStore } from '@/stores/connectWallet'
import { useSwapStore } from '@/stores/swap'

// Alert
import { appendAlert } from '@/assets/js/Alerts'

// Hooks
import useCallContract from '@/composables/useCallContract.js'

// Componenets
import SelectDropdown from '../../components/globals/SelectDropdown.vue'
import CoinDropdown from '../../components/globals/CoinDropdown.vue'

// ----- START ----- //

// Generals
const { callContract, getMainCoinBalance, fromSun, toSun } = useCallContract()
const connectWalletStore = useConnectWalletStore()
const swapStore = useSwapStore()

// Refs
const networks = ref([])
const selectedNetwork = ref({})
const tokens = ref({})

const tokenIn = ref({})
const amountIn = ref(null)
const tokenInBalanceInterval = ref(null)

const tokenOut = ref({})
const amountOut = ref(null)
const tokenOutBalanceInterval = ref(null)

const sqrtPriceX96 = ref(0)

const approveInterval = ref(null)

const loadings = ref({
  network: false,
  wallet: false,
  tokens: false,
  swap: false
})

// Computeds
const walletAddress = computed(() => connectWalletStore.walletAddress)

const btnDisable = computed(() => {
  if (!walletAddress.value) return false

  if (loadings.value.wallet || loadings.value.network || loadings.value.swap) return true

  if (!selectedNetwork.value.nick_name) return true

  if (!tokenIn.value.symbol || !tokenOut.value.symbol) return true

  if (!amountIn.value || !+amountOut.value) return true

  if (+amountIn.value > +tokenIn.value.balance) return true

  return false
})

const btnText = computed(() => {
  if (loadings.value.wallet || loadings.value.network || loadings.value.swap) return 'Loading...'

  if (!walletAddress.value) return 'Connect your wallet'

  if (!selectedNetwork.value.nick_name) return 'Choose network'

  if (!tokenIn.value.symbol || !tokenOut.value.symbol) return 'Choose tokens'

  if (!amountIn.value || !+amountOut.value) return 'Enter amount'

  if (+amountIn.value > +tokenIn.value.balance) return 'More than balance'

  return 'Swap'
})

const networkTokens = computed(() => {
  let networkName = selectedNetwork.value.nick_name

  return networkName ? tokens.value[networkName].tokens : []
})

const pairPrice = computed(() => {
  let tokenInDecimals = +tokenIn.value.decimals
  let tokenOutDecimals = +tokenOut.value.decimals

  let decimals =
    tokenInDecimals > tokenOutDecimals
      ? tokenInDecimals - tokenOutDecimals
      : tokenOutDecimals - tokenInDecimals

  const price = sqrtPriceX96.value ** 2 / 2 ** 192

  const finalPrice = toSun(+price, decimals)

  let addressIn =
    tokenIn.value.address == '0x0000000000000000000000000000000000000000'
      ? selectedNetwork.value.weth
      : tokenIn.value.address

  let addressOut =
    tokenOut.value.address == '0x0000000000000000000000000000000000000000'
      ? selectedNetwork.value.weth
      : tokenOut.value.address

  let symbol =
    addressIn < addressOut
      ? `${tokenIn.value.symbol}_${tokenOut.value.symbol}`
      : `${tokenOut.value.symbol}_${tokenIn.value.symbol}`
  let symbolReverce =
    addressIn > addressOut
      ? `${tokenIn.value.symbol}_${tokenOut.value.symbol}`
      : `${tokenOut.value.symbol}_${tokenIn.value.symbol}`

  let content = {}
  content[symbol] = finalPrice
  content[symbolReverce] = 1 / finalPrice

  return content
})

// Functions
const getWithoutLast = (address) => {
  let stringWithoutLast10 = address.substring(0, address.length - 10)
  return stringWithoutLast10
}

const getLastEight = (address) => {
  let last10Characters = address.substring(address.length - 10)
  return last10Characters
}

const calcTokenOutAmount = () => {
  let symbol = `${tokenIn.value.symbol}_${tokenOut.value.symbol}`

  amountOut.value = +amountIn.value * pairPrice.value[symbol]
}

const calcTokenInAmount = () => {
  let symbol = `${tokenIn.value.symbol}_${tokenOut.value.symbol}`

  amountIn.value = +amountOut.value / pairPrice.value[symbol]
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
  await connectWalletStore.connectToChain(selectedNetwork.value.nick_name).then(async (res) => {
    if (!res) {
      selectedNetwork.value = {}
    }
  })

  // Stop Loading
  loadings.value.network = false
}

const toggleSelectedNetwork = (network) => {
  let beforeSelected = selectedNetwork.value.swap_contract

  selectedNetwork.value = network

  if (beforeSelected != network.swap_contract) {
    connectNetwork()
  }
}

const switchTokens = () => {
  let token_in = { ...tokenIn.value }
  let token_out = { ...tokenOut.value }

  tokenIn.value = token_out
  tokenOut.value = token_in
}

const toggleTokenIn = async (token) => {
  // let beforeSelected = tokenIn.value.address

  if (token.address == tokenOut.value.address) {
    switchTokens()
  } else {
    tokenIn.value = token
  }

  if (tokenOut.value.address) {
    await checkSqrtPriceX96()
  }

  getTokenInBalanceInterval()
}

const toggleTokenOut = async (token) => {
  // let beforeSelected = tokenOut.value.address

  if (token.address == tokenIn.value.address) {
    switchTokens()
  } else {
    tokenOut.value = token
  }

  if (tokenIn.value.address) {
    await checkSqrtPriceX96()
  }

  getTokenOutBalanceInterval()
}

const getTokenInBalanceInterval = () => {
  if (tokenInBalanceInterval.value) {
    clearInterval(tokenInBalanceInterval.value)
    tokenInBalanceInterval.value = null
  }

  tokenIn.value.balance = 0

  if (tokenIn.value.address) {
    getTokenInBalance()
    tokenInBalanceInterval.value = setInterval(() => {
      getTokenInBalance()
    }, 15000)
  }
}

const getTokenInBalance = async () => {
  let address = tokenIn.value.address

  if (address === '0x0000000000000000000000000000000000000000') {
    tokenIn.value.balance = await getMainCoinBalance(walletAddress.value)
  } else {
    await callContract(
      address,
      'balanceOf',
      [walletAddress.value],
      (res) => {
        if (res) {
          tokenIn.value.balance = fromSun(+res, +tokenIn.value.decimals)
        }
      },
      false
    )
  }
}

const getTokenOutBalanceInterval = () => {
  if (tokenOutBalanceInterval.value) {
    clearInterval(tokenOutBalanceInterval.value)
    tokenOutBalanceInterval.value = null
  }

  tokenOut.value.balance = 0

  if (tokenOut.value.address) {
    getTokenOutBalance()
    tokenOutBalanceInterval.value = setInterval(() => {
      getTokenOutBalance()
    }, 15000)
  }
}

const getTokenOutBalance = async () => {
  let address = tokenOut.value.address

  if (address === '0x0000000000000000000000000000000000000000') {
    tokenOut.value.balance = await getMainCoinBalance(walletAddress.value)
  } else {
    await callContract(
      address,
      'balanceOf',
      [walletAddress.value],
      (res) => {
        if (res) {
          tokenOut.value.balance = fromSun(+res, +tokenOut.value.decimals)
        }
      },
      false
    )
  }
}

const checkSqrtPriceX96 = async () => {
  sqrtPriceX96.value = 0
  let tokenInAddress =
    tokenIn.value.address == '0x0000000000000000000000000000000000000000'
      ? selectedNetwork.value.weth
      : tokenIn.value.address

  let tokenOutAddress =
    tokenOut.value.address == '0x0000000000000000000000000000000000000000'
      ? selectedNetwork.value.weth
      : tokenOut.value.address

  await callContract(
    selectedNetwork.value.swap_contract,
    'getPrice',
    [tokenInAddress, tokenOutAddress, 3000],
    (res) => {
      if (res) {
        sqrtPriceX96.value = +res
      }
    },
    false
  )
}

const getSwapTokens = async () => {
  // Start Loading
  loadings.value.tokens = true

  // Request
  await swapStore.getSwapTokens().then((res) => {
    if (res) {
      networks.value = res.networks
      tokens.value = res.tokens
    }
  })

  // Stop Loading
  loadings.value.tokens = false
}

const startIntreval = () => {
  loadings.value.swap = true

  approveInterval.value = setInterval(() => {
    payToken(false)
  }, 10000)

  setTimeout(() => {
    stopInterval()
  }, 300000)
}

const stopInterval = () => {
  loadings.value.swap = false
  clearInterval(approveInterval.value)
}

const payToken = async (approve) => {
  let amount = toSun(+amountIn.value, +tokenIn.value.decimals)

  if (tokenIn.value.address == '0x0000000000000000000000000000000000000000') {
    swap()
  } else {
    await callContract(
      tokenIn.value.address,
      'allowance',
      [walletAddress.value, selectedNetwork.value.swap_contract],
      (res) => {
        if (res >= +amount) {
          stopInterval()
          swap()
        } else {
          if (approve) {
            callContract(
              tokenIn.value.address,
              'approve',
              [selectedNetwork.value.swap_contract, `${amount}`],
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
}

const swap = async () => {
  let amount = toSun(+amountIn.value, +tokenIn.value.decimals)

  await callContract(
    selectedNetwork.value.swap_contract,
    'swapToken',
    [
      tokenIn.value.address,
      tokenOut.value.address,
      `${amount}`,
      3000,
      '0x504ff440eAFb6f679Ba47e71D80D82A1243ffBE9'
    ],
    async (res) => {
      if (res) {
        appendAlert('Swap successfull', {
          color: 'success',
          type: 'alert'
        })
        setTimeout(async () => {
          await checkSqrtPriceX96()
        }, 5000)
      }
    },
    true,
    tokenIn.value.address == '0x0000000000000000000000000000000000000000' ? +amountIn.value : 0
  )
}

const callFunction = async () => {
  if (!walletAddress.value) {
    connectWallet()
  } else {
    payToken(true)
  }
}

onMounted(() => {
  if (walletAddress.value) {
    connectWallet()
  }
  getSwapTokens()
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
              <h3 class="mb-0 text-gray-900">Swap</h3>

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
              <!-- begin::Network -->
              <div class="w-100 position-relative mb-8">
                <SelectDropdown
                  show="nick_name"
                  showImageKey="nick_name"
                  :placeholder="walletAddress ? 'Preffer Network' : 'Connect Your Wallet'"
                  showImage
                  :disabled="!walletAddress || loadings.tokens"
                  :items="networks"
                  :selected="selectedNetwork"
                  @change="toggleSelectedNetwork"
                />
              </div>
              <!-- end::Network -->

              <!-- begin::Token In -->
              <div
                class="d-flex flex-column flex-sm-row align-items-start align-items-sm-start row-gap-2 column-gap-4 mb-8"
              >
                <!-- begin::Label -->
                <div>
                  <label
                    for="tokenIn"
                    class="w-100 w-sm-104px text-gray-900 h-sm-40px d-sm-flex align-items-sm-center"
                  >
                    Token In
                  </label>
                </div>
                <!-- end::Label -->

                <!-- begin::Input Box -->
                <div class="w-100">
                  <div class="position-relative d-flex align-items-center">
                    <input
                      id="tokenIn"
                      type="number"
                      class="form-control px-9"
                      placeholder="Amount In"
                      v-model="amountIn"
                      @input="calcTokenOutAmount"
                      min="0.000000000000000001"
                      step="0.000000000000000001"
                    />
                    <!-- begin::Icon -->
                    <inline-svg
                      src="media/icons/icons/arrow-forward.svg"
                      class="position-absolute start-8px"
                    ></inline-svg>
                    <!-- end::Icon -->

                    <div class="position-absolute end-8px">
                      <CoinDropdown
                        showImage
                        :disabled="!selectedNetwork.nick_name || loadings.tokens"
                        :items="networkTokens"
                        :selected="tokenIn"
                        @change="toggleTokenIn"
                      />
                    </div>
                  </div>

                  <p class="fs-9 mt-1 mb-0" v-if="tokenIn.symbol">
                    Balance:
                    <span
                      class="text-hover-primary"
                      @click="
                        () => {
                          amountIn = tokenIn.balance || 0
                          calcTokenOutAmount()
                        }
                      "
                    >
                      {{ tokenIn.balance || 0 }} {{ tokenIn.symbol }}
                    </span>
                  </p>
                </div>
                <!-- end::Input Box -->
              </div>
              <!-- end::Token In -->

              <!-- begin::Token Out -->
              <div
                class="d-flex flex-column flex-sm-row align-items-start align-items-sm-start row-gap-2 column-gap-4 mb-8"
              >
                <!-- begin::Label -->
                <div>
                  <label
                    for="tokenOut"
                    class="w-100 w-sm-104px text-gray-900 h-sm-40px d-sm-flex align-items-sm-center"
                  >
                    Token Out
                  </label>
                </div>
                <!-- end::Label -->

                <!-- begin::Input Box -->
                <div class="w-100">
                  <div class="position-relative d-flex align-items-center">
                    <input
                      id="tokenOut"
                      type="number"
                      class="form-control px-9"
                      placeholder="Amount Out"
                      v-model="amountOut"
                      @input="calcTokenInAmount"
                      min="0.000000000000000001"
                      step="0.000000000000000001"
                    />
                    <!-- begin::Icon -->
                    <inline-svg
                      src="media/icons/icons/arrow-backward.svg"
                      class="position-absolute start-8px"
                    ></inline-svg>
                    <!-- end::Icon -->

                    <div class="position-absolute end-8px">
                      <CoinDropdown
                        showImage
                        :disabled="!selectedNetwork.nick_name || loadings.tokens"
                        :items="networkTokens"
                        :selected="tokenOut"
                        @change="toggleTokenOut"
                      />
                    </div>
                  </div>

                  <p class="fs-9 mt-1 mb-0" v-if="tokenOut.symbol">
                    Balance:
                    <span
                      class="text-hover-primary"
                      @click="
                        () => {
                          amountOut = tokenOut.balance || 0
                          calcTokenInAmount()
                        }
                      "
                    >
                      {{ tokenOut.balance || 0 }} {{ tokenOut.symbol }}
                    </span>
                  </p>
                </div>
                <!-- end::Input Box -->
              </div>
              <!-- end::Token Out -->
            </div>

            <!-- begin::Submit -->
            <div>
              <p class="d-block d-lg-none fs-8 lh-24px ls-base mb-2">
                All conversions are approximate.
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
            <p class="mb-0">All conversions are approximate.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
