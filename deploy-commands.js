require('dotenv').config()
const token = process.env.TOKEN
const clientId = process.env.clientId
const guildId = process.env.inCallId

const {REST, SlashCommandBuilder, Routes} = require('discord.js')


const commands = [
    //new SlashCommandBuilder().setName('date').setDescription('tells the date'),
   //  new SlashCommandBuilder().setName('secret').setDescription('will bano tell you his deepest darkest secrets?'),
    // new SlashCommandBuilder().setName('roll').setDescription('roll random number from 1-100'),
    new SlashCommandBuilder().setName('help').setDescription('provides all the things bano can do'),
    new SlashCommandBuilder().setName('copypasta').setDescription('grabs a random post from r/copypasta sorted by hot'),
    new SlashCommandBuilder().setName('notinteresting').setDescription('grabs a random post from r/notinteresting sorted by hot'),
    new SlashCommandBuilder().setName('showerthoughts').setDescription('grabs a random post from r/showerthoughts sorted by new')
]

    .map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(token)

rest.put(Routes.applicationGuildCommands(clientId, guildId), {body: commands})
    .then((data) => console.log(`registered ${data.length} commands`))
    .catch(console.error)
