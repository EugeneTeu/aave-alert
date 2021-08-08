import { Context } from 'telegraf'
import {
  getHealthFactor,
  getUserDeposit,
  getUserReserve,
} from '../queriesAndResolvers'

const getShaunHealthFactorAndDeposit = async (ctx: Context) => {
  try {
    const userWalletAddress =
      '0xF4A838260E11551C29D9DeE4B0c71f17bf1385Cb'.toLowerCase()

    const result = await getHealthFactor(userWalletAddress.toLowerCase())
    // const result2 = await getUserReserve(userWalletAddress.toLowerCase())
    return ctx.reply(result)
  } catch (e) {
    console.log(e)
    return ctx.reply(`Error occured la`)
  }
}
const getEugeneHealthFactorAndDeposit = async (ctx: Context) => {
  try {
    const userWalletAddress =
      '0xdaAed1035319299174299D066b41A9a63d87E805'.toLowerCase()
    const result = await getHealthFactor(userWalletAddress.toLowerCase())
    // const result2 = await getUserReserve(userWalletAddress.toLowerCase())
    return ctx.reply(result)
  } catch (e) {
    console.log(e)
    return ctx.reply(`Error occured la`)
  }
}

export { getShaunHealthFactorAndDeposit, getEugeneHealthFactorAndDeposit }
