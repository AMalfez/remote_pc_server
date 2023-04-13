const express = require("express");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 8080;
const access = "AM";
const socketIO = require("socket.io");
const http = require("http");
const server = http.createServer(app);

app.use(cors());
const io = socketIO(server);

app.get('/',(req,res)=>{
    res.send('hello world')
})

app.post("/shutdown", (req, res) => {
  // Parse the incoming request body
  const access_code = req.query.access_code;

  req.on("end", () => {
    if (access_code === access) {
      const command = req.query.command;
      // Broadcast the incoming request data to all connected Electron.js clients
      io.emit("remote", command);

      // Send a response to the incoming request
      res.status(200).send("Control message sent");
    } else {
        const command = 'wrong_code';
        // Broadcast the incoming request data to all connected Electron.js clients
        io.emit("remote", command);
  
        // Send a response to the incoming request
        res.status(200).send("wrong code");
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
