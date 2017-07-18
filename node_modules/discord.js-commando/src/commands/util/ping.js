const oneLine = require('common-tags').oneLine;
const Command = require('../base');

module.exports = class PingCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'ping',
			group: 'util',
			memberName: 'ping',
			description: 'Перевіряє пінг бота.',
			throttling: {
				usages: 5,
				duration: 10
			}
		});
	}

	async run(msg) {
		if(!msg.editable) {
			const pingMsg = await msg.reply('Пінг...');
			return pingMsg.edit(oneLine`
				${msg.channel.type !== 'dm' ? `${msg.author},` : ''}
				Понг! Подорож повідомлення зайняла ${pingMsg.createdTimestamp - msg.createdTimestamp}ms.
				${this.client.ping ? `Heartbeat пінг ${Math.round(this.client.ping)}ms.` : ''}
			`);
		} else {
			await msg.edit('Пінг...');
			return msg.edit(oneLine`
				Понг! Подорож повідомлення зайняла ${msg.editedTimestamp - msg.createdTimestamp}ms.
				${this.client.ping ? `Heartbeat пінг ${Math.round(this.client.ping)}ms.` : ''}
			`);
		}
	}
};
