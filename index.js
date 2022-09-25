require('dotenv').config()
const token = process.env.TOKEN
const { Client, GatewayIntentBits } = require('discord.js')

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ] })

client.once('ready', () => {
    console.log('yahoo!')
})

client.on('messageCreate', (ctx) => {
    if (ctx.author.id !== client.user.id) {
        ctx.channel.send(ctx.content)
    }
})

client.login(token)

