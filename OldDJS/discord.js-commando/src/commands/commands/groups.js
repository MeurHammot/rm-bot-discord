const stripIndents = require('common-tags').stripIndents;
const Command = require('../base');

module.exports = class ListGroupsCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'groups',
			aliases: ['list-groups', 'show-groups'],
			group: 'commands',
			memberName: 'groups',
			description: 'Список усіх груп команд.',
			details: 'Лише адміністратор може використовувати цю команду.',
			guarded: true
		});
	}

	hasPermission(msg) {
		if(!msg.guild) return this.client.isOwner(msg.author);
		return msg.member.hasPermission('ADMINISTRATOR');
	}

	async run(msg) {
		return msg.reply(stripIndents`
			__**Групи**__
			${this.client.registry.groups.map(grp =>
				`**${grp.name}:** ${grp.isEnabledIn(msg.guild) ? 'Увімкнена' : 'Вимкнена'}`
			).join('\n')}
		`);
	}
};
