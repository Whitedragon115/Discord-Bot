const { Events } = require('discord.js');
const { ChatChannel } = require('../config.json')
const { addexp } = require('../function/Leveling.js')

module.exports = {
    name: Events.MessageCreate,

    /**
    * @param {import ('discord.js').Message} message
    */

    async execute(message, client) {

        if (message.author.bot) return;
        if (!message.channel.id.includes(ChatChannel)) return;

        //anit spam (signle char spam)
        const detectedMsgLength = 100
        const detectedRepetCount = 15
        if (message.content.length > detectedMsgLength) {
            let spamde = false
            for (let i = 0; i < message.contente.length - detectedRepetCount - 1; i++) {
                const repetmsg = message.content.slice(i, i + detectedRepetCount)
                let repet = true
                for (const char of repetmsg) if (char != message.content[i]) repet = false
                if (repet) spamde = true
            }

            if (spamde) {
                message.reply('Spam detected\n-# this message will not be add to your xp level\n-# if you continue spamming you will be muted')
                return;
            }
        }

        //filter message
        const regex = /<(@|:)[^>]+>/g;
        const filteredMessage = message.content.replace(regex, ' ')
        
        //Adding XP
        addexp(message.author.id, filteredMessage.length)

    }
}
