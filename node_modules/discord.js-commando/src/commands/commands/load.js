const fs = require('fs');
const oneLine = require('common-tags').oneLine;
const Command = require('../base');

module.exports = class LoadCommandCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'load',
			aliases: ['load-command'],
			group: 'commands',
			memberName: 'load',
			description: 'Завантажує нову команду.',
			details: oneLine`
				Аргументом має бути повне ім'я команди у форматі \`група:ім'яКоманди\`.
				Лише власник бота може використовувати цю команду.
			`,
			examples: ['load some-command'],
			guarded: true,

			args: [
				{
					key: 'command',
					prompt: 'Яку команду бажаєте завантажити?',
					validate: val => new Promise(resolve => {
						if(!val) return resolve(false);
						const split = val.split(':');
						if(split.length !== 2) return resolve(false);
						if(this.client.registry.findCommands(val).length > 0) {
							return resolve('Команда вже зареєстрована.');
						}
						const cmdPath = this.client.registry.resolveCommandPath(split[0], split[1]);
						fs.access(cmdPath, fs.constants.R_OK, err => err ? resolve(false) : resolve(true));
						return null;
					}),
					parse: val => {
						const split = val.split(':');
						const cmdPath = this.client.registry.resolveCommandPath(split[0], split[1]);
						delete require.cache[cmdPath];
						return require(cmdPath);
					}
				}
			]
		});
	}

	hasPermission(msg) {
		return this.client.isOwner(msg.author);
	}

	async run(msg, args) {
		this.client.registry.registerCommand(args.command);
		msg.reply(`Завантажена команда \`${this.client.registry.commands.last().name}\`.`);
		return null;
	}
};
