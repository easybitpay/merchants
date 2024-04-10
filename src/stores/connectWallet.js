// Vue
import { ref, computed } from 'vue'

// Pinia
import { defineStore } from 'pinia'

// Alert
import { appendAlert } from '@/assets/js/Alerts'

// Chains List
const chainsList = {
  polygon: {
    chainId: `0x${Number(137).toString(16)}`, // A 0x-prefixed hexadecimal string
    chainName: 'Polygon Mainnet',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC', // 2-6 characters long
      decimals: 18
    },
    rpcUrls: [
      'https://polygon-rpc.com/',
      'https://rpc-mainnet.matic.network',
      'https://matic-mainnet.chainstacklabs.com',
      'https://rpc-mainnet.maticvigil.com',
      'https://rpc-mainnet.matic.quiknode.pro',
      'https://matic-mainnet-full-rpc.bwarelabs.com'
    ],
    blockExplorerUrls: ['https://polygonscan.com']
  },
  binance: {
    chainId: `0x${Number(56).toString(16)}`, // A 0x-prefixed hexadecimal string
    chainName: 'BNB Smart Chain',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB', // 2-6 characters long
      decimals: 18
    },
    rpcUrls: [
      'https://bsc-dataseed1.binance.org',
      'https://binance.llamarpc.com',
      'https://bsc-dataseed.bnbchain.org',
      'https://bsc-dataseed1.bnbchain.org',
      'https://bsc-dataseed1.defibit.io',
      'https://bsc-dataseed1.ninicoin.io'
    ],
    blockExplorerUrls: ['https://bscscan.com']
  }
}

// Store
export const useConnectWalletStore = defineStore('connectWallet', () => {
  // ----- States -----
  const wallet = ref('')
  const network = ref('')

  // ----- Computeds -----
  const walletAddress = computed(() =>
    wallet.value ? wallet.value : sessionStorage.getItem('walletAddress')
  )
  const connectedNetwork = computed(() => {
    network.value ? network.value : sessionStorage.getItem('connectedNetwork')
  })

  // ----- Function -----
  function setWalletAddress(address) {
    wallet.value = address
    sessionStorage.setItem('walletAddress', address)
  }

  function setNetwork(name) {
    network.value = name
    sessionStorage.setItem('connectedNetwork', name)
  }

  function clearWalletAddress() {
    wallet.value = ''

    sessionStorage.removeItem('walletAddress')
  }

  function clearNetwork() {
    network.value = ''

    sessionStorage.removeItem('connectedNetwork')
  }

  /**
   * Switch To Chain
   * @param {chain name} chainName
   */
  async function connectToChain(chainName) {
    const chain = chainName.toLowerCase()
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainsList[chain].chainId }]
      })

      setNetwork(chain)

      return true
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [chainsList[chain]]
          })

          setNetwork(chain)

          return true
        } catch (addError) {
          appendAlert(addError.message, {
            color: 'danger',
            type: 'alert'
          })

          clearNetwork()
          clearWalletAddress()
          return false
        }
      }

      appendAlert(switchError.message, {
        color: 'danger',
        type: 'alert'
      })

      clearWalletAddress()
      return false
    }
  }

  /**
   * Try Connect To MetaMast
   */
  async function connectToMetaMask() {
    const prodiver = await window.ethereum

    if (typeof prodiver !== 'undefined') {
      await window.ethereum
        .request({ method: 'eth_requestAccounts' })
        .then(async (accounts) => {
          setWalletAddress(accounts[0])
        })
        .catch((err) => {
          appendAlert(err.message, {
            color: 'danger',
            type: 'alert'
          })

          clearWalletAddress()
        })

      /**
       * Check If MetaMast Disconnect
       */
      window.ethereum.on('disconnect', () => {
        clearWalletAddress()
      })

      /**
       * Check If MetaMast Account Change
       */
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length) {
          setWalletAddress(accounts[0])
        } else {
          clearWalletAddress()
        }
      })
    } else {
      appendAlert('Please Install Wallet Extenssion', {
        color: 'danger',
        type: 'alert'
      })
    }
  }

  return {
    walletAddress,
    connectedNetwork,

    connectToChain,
    connectToMetaMask
  }
})
