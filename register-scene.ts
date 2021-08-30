import { Scenes, Context, Composer, Markup } from 'telegraf'

const stepHandler = new Composer<Scenes.WizardContext>()
stepHandler.action('next', async (ctx) => {
  if (!ctx) {
    return
  }
  await ctx.reply('Validating Address')
  console.log(ctx)
  // if (ctx.message?.text?.length != 1) {
  //   ctx.reply('please enter address again')
  //   return
  // }
  // //@ts-ignore
  // ctx.wizard.state.address = ctx.message.text
  // ctx.reply(`Registering this chat with id of ${ctx.message.text}`)
  return ctx.wizard.next()
})

export const superWizard = new Scenes.WizardScene(
  'super-wizard',
  async (ctx) => {
    //@ts-ignore
    ctx.wizard.state.chatId = ctx.chat?.id
    await ctx.reply(
      'Please input your metamask Address:',
      Markup.inlineKeyboard([Markup.button.callback('Next', 'next')])
    )

    return ctx.wizard.next()
  },
  stepHandler,
  async (ctx) => {
    await ctx.reply('All set!')
    return await ctx.scene.leave()
  }
)
// FK THIS API
