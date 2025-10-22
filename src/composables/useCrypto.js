import crypto from 'crypto-js'
const key = 'CryptoSaltKey'


export default function useCrypto() {
  const encriptCrypto = (value, password) => {
    return crypto.AES.encrypt(value, `${key}_${password}`).toString()
  }

  const decriptCrypto = (value, password) => {
    return crypto.AES.decrypt(value, `${key}_${password}`).toString(crypto.enc.Utf8)
  }

  return {
    encriptCrypto,
    decriptCrypto
  }
}
