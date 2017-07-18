const { stripIndents, oneLine } = require('common-tags');
const Command = require('../base');
const disambiguation = require('../../util').disambiguation;

module.exports = class HelpCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'help',
			group: 'util',
			memberName: 'help',
			aliases: ['commands'],
			description: 'Показує доступні команди, або детальну інформацію про конкретну команду.',
			details: oneLine`
				Команда має бути частиною імені команди або цілим ім'ям команди.
				Якщо не задана, то відображається список доступних команд на сервері.
			`,
			examples: ['help', 'help prefix'],
			guarded: true,

			args: [
				{
					key: 'command',
					prompt: 'З якою командою допомогти?',
					type: 'string',
					default: ''
				}
			]
		});
	}

	async run(msg, args) { // eslint-disable-line complexity
		const groups = this.client.registry.groups;
		const commands = this.client.registry.findCommands(args.command, false, msg);
		const showAll = args.command && args.command.toLowerCase() === 'all';
		if(args.command && !showAll) {
			if(commands.length === 1) {
				let help = stripIndents`
					${oneLine`
						__Команда **${commands[0].name}**:__ ${commands[0].description}
						${commands[0].guildOnly ? ' (доступна лише на серверах)' : ''}
					`}

					**Формат:** ${msg.anyUsage(`${commands[0].name}${commands[0].format ? ` ${commands[0].format}` : ''}`)}
				`;
				if(commands[0].aliases.length > 0) help += `\n**Псевдоніми:** ${commands[0].aliases.join(', ')}`;
				help += `\n${oneLine`
					**Група:** ${commands[0].group.name}
					(\`${commands[0].groupID}:${commands[0].memberName}\`)
				`}`;
				if(commands[0].details) help += `\n**Детально:** ${commands[0].details}`;
				if(commands[0].examples) help += `\n**Приклади:**\n${commands[0].examples.join('\n')}`;

				const messages = [];
				try {
					messages.push(await msg.direct(help));
					if(msg.channel.type !== 'dm') messages.push(await msg.reply('Інформація відправлена тобі в ПП.'));
				} catch(err) {
					messages.push(await msg.reply('Не можу відправити тобі ПП з допомогою. Можливо у вас відключені ПП.'));
				}
				return messages;
			} else if(commands.length > 1) {
				return msg.reply(disambiguation(commands, 'commands'));
			} else {
				return msg.reply(
					`Не можу розпізнати команду. Використайте ${msg.usage(
						null, msg.channel.type === 'dm' ? null : undefined, msg.channel.type === 'dm' ? null : undefined
					)} щоб переглянути список всіх команд.`
				);
			}
		} else {
			const messages = [];
			try {
				messages.push(await msg.direct(stripIndents`
					${oneLine`
						Щоб запустити команду на ${msg.guild || 'будь-якому сервері'},
						пиши ${Command.usage('command', msg.guild ? msg.guild.commandPrefix : null, this.client.user)}.
						Наприклад, ${Command.usage('prefix', msg.guild ? msg.guild.commandPrefix : null, this.client.user)}.
					`}
					Щоб використати команду у цій переписці пиши ${Command.usage('command', null, null)} без префіксу.

					Скористайся ${this.usage('<command>', null, null)} щоб переглянути детальну інформацію про команду.
					Скористайся ${this.usage('all', null, null)} щоб переглянути список усіх команд, а не тільки доступних.

					__**${showAll ? 'Всі команди' : `Команди доступні у ${msg.guild || 'цій переписці'}`}**__

					${(showAll ? groups : groups.filter(grp => grp.commands.some(cmd => cmd.isUsable(msg))))
						.map(grp => stripIndents`
							__${grp.name}__
							${(showAll ? grp.commands : grp.commands.filter(cmd => cmd.isUsable(msg)))
								.map(cmd => `**${cmd.name}:** ${cmd.description}`).join('\n')
							}
						`).join('\n\n')
					}
				`, { split: true }));
				if(msg.channel.type !== 'dm') messages.push(await msg.reply('Відправив ПП з інформацією.'));
			} catch(err) {
				messages.push(await msg.reply('Не можу відправити тобі ПП з допомогою. Можливо у вас відключені ПП.'));
			}
			return messages;
		}
	}
};
