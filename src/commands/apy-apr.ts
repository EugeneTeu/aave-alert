import { Context } from 'telegraf'
import {
  getApyApr,
  getHealthFactor,
  getUserDeposit,
  getUserReserve,
} from '../queriesAndResolvers'

const getAPYAPR = async (ctx: Context, symbol: string) => {
  try {
    const result = await getApyApr(symbol)
    return ctx.reply(`${result}\n`)
  } catch (e) {
    console.log(e)
    return ctx.reply(`Error occured la`)
  }
}

export { getAPYAPR }
