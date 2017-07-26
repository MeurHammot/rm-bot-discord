const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;
const ytdl = require('ytdl-core');
const player = require('./voice.js');
const streamOptions = { seek: 0, volume: 1 };

module.exports = class SkipSongCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'skip',
			group: 'music',
			memberName: 'skip',
			description: 'Ця музика - лайно!',
			details: oneLine`
				Пропускає погані пісні.
			`,
			examples: ['!skip'],
			guildOnly: true
		});
	}

	async run(msg, args) {
		const connData = player.connections.get(msg.guild.id);
		if(connData){
			if(connData.dispatcher){
				connData.dispatcher.end();
			} else {
				msg.reply(`Та ти пісню спочатку увімкни, агов!`);
			}
		} else {
			msg.reply(`Агов, слух, я ж навіть не на каналі!`);
		}
	}
};