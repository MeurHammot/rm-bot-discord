const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;
const ytdl = require('ytdl-core');
const player = require('./voice.js');
const streamOptions = { seek: 0, volume: 1 };

module.exports = class NowPlayingCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'nowplaying',
            aliases: ['np'],
			group: 'music',
			memberName: 'nowplaying',
			description: 'Шо там зараз?!',
			details: oneLine`
				Виводить поточну пісню.
			`,
			examples: ['!nowplaying', '!np'],
			guildOnly: true
		});
	}

	async run(msg, args) {
		const connData = player.connections.get(msg.guild.id);
		if(connData){
            const conn = connData.conn;
			if(connData.dispatcher){
                const queue = connData.queue;
		        const item = queue[0];
                ytdl.getInfo(item.url, (err, info) => {
                    msg.reply(`Зараз грає **${info.title}**!`);
                });
			} else {
				msg.reply(`Та ти пісню замов спочатку, агов!`);
			}
		} else {
			msg.reply(`Агов, слух, я ж навіть не на каналі!`);
		}
	}
};