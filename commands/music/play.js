const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;
const ytdl = require('ytdl-core');
const voice = require('./voice.js');
const { getInfo } = require('ytdl-getinfo');
var ypi = require('youtube-playlist-info');
const streamOptions = { seek: 0, volume: 1 };

module.exports = class PlayMusicCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'play',
			group: 'music',
			memberName: 'play',
			description: 'Грає музику, ось.',
			details: oneLine`
				Ця команда має грати музику.
				І наче грає.
                А взагалі, я - Сковорода!
			`,
			examples: ['!play <посилання в Сибір>'],
			guildOnly: true,
			args: [
				{
					key: 'url',
					label: 'youtubeURL',
					prompt: 'Яку музику бажаєте?',
					type: 'string'
				}
			]
		});
	}

	async run(msg, args) {
		const connData = voice.connections.get(msg.guild.id);
		if (connData) {
			const queue = connData.queue;
			const tmpqueue = connData.queue;
			const conn = connData.conn;
			var url = args.url;
			
			if(url.startsWith('https://www.youtube.com/watch?v=') || url.startsWith('https://youtu.be/')){
				if(url.startsWith('https://youtu.be/')) {
					url = url.replace('https://youtu.be/','https://www.youtube.com/watch?v=')
				}
				if(url.includes('list=')){
					var tmp = url.replace('https://www.youtube.com/watch?v=','');
					var tmplist = tmp.split('&list=');
					var video = tmplist[0];
					if(tmplist[1].includes('&index=')){
						tmp = tmplist[1].split('&index=');
						tmplist[1] = tmp[0];
					}
					var playlist = tmplist[1];
					msg.reply(`Я трохи дурнуватий, тому сам вирішуй що хочеш.\n**Відео**: https://www.youtube.com/watch?v=${video}\n**Плейліст**: https://www.youtube.com/playlist?list=${playlist}`);
					return;
				}
				queue.push({ url, msg });
				if (conn.dispatcher) {
					msg.reply(`Оке, чекай, тут ще ${queue.length - 1} пісень перед твоєю.`);
					return;
				}
				doQueue(connData);
			} else if(url.startsWith('https://www.youtube.com/playlist?list=')) {
				var list = url.replace('https://www.youtube.com/playlist?list=','');
				ypi.playlistInfo("AIzaSyDkAAd9MxxBrIUdJGssHvd5AXHXF7FUsH8", list, function(playlistItems) {
					for(var i = 0; i < playlistItems.length; i++){
						url = 'https://www.youtube.com/watch?v='+playlistItems[i].resourceId.videoId;
						queue.push({ url, msg });
					}
					msg.reply(`Додав ${playlistItems.length} пісень в чергу. Нічого собі.`);
					if (conn.dispatcher) {
						msg.reply(`Оке, чекай, тут ще ${queue.length - 1} пісень перед твоєю.`);
						return;
					}
					doQueue(connData);
					return;
				});
			} else {
				msg.reply(`Шукаю на Youtube...`);
				getInfo(url).then(info => {
					url = info.items[0].webpage_url;
					queue.push({ url, msg });
					console.log(info.items[0].webpage_url);
					msg.reply(`Додав **${info.items[0].title}.**`);
					console.log(url);
					if (conn.dispatcher) {
						msg.reply(`Оке, чекай, тут ще ${queue.length - 1} пісень перед твоєю.`);
						return;
					}
					doQueue(connData);
					return;
				});
			}
		} else {
			msg.reply(`Агов, слух, я ж навіть не на каналі!`);
		}
	}
};
	function doQueue(connData) {
		const conn = connData.conn;
		const queue = connData.queue;
		const item = queue[0];
		if (!item) return;
		const stream = ytdl(item.url, { filter: 'audioonly' }, { passes: 3 });
		const dispatcher = conn.playStream(stream);
		stream.on('info', info => {
			item.msg.channel.sendMessage(`Так-с, на черзі **${info.title}**`);
		});
		dispatcher.on('end', () => {
			if(voice.repeat === true){
				var shift = queue.shift();
				var url = shift.url;
				var msg = shift.msg;
				connData.queue.push({ url, msg });
			} else {
				queue.shift();
			}
			doQueue(connData);
		});
		dispatcher.on('error', (...e) => console.log('dispatcher', ...e));
		connData.dispatcher = dispatcher;
	}