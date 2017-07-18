const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;
const ytdl = require('ytdl-core');
const player = require('./voice.js');
const streamOptions = { seek: 0, volume: 1 };

module.exports = class UnpauseSongCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'unpause',
			group: 'music',
			memberName: 'unpause',
			description: 'Грай, як ніколи не грав!',
			details: oneLine`
				Знімає пісню з паузи.
			`,
			examples: ['!unpause'],
			guildOnly: true
		});
	}

	async run(msg, args) {
		var connData = player.connections.get(msg.guild.id);
		if(connData){
            var conn = connData.conn;
			if(conn.dispatcher){
                if(conn.dispatcher.paused){
                    conn.dispatcher.resume();
                } else {
                    msg.reply(`Та я й так граю, чого докопався?!`);
                }
			} else {
				msg.reply(`Да ти пісню спочатку замов, агов!`);
			}
		} else {
			msg.reply(`Агов, слух, я ж навіть не на каналі!`);
		}
	}
};