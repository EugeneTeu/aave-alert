import { Telegraf, Context } from 'telegraf'
import pkg from 'dotenv'
import {
  getShaunHealthFactorAndDeposit,
  getEugeneHealthFactorAndDeposit,
  getAPYAPR,
} from './src/index'

const { config } = pkg
//
console.log('Init conifig...')
config()
const API_TOKEN = process.env.BOT_TOKEN || ''
const PORT = process.env.PORT || 3000
const URL = process.env.URL
console.log('Creating bot with token')
const bot = new Telegraf(API_TOKEN)
console.log('bot created!')
// bot.telegram.setWebhook(`${URL}/bot${API_TOKEN}`)

bot.start((ctx) => ctx.reply('Hello there.'))

bot.command('quit', (ctx) => {
  // Using context shortcut
  ctx.leaveChat()
})

bot.command('alive', (ctx) => {
  ctx.reply('hi i am alive')
})
//TODO: fix query
bot.command('shaun', getShaunHealthFactorAndDeposit)
bot.command('Shaun', getShaunHealthFactorAndDeposit)
bot.command('eugene', getEugeneHealthFactorAndDeposit)
bot.command('Eugene', getEugeneHealthFactorAndDeposit)

bot.command('r', async (ctx) => {
  const {
    update: {
      message: { text },
    },
  } = ctx
  if (!text || text.split(' ').length < 2 || text.split(' ').length > 3) {
    return ctx.reply('wrong format, should be /r <symbol>')
  }
  const symbol = text.split(' ')[1]
  // console.log(ctx)
  return await getAPYAPR(ctx, symbol)
})

// bot.command('dp', async (ctx) => {
//   const {
//     update: {
//       message: { text },
//     },
//   } = ctx
//   if (!text || text.split(' ').length < 2 || text.split(' ').length > 3) {
//     return ctx.reply('wrong format, should be /dp <ETH ADDRESS>')
//   }
//   let address = text.split(' ')[1]
//   try {
//     address = utils.getAddress(address)
//   } catch (e) {
//     // {"reason":"invalid address","code":"INVALID_ARGUMENT","argument":"address","value":"test"}
//     const { reason, value } = e
//     return ctx.reply(`Received: ${value}\n rejected as ${reason}`)
//   }
//   const result = await getHealthFactor(address.toLowerCase())
//   const result2 = await getUserReserve(address.toLowerCase())
//   return ctx.reply(`${result}\n${result2}`)
// })

// bot.command('oldschool', (ctx) => ctx.reply('Hello'))
// bot.command('hipster', Telegraf.reply('λ'))

// bot.startWebhook(`/bot${API_TOKEN}`, null, PORT)
console.log('bot launching!')
bot.launch()
// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
