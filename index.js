import { Telegraf, Markup } from 'telegraf'
import pkg from 'dotenv'
import { getHealthFactor, getUserDeposit } from './aave-functions/index.js'
const { config } = pkg

config()
const bot = new Telegraf(process.env.BOT_TOKEN)

bot.start((ctx) => ctx.reply('Hello there.'))

bot.command('quit', (ctx) => {
  // Using context shortcut
  ctx.leaveChat()
})
bot.command('name', (ctx) => {
  ctx.reply('hi i am aave monitoring')
})

bot.command("shaun", (ctx) => {
  getHealthFactor("0xF4A838260E11551C29D9DeE4B0c71f17bf1385Cb".toLowerCase()).then((result) => ctx.reply(result))
})

bot.command("eugene", (ctx) => {
  getHealthFactor('0xdaAed1035319299174299D066b41A9a63d87E805'.toLowerCase()).then((result) => ctx.reply(result))
})

bot.command("aaron", (ctx) => {
  getHealthFactor('0xD7C2D39DF7BFEc541364B38fF3E33278971c23Cf'.toLowerCase()).then((result) => ctx.reply(result))
})

bot.command('deposits', (ctx) => {
  getUserDeposit().then((result) => ctx.reply(result))
})

// bot.command('oldschool', (ctx) => ctx.reply('Hello'))
// bot.command('hipster', Telegraf.reply('λ'))

bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
