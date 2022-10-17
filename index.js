require('dotenv').config()
const token = process.env.TOKEN
const clientId = process.env.clientId
const { Client, GatewayIntentBits, IntegrationExpireBehavior, EmbedBuilder, 
    ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
const cron = require('node-cron')
const clock = require('world-clock')()
const snoowrap = require('snoowrap')
const r = new snoowrap({
    userAgent: 'suparvenoid',
    clientId: process.env.redditClientId,
    clientSecret: process.env.secret,
    username: process.env.username,
    password: process.env.password
})
const fetch = require('node-fetch')

async function getRandomCopyPasta() {
    const response = await fetch('https://www.reddit.com/r/copypasta/new/.json')
    const data = await response.json()
    let randomIndex = Math.round((Math.random() * data.data.children.length))
    console.log(data.data.children[randomIndex].data.selftext)
    let returnValue = await [(data.data.children[randomIndex].data.selftext), 
    data.data.children[randomIndex].data.title, 
    data.data.children[randomIndex].data.url]
    return returnValue
}

async function getRandomNotInteresting() {
    const response = await fetch('https://www.reddit.com/r/notinteresting/hot/.json')
    const data = await response.json()
    let randomIndex = Math.round((Math.random() * data.data.children.length))
    let returnValue = await [(data.data.children[randomIndex].data.title),
    data.data.children[randomIndex].data.url,
    data.data.children[randomIndex].data.thumbnail]
    return returnValue
}

async function getRandomShowerThoughts() {
    const response = await fetch('https://www.reddit.com/r/showerthoughts/new/.json')
    const data = await response.json()
    let randomIndex = Math.round((Math.random() * data.data.children.length))
    console.log(data.data.children[randomIndex].data.selftext)
    let returnValue = await [
    data.data.children[randomIndex].data.title, 
    data.data.children[randomIndex].data.url]
    return returnValue
}


const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences
        ],
        allowedMentions: { parse: ['users', 'roles']}
})


client.on('guildMemberAdd', (member) => {
    let imgUrl = member.avatarURL

    const welcomeEmbed = new EmbedBuilder()
	.setColor('White')
	.setAuthor({ name: 'welcome ' + member.user.username + '!', 
    iconURL:'https://cdn.discordapp.com/avatars/1022963715328462909/c5058252fb1c61a487fe0eaec326b60c.webp',
    url: 'https://discord.js.org' })
	.setTitle('welcome to the server!')
	.setImage('https://pbs.twimg.com/media/EhdcsnwUMAACPG9.png')
	.setTimestamp()
	.setFooter({ text: 'enjoy your stay!'})

    member.guild.channels.cache.get('1023402894067769377').send(`welcome <@${member.user.id}> to ${member.guild}`)
    member.guild.channels.cache.get('1023402894067769377').send({embeds: [welcomeEmbed]})


})


client.once('ready', () => {
    console.log(`${client.user.username} is online`)
})

client.on('messageCreate', (ctx) => {
    if (ctx.author == client.user) {
        return
    }
    
    let entireLog = ctx.createdTimestamp + ' '+ ctx.author.username + ': ' + ctx.content
    console.log(entireLog)

    let command = ctx.content.split(' ')

    let luckyNum = Math.round(Math.random() * 1000)
    if (luckyNum == 271) {
        ctx.channel.send('fr ng')
    }

    

})

client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;
	const { commandName } = interaction;
    if (commandName === 'date') {
        let monthMap = {
            1: 'January',
            2: 'February',
            3: 'March',
            4: 'April',
            5: 'May',
            6: 'June',
            7: 'July',
            8: 'August',
            9: 'September',
            10: 'October',
            11: 'November',
            12: 'December'
        }
        let currentDate = new Date()
        let dateContent = monthMap[currentDate.getMonth() + 1] + ' ' 
        + currentDate.getDate() + ', ' + currentDate.getFullYear()

        const timeEmbed = new EmbedBuilder()
        .setColor('White')
        .setTitle(dateContent)

        const timeRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setLabel('UTC Time')
                .setStyle(ButtonStyle.Link)
                .setURL('https://www.timeanddate.com/worldclock/timezone/utc')
            )
        await interaction.reply({embeds: [timeEmbed], components: [timeRow]})
    } else if (commandName === 'secret') {
        const listOfSecrets = [
            'i was actually an experiment',
            'i stole my pfp off some stupid cartoon',
            'im actually useless',
            "because it's you, i should tell you that you smell awful"
        ]
        const randomSecret = listOfSecrets[Math.round(Math.random() * 4)]
        const username = interaction.member.user.username
        const randEmbed = new EmbedBuilder()
        .setColor('White')
        .setTitle('my secret with ' + username + ' and i')
        .setDescription(randomSecret)

        await interaction.reply({ephemeral: true, embeds: [randEmbed]})
    } else if (commandName === 'roll') {
        let randomNumber = Math.round(Math.random() * 100) + ''
        await interaction.reply(randomNumber)
    } else if (commandName === 'copypasta') {
        try {
            let randomPost = await getRandomCopyPasta()
            const randReddit = new EmbedBuilder()
            .setColor('White')
            .setTitle(randomPost[1])
            .setURL(randomPost[2])
            .setDescription(randomPost[0])
            await interaction.reply({embeds: [randReddit]})
        } catch(err) {
            console.log(err)
            interaction.reply('sorry try again')
        }
    } else if (commandName === 'notinteresting') {
        try {
            let randomPost = await getRandomNotInteresting()
            const randReddit = new EmbedBuilder()
            .setColor('White')
            .setTitle(randomPost[0])
            .setURL(randomPost[1])
            .setImage(randomPost[1])
            await interaction.reply({embeds : [randReddit]})
        } catch(err) {
            console.log(err)
            interaction.reply('sorry try again')
        }  
    } else if (commandName === 'showerthoughts') {
        try {
            let randomPost = await getRandomShowerThoughts()
            const randReddit = new EmbedBuilder()
            .setColor('White')
            .setTitle(randomPost[0])
            .setURL(randomPost[1])
            await interaction.reply({embeds : [randReddit]})
        } catch(err) {
            console.log(err)
            interaction.reply('sorry try again')
        }

    } else if (commandName === 'help') {
        await interaction.reply('im too lazy to add this feature sorry')
    }
})




client.login(token)

 