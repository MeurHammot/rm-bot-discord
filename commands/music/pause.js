const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;
const ytdl = require('ytdl-core');
const player = require('./voice.js');
const streamOptions = { seek: 0, volume: 1 };

module.exports = class PauseSongCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'pause',
			group: 'music',
			memberName: 'pause',
			description: 'Пауза.',
			details: oneLine`
				Ставить пісню на паузу.
			`,
			examples: ['!pause'],
			guildOnly: true
		});
	}

	async run(msg, args) {
		var connData = player.connections.get(msg.guild.id);
		if(connData){
            var conn = connData.conn;
			if(conn.dispatcher){
                if(!conn.dispatcher.paused){
                    conn.dispatcher.pause();
                } else {
                    msg.reply(`Та пісня і так на паузі, шо ти це саме!`);
                }
			} else {
				msg.reply(`Та ти пісню спочатку замов, агов!`);
			}
		} else {
			msg.reply(`Агов, слух, я ж навіть не на каналі!`);
		}
	}
};