const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;
const ytdl = require('ytdl-core');
const streamOptions = { seek: 0, volume: 1 };
const connections = new Map();

module.exports = class JoinVoiceCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'voice',
			group: 'music',
			memberName: 'voice',
			description: 'Бот, матір твою, а ну йди сюди!',
			details: oneLine`
				Викликає бота в чат.
			`,
			examples: ['!voice'],
			guildOnly: true
		});
	}

	async run(msg, args) {
		const channel = msg.member.voiceChannel;
		if (channel && channel.type === 'voice') {
			if(true){
				channel.join().then(conn => {
					conn.player.on('error', (...e) => console.log('player', ...e));
					if (!connections.has(msg.guild.id)) connections.set(msg.guild.id, { conn, queue: [] });
					msg.reply('Приєднався!');
				});
			}
		} else {
			msg.reply('Зайди в голосовий канал спочатку, агов!');
		}
	}
};
module.exports.connections = connections;