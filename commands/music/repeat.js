const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;
const ytdl = require('ytdl-core');
const player = require('./voice.js');
const streamOptions = { seek: 0, volume: 1 };
module.exports = class RepeatSongCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'repeat',
			group: 'music',
			memberName: 'repeat',
			description: 'Ще раз.',
			details: oneLine`
				Зациклює список відтворення.
			`,
			examples: ['!repeat'],
			guildOnly: true
		});
	}

	async run(msg, args) {
		const connData = player.connections.get(msg.guild.id);
		if(connData){
            const conn = connData.conn;
			if(connData.dispatcher){
                if(!connData.repeat){
                    connData.repeat = true;
                    msg.channel.sendMessage(`Повторення списку відтворення **увімкнене**!`);
                } else {
                    connData.repeat = false;
                    msg.channel.sendMessage(`Повторення списку відтворення **вимкнене**!`);
                }
			} else {
				msg.reply(`Та ти пісню спочатку замов, агов!`);
			}
		} else {
			msg.reply(`Агов, слух, я ж навіть не на каналі!`);
		}
	}
};