const { oneLine, stripIndents } = require('common-tags');
const Command = require('../base');
const disambiguation = require('../../util').disambiguation;

module.exports = class DisableCommandCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'disable',
			aliases: ['disable-command', 'cmd-off', 'command-off'],
			group: 'commands',
			memberName: 'disable',
			description: 'Відключає команду або групу команд.',
			details: oneLine`
				Аргумент має бути ім'ям команди або групи
				Лише адміністратор може використовувати цю команду.
			`,
			examples: ['disable util', 'disable Utility', 'disable prefix'],
			guarded: true,

			args: [
				{
					key: 'cmdOrGrp',
					label: 'command/group',
					prompt: 'Яку команду або групу команд бажаєте вимкнути?',
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
		if(!msg.guild) return this.client.isOwner(msg.author);
		return msg.member.hasPermission('ADMINISTRATOR');
	}

	async run(msg, args) {
		if(!args.cmdOrGrp.isEnabledIn(msg.guild)) {
			return msg.reply(
				`The \`${args.cmdOrGrp.name}\` ${args.cmdOrGrp.group ? 'команда' : 'група'} вже вимкнена.`
			);
		}
		if(args.cmdOrGrp.guarded) {
			return msg.reply(
				`Ви не можете відключити \`${args.cmdOrGrp.name}\` ${args.cmdOrGrp.group ? 'команда' : 'група'}.`
			);
		}
		args.cmdOrGrp.setEnabledIn(msg.guild, false);
		return msg.reply(`Вимкнено \`${args.cmdOrGrp.name}\` ${args.cmdOrGrp.group ? 'команда' : 'група'}.`);
	}
};
