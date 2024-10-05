const { Events } = require('discord.js');
const { color } = require('console-log-colors')


module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {        
        client.user.setActivity({ name: 'hello world', type: 2 });
        client.user.setStatus('idle');
        const guild = client.guilds.cache.get(process.env.GUILDID);
        const memberCount = guild.memberCount;

        const login_string = `${color.green('Login : Bot')} ${color.yellow(client.user.tag)}  ║  ${color.green('BotID :')} ${color.yellow(process.env.CLIENTID)}  ║  ${color.green('Server :')} ${color.yellow(guild.name)}  ║  ${color.green('Server Member :')} ${color.yellow(memberCount)}`
        console.log(login_string);

    },
};