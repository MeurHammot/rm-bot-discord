const promiseUntil = require('promise-until');
const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;
var querystring = require('querystring');
var https = require('https');

module.exports = class BusSearchCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'bus',
			group: 'google',
			memberName: 'bus',
			description: 'Пошук автобусів.',
			details: oneLine`
				Шукає автобуси (ні).
			`,
			examples: ['!bus'],
			guildOnly: true
		});
	}

	async run(msg, args) {
        var headers = {'Cookie' : "gts.web.uuid=739F8077-4F3C-4F57-AFE9-A3B9578BABD9; gts.web.city=chernigiv; gts.web.top_panel.expanded=true; gts.web.google_map.center.lon=45.42600076882936; gts.web.google_map.center.lat=9.054365158081055; gts.web.google_map.zoom=15"};
        var options = {
            host: 'city.dozor.tech',
            path: '/data?t=2&p=1372',
            method: 'GET',
            headers: headers
        };
        var allBus;
        var activeBus;
        var req = https.request(options, function(res) {
            res.setEncoding('utf-8');

            var responseString = '';

            res.on('data', function(data) {
                responseString += data;
            });

            res.on('end', function() {
                var responseObject = JSON.parse(responseString);
                allBus = responseObject.data[0].dvs;
                let i = 0;
                var result = '';
                promiseUntil(() => {
                    return i === allBus.length;
                }, () => {
                    result += `\n${allBus[i].gNb} : ${allBus[i].spd}`;
                    i++;
                }).then(() => {
                    msg.reply(result);
                });
            });
        });
        req.end();
	}
};