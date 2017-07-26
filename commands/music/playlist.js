const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;
const ytdl = require('ytdl-core');
const player = require('./voice.js');
const streamOptions = { seek: 0, volume: 1 };

module.exports = class PlaylistCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'playlist',
            aliases: ['list'],
			group: 'music',
			memberName: 'playlist',
			description: 'Меню, бдьлска!',
			details: oneLine`
				Показує список пісень в черзі.
			`,
			examples: ['!playlist', '!list'],
			guildOnly: true
		});
	}

	async run(msg, args) {
		const connData = player.connections.get(msg.guild.id);
		if(connData){
            const conn = connData.conn;
			if(connData.dispatcher){
                const queue = connData.queue;
				msg.reply('Зачекай хвильку, згадаю що там...');
				var result = `Усього пісень: ${queue.length}. Найближчі пісні:`;
				syncLoop(queue.length, function(loop){  
					setTimeout(function(){
						var i = loop.iteration();
						var item = queue[i];
						ytdl.getInfo(item.url, (err, info) => {
							result += `\n**${i}. ${info.title}**`;
							if(loop.iteration() >= 9){
								loop.break(true);
							}
							loop.next();
						});
					}, 1);
				}, function(){
					msg.reply(result);
				});
			} else {
				msg.reply(`Та ти пісню замов спочатку, агов!`);
			}
		} else {
			msg.reply(`Агов, слух, я ж навіть не на каналі!`);
		}
	}
};

function syncLoop(iterations, process, exit){  
    var index = 0,
        done = false,
        shouldExit = false;
    var loop = {
        next:function(){
            if(done){
                if(shouldExit && exit){
                    return exit(); // Exit if we're done
                }
            }
            // If we're not finished
            if(index < iterations){
                index++; // Increment our index
                process(loop); // Run our process, pass in the loop
            // Otherwise we're done
            } else {
                done = true; // Make sure we say we're done
                if(exit) exit(); // Call the callback on exit
            }
        },
        iteration:function(){
            return index - 1; // Return the loop number we're on
        },
        break:function(end){
            done = true; // End the loop
            shouldExit = end; // Passing end as true means we still call the exit callback
        }
    };
    loop.next();
    return loop;
}