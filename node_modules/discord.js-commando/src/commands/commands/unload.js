const oneLine = require('common-tags').oneLine;
const Command = require('../base');
const disambiguation = require('../../util').disambiguation;

module.exports = class UnloadCommandCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'unload',
			aliases: ['unload-command'],
			group: 'commands',
			memberName: 'unload',
			description: 'Вивантажує команду.',
			details: oneLine`
				Агрументом має бути ім'я/ID (повний або частина) команди.
				Лише власник бота може використовувати цю команду.
			`,
			examples: ['reload some-command'],
			guarded: true,

			args: [
				{
					key: 'command',
					prompt: 'Яку команду бажаєте прибрати?',
					validate: val => {
						if(!val) return false;
						const commands = this.client.registry.findCommands(val);
						if(commands.length === 1) return true;
						if(commands.length === 0) return false;
						return disambiguation(commands, 'commands');
					},
					parse: val => this.client.registry.findCommands(val)[0]
				}
			]
		});
	}

	hasPermission(msg) {
		return this.client.isOwner(msg.author);
	}

	async run(msg, args) {
		args.command.unload();
		msg.reply(`Команда \`${args.command.name}\` вивантажена.`);
		return null;
	}
};
