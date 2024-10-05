const { Events } = require('discord.js');
const { LoggingChannel, LoggingBot } = require('../config.json')
const { inviteIntoDB, getInviterFromDB } = require('../function/CoinInterac.js')
const { getUser, getActiveBooster, getActivateFboosters, setUserCoins, getUserMention } = require('../function/DataTools.js')
const { sendAnnounce } = require('../function/Chatting.js')

module.exports = {
    name: Events.MessageCreate,

    /**
     * @param {import ('discord.js').Message} message
     * @param {import ('discord.js').Client} client
     */

    async execute(message, client) {

        if (message.channel.id != LoggingChannel) return;
        if (message.author.id != LoggingBot) return;

        const JsonData = JSON.parse(message.content);

        switch (JsonData.type) {
            case 'join':
                await UserJoin(JsonData).catch(console.error);
                break;

            case 'leave':
                await UserLeave(JsonData).catch(console.error);
                break;

            default:
                break;
        }

        // function ==========

        async function UserJoin(json) {

            if (!await inviteIntoDB(json.joinerid, json.inviterid)) return
            const inviter = await getUser(json.inviterid);
            if (inviter.error) return

            //adding coin to inviter
            const multiplier = await getActiveBooster();
            await setUserCoins(json.inviterid, parseInt(inviter.info.coins) + Math.round(10 * multiplier));
            const boosters = await getActivateFboosters();

            //adding coin to booster
            if (multiplier > 1) {
                for (const booster of boosters) {
                    const boosterUser = await getUser(booster.user);
                    await setUserCoins(booster.user, parseInt(boosterUser.info.coins) + 3);
                }
            }

            //sending accouncement
            const mention = await getUserMention(json.inviterid);
            await sendAnnounce('<:icon_discord_invite:1162325232275705896>', `+${Math.round(10 * multiplier)}`, `${json.invitertag} 邀請了 ${json.joinertag} 加入了伺服器!`, mention);

            if (multiplier > 1) {
                for (const booster of boosters) {
                    const bmention = await getUserMention(booster.user);
                    await sendAnnounce('<:icon_discord_rules:1162325284763222107>', `+3`, `<@${booster.user}> ${json.invitername} 邀請了某個成員，你因 FBooster 獲得了 3 <:freecoin:1171871969617117224>!`, bmention);
                }
            }
            
        }


        async function UserLeave(json) {

            const inviter = await getInviterFromDB(json.joinerid);
            if (inviter.error) return
            const inviterUser = await getUser(inviter);
            if (inviterUser.info.coins) await setUserCoins(json.inviterid, parseInt(inviterUser.info.coins) - 10);
            const mention = await getUserMention(json.inviterid);
            return sendAnnounce('<:icon_discord_leave:1179857501169127434>', '-10', `${json.invitertag} 邀請的 ${json.joinertag} 離開了伺服器 :(`, mention);

        }

    }
}

