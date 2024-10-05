const { Events } = require('discord.js');
const { EmbedBuilder } = require('@discordjs/builders');
const { BoxPrefix, AdminRole } = require('../config.json')
const { getUser, setUserCoins } = require('../function/DataTools.js')
const { clearSignsFromDB } = require('../function/System.js')

module.exports = {
    name: Events.MessageCreate,

    /**
    * @param {import ('discord.js').Message} message
    */

    async execute(message, client) {


        if (message.author.bot) return;
        if (message.channel.type === 'dm') return;
        if (!message.member.roles.cache.some(r => r.id == AdminRole)) return;
        if (!message.content.startsWith(BoxPrefix)) return;

        const msgContent = message.content.slice(1);
        const args = msgContent.split(' ');
        const command = args.shift().toLowerCase();
        const NewEmbedBuilder = new EmbedBuilder()
        let user = {}

        switch (command) {
            case 'add':
                // !set <@968013433482141696> 12341234
                if (args.length != 3) return message.react('❌');
                if (!args[1].startsWith('<@') || !args[1].endsWith('>')) return message.react('❌');
                if (checkAvailability(args)) return message.react('❌');

                user = await getUser(args[1].slice(2, -1));
                await setUserCoins(args[1], user.info.coins + parseInt(args[2]));

                NewEmbedBuilder
                    .setTitle('Add Coins')
                    .setDescription(`Add ${args[2]} coins to ${user.info.username}`)
                    .addFields({ name: 'User', value: user.username, inline: true }, { name: 'Coins', value: user.info.coins + args[2], inline: true })
                    .setColor('GREEN')
                    .setTimestamp();

                await message.reply({ embeds: [NewEmbedBuilder] });

                break;
            case 'take':

                if (args.length != 3) return message.react('❌');
                if (!args[1].startsWith('<@') || !args[1].endsWith('>')) return message.react('❌');
                if (checkAvailability(args)) return message.react('❌');

                user = await getUser(args[1].slice(2, -1));
                await setUserCoins(args[1], user.info.coins - parseInt(args[2]));

                NewEmbedBuilder
                    .setTitle('Take Coins')
                    .setDescription(`Take ${coin} coins from ${user.username}`)
                    .addFields({ name: 'User', value: user.username, inline: true }, { name: 'Coins', value: getusercoin, inline: true })
                    .setColor('RED')
                    .setTimestamp();

                await message.reply({ embeds: [NewEmbedBuilder] });

                break;
            case 'set':

                if (args.length != 3) return message.react('❌');
                if (!args[1].startsWith('<@') || !args[1].endsWith('>')) return message.react('❌');
                if (checkAvailability(args)) return message.react('❌');

                user = await getUser(args[1].slice(2, -1));
                await setUserCoins(args[1], parseInt(args[2]));

                NewEmbedBuilder
                    .setTitle('Set Coins')
                    .setDescription(`Set ${coin} coins to ${user.username}`)
                    .addFields({ name: 'User', value: user.username, inline: true }, { name: 'Coins', value: getusercoin, inline: true })
                    .setColor('BLUE')
                    .setTimestamp();

                await message.reply({ embeds: [NewEmbedBuilder] });

                break;
            case 'get':

                if (args.length != 2) return message.react('❌');
                if (!args[1].startsWith('<@') || !args[1].endsWith('>')) return message.react('❌');
                if (checkAvailability(args)) return message.react('❌');

                user = await getUser(args[1].slice(2, -1));
                const getusercoin = user.info.coins;

                NewEmbedBuilder
                    .setTitle('Get Coins')
                    .setDescription(`Get ${user.username} coins`)
                    .addFields({ name: 'User', value: user.username, inline: true }, { name: 'Coins', value: getusercoin, inline: true }, { name: 'Signs', value: getusersign, inline: true })
                    .setColor('YELLOW')
                    .setTimestamp();

                await message.reply({ embeds: [NewEmbedBuilder] });

                break;
            case 'cs':

                await clearSignsFromDB()
                
                NewEmbedBuilder
                    .setTitle('Clear Sign')
                    .setDescription(`Clear all sign`)
                    .setColor('YELLOW')
                    .setTimestamp();

                await message.reply({ embeds: [NewEmbedBuilder] });

                break;
            default:
                break;
        }


        async function checkAvailability(args) {
            const user = await GetUser(args[1].slice(2, -1));
            const coin = parseInt(args[2]);
            if (!user || !coin) return true;
        }

    }
}
