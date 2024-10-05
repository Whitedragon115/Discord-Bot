const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('@discordjs/builders')
const { getUserFboosters, getUser } = require('../../function/DataTools.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('fbooster')
        .setDescription('Look the fbooser you have')
        .addSubcommand(sub => sub
            .setName('view')
            .setDescription('View your FBooster')
        )
        .addSubcommand(sub => sub
            .setName('use')
            .setDescription('View your FBooster')
        )
        .addSubcommand(sub => sub
            .setName('buy')
            .setDescription('View your FBooster')
        ),

    /**
     * @param {import('discord.js').CommandInteraction} interaction
     * @param {import('discord.js').Client} client
     */

    async execute(interaction, client) {

        const user = await getUser(interaction.user.id);
        if (user.error) return await interaction.reply(`找不到你的帳號...請前往 ${dashurl} 註冊。`);

        const subcmd = interaction.options.getSubcommand();
        await interaction.reply('指令執行中...');

        switch (subcmd) {
            case 'view':
                await ViewFBooster();
                break;
                
            case 'use':
                await UseFBooster();
                break;

            case 'buy':
                await BuyFBooster();
                break;

            default:
        }

        //function ====================


        async function ViewFBooster() {
            const boosters = await getUserFboosters(interaction.user.id);
            if (!boosters) return await interaction.editReply('你沒有任何 FBooster。');

            const embed = new EmbedBuilder()
                .setTitle('你的 🚀FBooster 列表:')
                .setColor(0x00ff00);

            for (let i = 0; i < boosters.length; i++) {
                embed.addFields(`${i}. ID: ${boosters[i]._id}`, `\`${boosters[i].multiplier}\` 倍，作用時長: ${boosters[i].lasts} 小時`);
            }

            await interaction.editReply({ embeds: [embed], content: '' });

        }

        async function BuyFBooster() {
            const embed = new EmbedBuilder()
                .setTitle('FBooster 商店')
                .setDescription('此功能商未開放，所以你還不能購買 FBooster\n-# 詳見 [Docs](<https://docs.freeserver.tw/freecoin/fbooster/gain>)')
                .setColor(0x00ff00);

            await interaction.editReply({ embeds: [embed], content: '' });
        }

        async function UseFBooster() {
            const boosters = await getUserFboosters(interaction.user.id);
            if (!boosters) return await interaction.editReply('你沒有任何 FBooster。');

            const row = new ActionRowBuilder()
            const selectMenu = new StringSelectMenuBuilder()
                .setCustomId('fboosterselect')
                .setPlaceholder('選擇一個你的 FBooster...')

            for (const booster of boosters) {
                const option = new StringSelectMenuOptionBuilder()
                    .setLabel(`${booster._id} | ${booster.multiplier} 倍，作用時長: ${booster.lasts} 小時`)
                    .setValue(booster._id);

                selectMenu.addOptions(option);
            }

            return await interaction.editReply({ content: '選擇你要啟動的 Fbooster:', components: [row], });
        }
    }
}
