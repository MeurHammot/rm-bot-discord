const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;
const ytdl = require('ytdl-core');
const player = require('./voice.js');
const streamOptions = { seek: 0, volume: 1 };

module.exports = class StopVoiceCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'stop',
			group: 'music',
			memberName: 'stop',
			description: 'Астанавітєсь!',
			details: oneLine`
				Зупиняє музику. Видаляє чергу.
			`,
			examples: ['!stop'],
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
				connData.repeat = false;
				connData.dispatcher.end();
				msg.reply(`Готово, більше воно не грає.`);
			} else {
				msg.reply(`Да воно й так не грає.`);
			}
		} else {
			msg.reply(`Агов, слух, я ж навіть не на каналі!`);
		}
	}
};