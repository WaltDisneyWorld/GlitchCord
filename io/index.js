const { saveMessage } = require("../io/utils");


module.exports = (io)=>{
      
        io.on("connection", (socket)=>{
         console.log("New User Connected");


        socket.on("join", (params, callback)=>{
            socket.join(params.channelID);
            callback();
        });

        socket.on("createdMessage", (data, callback)=>{
            saveMessage(io, data);
            callback();
        });

        socket.on("disconnect", ()=>{
             console.log("Diconected");
        });
    });
const commands = {
  shrug = () => sendMessage("¯\\_(ツ)_/¯"),
  help => () => renderMessage("System", "/shrug - Send a shrug ascii text.")
};

function sendMessage (message)
{
  if (message.startsWith("/"))
  {
    const args = message.substring(1, message.length).trim().split(/\s/g);
    const command = args.shift().toLowerCase();
    if (!command) return renderError("Missing command input!");
    if (!commands[command]) return renderError("Invalid command!");
    commands[command](args);
  } else
  {
    socket.emit("message", message);
  }
}
[  
};