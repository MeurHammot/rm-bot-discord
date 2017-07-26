const { oneLine, stripIndents } = require('common-tags');
const Command = require('../base');
const disambiguation = require('../../util').disambiguation;

module.exports = class ReloadCommandCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'reload',
			aliases: ['reload-command'],
			group: 'commands',
			memberName: 'reload',
			description: 'Перезавантажує команду або групу команд.',
			details: oneLine`
				Агрументом має бути ім'я/ID (повний або частина) команди або групи команд.
				Якщо вказана група команд, то будуть перезавантажені всі команди в ній.
				Лише власник бота може використовувати цю команду.
			`,
			examples: ['reload some-command'],
			guarded: true,

			args: [
				{
					key: 'cmdOrGrp',
					label: 'command/group',
					prompt: 'Яку команду або групу бажаєте перезавантажити?',
					validate: val => {
						if(!val) return false;
						const groups = this.client.registry.findGroups(val);
						if(groups.length === 1) return true;
						const commands = this.client.registry.findCommands(val);
						if(commands.length === 1) return true;
						if(commands.length === 0 && groups.length === 0) return false;
						return stripIndents`
							${commands.length > 1 ? disambiguation(commands, 'commands') : ''}
							${groups.length > 1 ? disambiguation(groups, 'groups') : ''}
						`;
					},
					parse: val => this.client.registry.findGroups(val)[0] || this.client.registry.findCommands(val)[0]
				}
			]
		});
	}

	hasPermission(msg) {
		return this.client.isOwner(msg.author);
	}

	async run(msg, args) {
		args.cmdOrGrp.reload();
		if(args.cmdOrGrp.group) {
			msg.reply(`Команда \`${args.cmdOrGrp.name}\` перезавантажена.`);
		} else {
			msg.reply(`Перезавантажені всі команди в групі \`${args.cmdOrGrp.name}\`.`);
		}
		return null;
	}
};
