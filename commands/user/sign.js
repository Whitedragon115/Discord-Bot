const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');
const { getSignFromDB, signIntoDB, getUser, setUserCoins, getInviterFromDB, getActiveBooster, getActivateFboosters, getUserMention } = require('../../function/DataTools');
const { sendAnnounce } = require('../../function/Chatting');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),

    /**
     * @param {import('discord.js').CommandInteraction} interaction
     * @param {import('discord.js').Client} client
     */

    async execute(interaction, client) {

        const checkSigned = await getSignFromDB(interaction.user.id);
        if (checkSigned) return await interaction.reply(`你已經簽到過ㄌ! 明天再來8`);

        await interaction.reply('指令執行中...');

        const user = await getUser(interaction.user.id);

        if (user.error) {
            const embed = new EmbedBuilder()
                .setTitle('好像還沒註冊...')
                .setDescription('找不到你的帳號...請前往 [這裡](https://dash.freeserver.tw) 註冊。')
                .setColor(0xff0000)

            return await interaction.editReply({ embeds: [embed], content: '' });
        }

        const random = Math.floor(Math.random() * 3) + 1;
        const multiplier = await getActiveBooster();
        const amount = Math.ceil(random * multiplier);
        const inviter = await getInviterFromDB(interaction.user.id);


        await setUserCoins(interaction.user.id, user.info.coins + parseInt(amount));

        if (inviter) {
            const inviterUser = await getUser(inviter);
            if (!inviterUser.error) await setUserCoins(inviter, parseInt(inviterUser.info.coins) + 1)
        }

        if (multiplier > 1) {
            const boosters = await getActivateFboosters();
            for (const booster of boosters) {
                if (booster.user == interaction.user.id) continue;
                const boosterUser = await getUser(booster.user);
                await setUserCoins(booster.user, parseInt(boosterUser.info.coins) + Math.round(random / 2));
            }
        }

        await signIntoDB(interaction.user.id);

        await interaction.editReply({
            content: `> 已成功簽到! 你獲得了 ${amount} <:freecoin:1171871969617117224> ${multiplier > 1 ? `(${random}+${amount - random}加成)` : ''}! ${inviter ? `\n-# 你的邀請者 <@${inviter}> 獲得了 1 <:freecoin:1171871969617117224>!` : ''}`,
            allowedMentions: { parse: [] }
        });

        const mention = await getUserMention(interaction.user.id);
        await sendAnnounce('<:icon_discord_rules:1162325284763222107>', `+${amount}`, `<@${interaction.user.id}> 簽到了!`, mention);

        if (inviter) {
            const inviterMention = await getUserMention(inviter);
            await sendAnnounce('<:icon_discord_invite:1162325232275705896>', `+1`, `<@${inviter}> 邀請的 ${interaction.user.username} 簽到了!`, inviterMention);
        }

        if (multiplier > 1) {
            const boosters = await getActivateFboosters();
            for (const booster of boosters) {
                if (booster.user == interaction.user.id) continue;
                const bmention = await getUserMention(booster.user);
                await sendAnnounce('<:icon_discord_rules:1162325284763222107>', `+${Math.round(random / 2)}`, `<@${booster.user}> ${interaction.user.username} 簽到了，你因 FBooster 獲得了 ${Math.round(random / 2)} <:freecoin:1171871969617117224>!`, bmention);
            }
        }
    }
}