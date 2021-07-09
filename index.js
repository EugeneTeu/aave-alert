import { Telegraf, Markup } from 'telegraf'
import pkg from 'dotenv'
import { getHealthFactor, getUserDeposit, getUserReserve } from './aave-functions/index.js'
const { config } = pkg
import { utils } from "ethers"

const getShaunHealthFactorAndDeposit = async (ctx) => {
  try {
  const userWalletAddress ='0xF4A838260E11551C29D9DeE4B0c71f17bf1385Cb'.toLowerCase()
   
   const result = await getHealthFactor(userWalletAddress.toLowerCase())
   const result2 = await getUserReserve(userWalletAddress.toLowerCase())
   return ctx.reply(`${result}\n${result2}`)
  } catch (e) {
    console.log(e)
    return ctx.reply(`Error occured la`)
  }
 }
 const getEugeneHealthFactorAndDeposit =  async (ctx) => {
  try {
  const userWalletAddress =
    '0xdaAed1035319299174299D066b41A9a63d87E805'.toLowerCase()
  const result = await getHealthFactor(userWalletAddress.toLowerCase())
  const result2 = await getUserReserve(userWalletAddress.toLowerCase())
  return ctx.reply(`${result}\n${result2}`)
  } catch (e) {
    console.log(e)
    return ctx.reply(`Error occured la`)
  }
  
}

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

bot.command("alive", (ctx) => {
  ctx.reply('hi i am alive')
} )

bot.command('shaun', getShaunHealthFactorAndDeposit)
bot.command('Shaun', getShaunHealthFactorAndDeposit)
bot.command('eugene', getEugeneHealthFactorAndDeposit)
bot.command('Eugene', getEugeneHealthFactorAndDeposit)


bot.command('dp', async (ctx) => {
  const { update : { 
    message : {
      text 
    }
  } } = ctx;
  if (!text || text.split(" ").length < 2 || text.split(" ").length > 3) {
    return ctx.reply("wrong format, should be /dp <ETH ADDRESS>")
  }
  let address = text.split(" ")[1]
  try {
    address = utils.getAddress(address)
  } catch (e) {
    // {"reason":"invalid address","code":"INVALID_ARGUMENT","argument":"address","value":"test"}
    const { reason, value } = e 
    return ctx.reply(`Received: ${value}\n rejected as ${reason}`)
  }
  const result = await getHealthFactor(userWalletAddress)
  const result2 = await getUserReserve(address.toLowerCase())
  return ctx.reply(`${result}\n${result2}`)
})

// bot.command('oldschool', (ctx) => ctx.reply('Hello'))
// bot.command('hipster', Telegraf.reply('λ'))

bot.startWebhook(`/bot${API_TOKEN}`, null, PORT)
bot.launch()
// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
