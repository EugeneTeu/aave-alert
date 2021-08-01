import { Telegraf, Markup } from 'telegraf'
import pkg from 'dotenv'
import { getHealthFactor, getUserDeposit } from './aave-functions/index.js'
const { config } = pkg

config()
const API_TOKEN = process.env.BOT_TOKEN || '';
const PORT = process.env.PORT || 3000;
const URL = process.env.URL || 'https://your-heroku-app.herokuapp.com';

const bot = new Telegraf(API_TOKEN);
bot.telegram.setWebhook(`${URL}/bot${API_TOKEN}`);


bot.start((ctx) => ctx.reply('Hello there.'))

bot.command('quit', (ctx) => {
  // Using context shortcut
  ctx.leaveChat()
})

bot.settings(async (ctx) => {
  await ctx.setMyCommands([
    {
      command: '/name',
      description: 'echo',
    },
  ])
  return ctx.reply('Ok')
})
bot.help(async (ctx) => {
  const commands = await ctx.getMyCommands()
  const info = commands.reduce(
    (acc, val) => `${acc}/${val.command} - ${val.description}\n`,
    ''
  )
  return ctx.reply(info)
})
bot.command('name', (ctx) => {
  ctx.reply('hi i am aave monitoring')
})

bot.command('shaun', (ctx) => {
  getHealthFactor(
    '0xF4A838260E11551C29D9DeE4B0c71f17bf1385Cb'.toLowerCase()
  ).then((result) => ctx.reply(result))
})

bot.command('eugene', async (ctx) => {
  const userWalletAddress =
    '0xdaAed1035319299174299D066b41A9a63d87E805'.toLowerCase()
  const result = await getHealthFactor(userWalletAddress)
  const result2 = await getUserDeposit(userWalletAddress)
  ctx.reply(`${result}\n${result2}`)
})

bot.command('aaron', (ctx) => {
  getHealthFactor(
    '0xD7C2D39DF7BFEc541364B38fF3E33278971c23Cf'.toLowerCase()
  ).then((result) => ctx.reply(result))

  getUserDeposit()
})

bot.command('deposits', (ctx) => {
  getUserDeposit().then((result) => ctx.reply(result))
})

// bot.command('oldschool', (ctx) => ctx.reply('Hello'))
// bot.command('hipster', Telegraf.reply('λ'))

bot.startWebhook(`/bot${API_TOKEN}`, null, PORT)
bot.launch()
// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
