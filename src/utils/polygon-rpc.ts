import pkg from 'dotenv'
// get Dot env
const { config } = pkg
config()

export const mainnetRPC = 'https://polygon-rpc.com'

export const mainnetWSS = 'wss://rpc-mainnet.matic.quiknode.pro'

export const mainnetRPCPrivate = `https://rpc-mainnet.maticvigil.com/v1/${process.env.MATIC_MAINNET}`

export const mainnetPrivateWss = `wss://rpc-mainnet.maticvigil.com/ws/v1/${process.env.MATIC_MAINNET}`

export const testnetRPC = 'https://matic-mumbai.chainstacklabs.com'

export const testnetWSS = 'wss://ws-matic-mumbai.chainstacklabs.com'

export const mumbaiPrivateWss = `wss://rpc-mumbai.maticvigil.com/ws/v1/${process.env.MATIC_MUMBAI}`
