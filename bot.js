const Discord = require("discord.js");
const client = new Discord.Client();
const auth = require("./auth.json");
const path = require("path");

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", message => {
  // Voice only works in guilds, if the message does not come from a guild,
  // we ignore it
  if (!message.guild) return;

  if (message.content.indexOf("vitas") >= 0) {
    // Only try to join the sender's voice channel if they are in one themselves
    let voiceChannel = message.member.voiceChannel;
    if (message.member.voiceChannel) {
      voiceChannel
        .join()
        .then(connection => {
          // Connection is an instance of VoiceConnection
          // To play a file, we need to give an absolute path to it
          let dispatcher;
          if (message.content.indexOf("plantao") >= 0)
            dispatcher = connection.playFile(
              path.resolve("./songs/vitasplantao.mp3")
            );
          else if (message.content.indexOf("acapela") >= 0)
            dispatcher = connection.playFile(
              path.resolve("./songs/vitascapela.mp3")
            );
          else
            dispatcher = connection.playFile(
              path.resolve("./songs/vitasmusic.mp3")
            );

          dispatcher.on("end", () => {
            // The song has finished
            voiceChannel.leave();
          });

          dispatcher.on("error", e => {
            // Catch any errors that may arise
            console.log(e);
          });

          dispatcher.setVolume(0.7); // Set the volume back to 100%
        })
        .catch(console.log);
    } else {
      message.reply("You need to join a voice channel first!");
    }
  }
});

client.login(auth.token);
