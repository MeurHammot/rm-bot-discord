const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;

module.exports = class AddNumbersCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'add-numbers',
			aliases: ['add', 'add-nums'],
			group: 'math',
			memberName: 'add',
			description: 'Звичайне додавання.',
			details: oneLine`
				Неймовірно корисна команда для додавання чисел.
			`,
			examples: ['add-numbers 1488 1337'],
			args: [
				{
					key: 'numbers',
					label: 'number',
					prompt: 'Які числа бажаєте додати? Кожне наступне повідомлення буде вважатися числом.',
					type: 'float',
					infinite: true
				}
			]
		});
	}

	async run(msg, args) {
		const total = args.numbers.reduce((prev, arg) => prev + parseFloat(arg), 0);
		return msg.reply(`${args.numbers.join(' + ')} = **${total}**`);
	}
};