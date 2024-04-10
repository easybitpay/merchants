// Vue
import { computed } from 'vue'

// Store
import { useConnectWalletStore } from '@/stores/connectWallet'

// Alert
import { appendAlert } from '@/assets/js/Alerts'

import ABI from '@/core/abiConfig.json'

import Web3 from 'web3'

const web3 = new Web3(window.ethereum)

export default function useCallContract() {
  const connectWalletStore = useConnectWalletStore()
  const walletAddress = computed(() => connectWalletStore.walletAddress)

  const callContract = async (
    contractAddress,
    methodName,
    args,
    callback,
    changeState = false,
    value = null
  ) => {
    try {
      let myContract = new web3.eth.Contract(ABI, contractAddress)

      if (!changeState) {
        await myContract.methods[methodName](...args).call((err, res) => {
          if (res) {
            callback && callback(res)
          }
        })
      } else {
        let data = myContract.methods[methodName](...args).encodeABI()
        await web3.eth.estimateGas({
          data: data,
          from: walletAddress.value,
          to: contractAddress
        })

        let options = {
          from: walletAddress.value,
          gasPrice: await web3.eth.getGasPrice()
        }

        if (value && value > 0) {
          options.value = value * 1e18
        }
        await myContract.methods[methodName](...args).send(options, (err, res) => {
          if (res) {
            callback && callback(res)
          }
        })
      }
    } catch (error) {
      
      console.log(error.message.message)
      appendAlert(error.message, {
        color: 'danger',
        type: 'alert'
      })
    }
  }

  const getMainCoinBalance = async (walletAddress) => {
    let result = await web3.eth.getBalance(walletAddress)
    result = web3.utils.fromWei(result, 'ether')

    return result
  }

  const fromSun = (value, decimals) => {
    return +value / Number(`1e${decimals}`)
  }

  const toSun = (value, decimals) => {
    return +value * Number(`1e${decimals}`)
  }

  return { callContract, fromSun, toSun, getMainCoinBalance }
}
