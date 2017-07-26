const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;
const ytdl = require('ytdl-core');
const player = require('./voice.js');
const streamOptions = { seek: 0, volume: 1 };

module.exports = class LeaveVoiceCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'leave',
			group: 'music',
			memberName: 'leave',
			description: 'Пішов в пень, бот поганий!',
			details: oneLine`
				Гонить бота з канала на Гонти могилу.
			`,
			examples: ['!leave'],
			guildOnly: true
		});
	}

	async run(msg, args) {
		const connData = player.connections.get(msg.guild.id);
		if(connData){
			const conn = connData.conn;
			const queue = connData.queue;
			if(queue.length > 1){
				queue.splice(1, queue.length);
			}
			if(connData.dispatcher){
				connData.dispatcher.end();
			}
			conn.channel.leave();
			msg.reply(`Бувай!`);
			player.connections.delete(msg.guild.id);
		} else {
			msg.reply(`Агов, слух, я ж навіть не на каналі!`);
		}
	}
};