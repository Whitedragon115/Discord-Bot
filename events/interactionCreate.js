const { Events, EmbedBuilder, embedLength } = require('discord.js');
const { AdminRole } = require('../config.json')
const fs = require('fs');
const path = require('path');

const Action = {};
const Command = {};
const RaitLimit = [];
LoadActionFolder();
LoadCommandFolder();

module.exports = {
	name: Events.InteractionCreate,

	/**
	 * @param {import('discord.js').Interaction} interaction - The interaction object.
	 * @param {import('discord.js').Client} client - The Discord client.
	 */

	async execute(interaction, client) {

		if (!interaction.isChatInputCommand() && !interaction.isButton() && !interaction.isModalSubmit() && !interaction.isStringSelectMenu() && !interaction.isAutocomplete()) return;

		if (interaction.isCommand() || interaction.isAutocomplete()) {
			const command = interaction.client.commands.get(interaction.commandName);
			try {
				if (interaction.isCommand()) {

					if (RaitLimit.includes(interaction.user.id)) return await interaction.reply({ content: '你執行太快了，請等等在執行命令', ephemeral: true });

					if (Command[interaction.commandName].folder.startsWith('OP-') && !interaction.member.roles.cache.some(rl => rl.id == AdminRole)) {
						const embed = new EmbedBuilder()
							.setTitle('你沒有權限使用此指令')
							.setDescription('如果遇到其他問題請聯絡管理員或是在請聯絡開發者 `whitedragon115`')
							.setColor(0xff0000)
						return interaction.reply({ embeds: [embed], ephemeral: true });
					}

					RaitLimit.push(interaction.user.id)
					setTimeout(() => {
						RaitLimit = RaitLimit.filter(id => id !== interaction.user.id);
					}, 1500);

					return await command.execute(interaction, client);
				}

				if (interaction.isAutocomplete()) {
					return await command.autocomplete(interaction, client);
				}

			} catch (error) {
				console.error(`Error executing ${interaction.commandName}`);
				console.error(error);
			}

		}

		// =============== Action Handler ===============

		try {

			if (Action[interaction.customId]) {
				return await Action[interaction.customId].execute(interaction, client);
			}

		} catch (error) {
			console.log(error);
			const erembed = new EmbedBuilder()

			if (interaction.member.roles.cache.some((rl) => rl.id == AdminRole)) {
				let ermsg = error;
				if (error.length > 4000) ermsg = error.slice(0, 4000) + '...';
				erembed
					.setTitle('New Error Occurred!')
					.setDescription('> Error: \n```console\n' + ermsg + '```')
					.setColor(0xff0000)

			} else {
				erembed
					.setTitle('發生錯誤')
					.setDescription('請聯絡管理員或是在請聯絡開發者 `whitedragon115`')
					.setColor(0xff0000)
			}

			await interaction.reply({ embeds: [erembed], ephemeral: true }).catch(() => {
				interaction.editReply({ embeds: [erembed], ephemeral: true });
			})

		}
	},
};


function LoadActionFolder() {
	const ActionFolderPath = path.join(__dirname, '..', 'util', 'action');
	const actionFolders = fs.readdirSync(ActionFolderPath);

	for (const folder of actionFolders) {
		const actionPath = path.join(ActionFolderPath, folder);
		const actionFiles = fs.readdirSync(actionPath).filter(file => file.endsWith('.js'));
		for (const file of actionFiles) {
			const filePath = path.join(actionPath, file);
			const action = require(filePath);
			Action[action.customId] = action;
		}
	}
}

function LoadCommandFolder() {
	const CommandFolderPath = path.join(__dirname, '..', 'commands');
	const commandFolders = fs.readdirSync(CommandFolderPath);

	for (const folder of commandFolders) {
		const commandPath = path.join(CommandFolderPath, folder);
		const commandFiles = fs.readdirSync(commandPath).filter(file => file.endsWith('.js'));
		for (const file of commandFiles) {
			const filePath = path.join(commandPath, file);
			const command = require(filePath);
			command.folder = folder;
			Command[command.data.name] = command;
		}
	}
}