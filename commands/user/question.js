const { SlashCommandBuilder, EmbedBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder } = require('@discordjs/builders')
const { TextInputStyle } = require('discord.js')
const { QuestionChannel, QuestionRole } = require('../../config.json')
const { getUser, setUserCoins } = require('../../function/DataTools')

let isQuestionIng = false;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!')
        .addIntegerOption(option =>
            option.setName('數量')
                .setDescription('問題的獎勵')
                .setRequired(true)
        ),

    /**
     * @param {import('discord.js').CommandInteraction} interaction
     * @param {import('discord.js').Client} client
     * @param {import('discord.js').Message} message
     */

    async execute(interaction, client) {

        const user = await getUser(interaction.user.id);
        if (user.error) return await interaction.followUp(`找不到你的帳號，因此你付不了 FreeCoin...請前往 ${dashurl} 註冊。`);
        if (isQuestionIng) return await interaction.editReply({ content: `目前有人在出題中，請稍後再試。`, ephemeral: true })

        const modal = new ModalBuilder()
            .setCustomId('Question-Freecoin')
            .setTitle('輸入要問的問題')

        const qs = new TextInputBuilder()
            .setCustomId('text')
            .setRequired(true)
            .setLabel('你的問題')
            .setStyle(TextInputStyle.Paragraph)
            .setMinLength(10)
            .setMaxLength(2048)

        const ans = new TextInputBuilder()
            .setCustomId('text')
            .setRequired(true)
            .setLabel('你的問題')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("使用\"|\"分隔正確答案，請不要使用空格。範例: 答案1|答案2|...")
            .setMinLength(1)
            .setMaxLength(200)

        const coin = new TextInputBuilder()
            .setCustomId('coin')
            .setRequired(true)
            .setLabel('Freecoin 數量')
            .setStyle(TextInputStyle.Short)
            .setMinLength(1)
            .setMaxLength(3)

        modal.addComponents(new ActionRowBuilder().addComponents(qs).addComponents(coin).addComponents(ans))
        await interaction.showModal(modal)

        //========== colloector ==========

        const nextfilter = i => i.customId === 'Question-Freecoin' && i.user.id === interaction.user.id
        const modalinter = await interaction.awaitModalSubmit({ filter: nextfilter, time: 5 * 60 * 1000 }).catch(async () => {
            return interaction.editReply({ content: '> 你沒有回應，請重新操作', embeds: [], components: [], ephemeral: true })
        })

        if (isQuestionIng) return await modalinter.reply({ content: '目前有人在出題中，請稍後再試。', ephemeral: true })
        isQuestionIng = true;

        await modalinter.reply({ content: '系統檢查中...', ephemeral: true })

        const question = modalinter.fields.getTextInputValue('text')
        const answer = modalinter.fields.getTextInputValue('ans')
        const money = modalinter.fields.getTextInputValue('coin')
        let amount = 0;

        if (/[^0-9]/.test(money) || amount <= 0 || amount < 15 || user.info.coins < amount) {
            isQuestionIng = false;
            if (/[^0-9]/.test(money)) return await modalinter.reply(`請輸入正確的數字。\n> 你剛剛輸入的問題: \n\`\`\`${question}\`\`\``)
            amount = parseInt(money);
            if (amount <= 0) return await modalinter.editReply(`你要付給別人.....多少錢?蛤?\n> 你剛剛輸入的問題: \n\`\`\`${question}\`\`\``);
            if (amount < 15) return await modalinter.editReply(`太少了啦，至少要超過 15 <:freecoin:1171871969617117224>。\n> 你剛剛輸入的問題: \n\`\`\`${question}\`\`\``)
            if (user.info.coins < amount) return await modalinter.editReply(`你沒有足夠的 FreeCoin 可以支付!\n> 你剛剛輸入的問題: \n\`\`\`${question}\`\`\``)
        }

        if (question.includes('<@') || question.includes('@everyone') || question.includes('@here') || question.includes('<!@')) {
            isQuestionIng = false;
            return await modalinter.editReply(`Hmm. 你是不是在嘗試亂tag? 把所有的提及刪掉再試一次。`);
        }

        isQuestionIng = true;
        await modalinter.reply('檢查通過，問題發送中...');
        await setUserCoins(interaction.user.id, user.info.coins - amount);
        const answerlist = answer.split('|');
        const qschannel = interaction.guild.channels.cache.get(QuestionChannel);

        const embed = new EmbedBuilder()
            .setTitle("<:icon_discord_channel:1162324963424993371> 新的問題！")
            .setDescription(`<:icon_discord_channel:1162324963424993371> 問題: ${question}`)
            .addFields(
                { name: '獎勵', value: `${amount} <:freecoin:1171871969617117224>`, inline: true },
                { name: '發起人', value: `<@${interaction.user.id}>`, inline: true },
                { name: '剩餘時間', value: `<t:${Math.floor(Date.now() / 1000) + 60}:R>`, inline: true }
            );

        const questionMsg = await qschannel.send({ content: `## <@&${QuestionRole}> ${interaction.user}`, embeds: [embed] });
        const theard = await questionMsg.startThread({ name: '新的問題!' })
        await modalinter.editReply(`已成功發起問題: https://discord.com/channels/1161357736819302500/${QuestionChannel}/${questionMsg.id}，請等待回答。`);

        const messageListener = async (message) => {

            if (message.channel.id != await theard.then(thr => thr.id)) return;
            if (message.author.bot) return;
            if (message.author.id === interaction.user.id) return message.reply("你當然知道答案阿，不要亂回答。")

            if (answerlist.includes(message.content) && isQuestionIng) {
                isQuestionIng = false;
                await message.react("👍");
                await message.reply(`Woooo 恭喜你答對了! 獲得 ${amount} <:freecoin:1171871969617117224>!`);
                await questionMsg.edit(`# 此問題已結束!\n- 問題答案:\n${answerlist.join("\n> ")}`);
                await setUserCoins(message.author.id, await getUser(message.author.id).info.coins + amount);
                await theard.then(thread => thread.setLocked(true));
                return client.off('messageCreate', messageListener);
            } else {
                await message.react("👎");
            }
        }

        client.on('messageCreate', messageListener);

        setTimeout(async () => {
            if (isQuestionIng) {
                isQuestionIng = false;
                await theard.then(async thread => {
                    await theard.send(`# 此問題已結束!，好像沒有人答對...\n那這個獎勵只好充公了...`)
                    await thread.setLocked(true)
                });
            }
        }, 60 * 1000);

    }
}