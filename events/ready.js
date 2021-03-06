const Discord = require('discord.js')
const Enmap = require('enmap')
const fs = require('fs')

module.exports = async (client, pool) => {
  //Setup bot
  console.log(`[STARTUP] Logged in as: ${client.user.tag}`);
  //Set the bot's activity
  client.user.setActivity(`Currently serving ${client.guilds.size} servers`);

  // Storing data
  client.settings = new Enmap({
    name: "settings",
    fetchAll: false,
    autoFetch: true,
    cloneLevel: 'deep'
  });

  client.settings.defaultSettings = {
    prefix: "w!"
  }

  //Database connection
  pool.connect( async (err, clientDB, done) => {
    if(err) throw err;
    console.log('[STARTUP] Connected to PostgresSQL');

    //Get all database information
    let result = await clientDB.query('SELECT * from guilds');

    //Log servers and users total
    let memberCount = 0;
    client.guilds.cache.forEach((guild) => {
      console.log(`[STARTUP] ${guild.name} (${guild.memberCount}) (id: ${guild.id})`);
      memberCount += guild.members.cache.filter(member => !member.user.bot).size;
    });

    //Log all servers with corresponding data for debug
    result.rows.forEach((guild) => {
      client.settings.set(guild.id, guild.prefix, "prefix");
			console.log(`[STARTUP] ${guild.id}, ${guild.prefix}`)
    });

    console.log(`[STARTUP] Servers: ${client.guilds.cache.size} Users: ${memberCount}`);

		//Set the bot's activity
  	client.user.setActivity(`Currently serving ${client.guilds.cache.size} servers`);
  });
}
