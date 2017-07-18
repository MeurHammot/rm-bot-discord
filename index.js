const commando = require('discord.js-commando');
const path = require('path');
const oneLine = require('common-tags').oneLine;
const client = new commando.Client({
	owner: '232256294873071618',
	commandPrefix: '!'
});

client
	.on('error', console.error)
	.on('warn', console.warn)
	.on('debug', console.log)
	.on('ready', () => {
		console.log(`Клієнт підключився; Увійшов ${client.user.username}#${client.user.discriminator} (${client.user.id})`);
	})
	.on('disconnect', () => { console.warn('Відключено!'); })
	.on('reconnecting', () => { console.warn('Перепідключення...'); })
	.on('commandError', (cmd, err) => {
		if(err instanceof commando.FriendlyError) return;
		console.error(`Помилка в команді ${cmd.groupID}:${cmd.memberName}`, err);
	})
	.on('commandBlocked', (msg, reason) => {
		console.log(oneLine`
			Команда ${msg.command ? `${msg.command.groupID}:${msg.command.memberName}` : ''}
			заблокована; ${reason}
		`);
	})
	.on('commandPrefixChange', (guild, prefix) => {
		console.log(oneLine`
			Префікс ${prefix === '' ? 'видалено' : `тепер ${prefix || 'дефолтний'}`}
			${guild ? `для гільдії ${guild.name} (${guild.id})` : 'для всіх'}.
		`);
	})
	.on('commandStatusChange', (guild, command, enabled) => {
		console.log(oneLine`
			Команда ${command.groupID}:${command.memberName}
			${enabled ? 'увімкнена' : 'вимкнена'}
			${guild ? `для гільдії ${guild.name} (${guild.id})` : 'для всіх'}.
		`);
	})
	.on('groupStatusChange', (guild, group, enabled) => {
		console.log(oneLine`
			Група ${group.id}
			${enabled ? 'увімкнена' : 'вимкнена'}
			${guild ? `для гільдії ${guild.name} (${guild.id})` : 'для всіх'}.
		`);
	});
    
client.registry
	.registerGroup('math', 'Математика').registerGroup('music', 'Музика')
	.registerDefaults()
	.registerCommandsIn(path.join(__dirname, 'commands'));
client.login('Mjg0ODYxNTk4MzUzNTg4MjI0.DDrpfg.oMnq2-huheR_GcJusGFd9YjyqOE');
module.exports.client = client;