const { stripIndents, oneLine } = require('common-tags');
const Command = require('../base');

module.exports = class PrefixCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'prefix',
			group: 'util',
			memberName: 'prefix',
			description: 'Показує або встановлює префікс для команд.',
			format: '[prefix/"default"/"none"]',
			details: oneLine`
				Якщо не запропоновано префікс, буде показано поточний.
				Якщо префікс "default", буде встановлено дефолтний префікс.
				Якщо префікс "none", команди можна бу використовувати лише за допомогою зверненнь.
				Лише адміністратор може змінювати префікс.
			`,
			examples: ['prefix', 'prefix -', 'prefix omg!', 'prefix default', 'prefix none'],

			args: [
				{
					key: 'prefix',
					prompt: 'Який префікс бажаєш встановити боту?',
					type: 'string',
					max: 15,
					default: ''
				}
			]
		});
	}

	async run(msg, args) {
		// Just output the prefix
		if(!args.prefix) {
			const prefix = msg.guild ? msg.guild.commandPrefix : this.client.commandPrefix;
			return msg.reply(stripIndents`
				${prefix ? `Префікс для команд \`${prefix}\`.` : 'Префіксу для команд нема.'}
				Щоб виконати команду пиши ${msg.anyUsage('command')}.
			`);
		}

		// Check the user's permission before changing anything
		if(msg.guild) {
			if(!msg.member.hasPermission('ADMINISTRATOR') && !this.client.isOwner(msg.author)) {
				return msg.reply('Лише адміністратор може змінювати префікс команд.');
			}
		} else if(!this.client.isOwner(msg.author)) {
			return msg.reply('Лише Пан може змінювати глобальний префікс команд.');
		}

		// Save the prefix
		const lowercase = args.prefix.toLowerCase();
		const prefix = lowercase === 'none' ? '' : args.prefix;
		let response;
		if(lowercase === 'default') {
			if(msg.guild) msg.guild.commandPrefix = null; else this.client.commandPrefix = null;
			const current = this.client.commandPrefix ? `\`${this.client.commandPrefix}\`` : 'no prefix';
			response = `Встановити дефолтний префікс (${current}).`;
		} else {
			if(msg.guild) msg.guild.commandPrefix = prefix; else this.client.commandPrefix = prefix;
			response = prefix ? `Змінити префікс на \`${args.prefix}\`.` : 'Префікс видалено.';
		}

		msg.reply(`${response} Щоб виконати команду, пиши ${msg.anyUsage('command')}.`);
		return null;
	}
};
