const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 8080;
const access = "AM";
const socketIO = require("socket.io");
const http = require("http");
const server = http.createServer(app);
const uri =
  "mongodb+srv://AMalfez:AMalfez%402003@cluster0.h28yihv.mongodb.net/remote";
const { userModel } = require("./schema/userSchema");

mongoose.set("strictQuery", false);
mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("connected!");
  });

app.use(cors());
app.use(express.json());
const io = socketIO(server);

app.get("/", (req, res) => {
  res.send("hello world");
});

app.post('/editcode',async(req,res)=>{
  const {username,access_code} = req.body;
  const userExist = await userModel.find({username});
  if(userExist){
    const update = await userModel.findOneAndUpdate({username},{...userExist,access_code})
    res.send(update) ;
  }else{
    res.send('error occured')
  }

})

app.post("/shutdown", (req, res) => {
  // Parse the incoming request body
  const access_code = req.query.access_code;
  const command = req.query.command;
  // req.on("end", () => {
    if (access_code === access) {
      
      // Broadcast the incoming request data to all connected Electron.js clients
      io.emit("remote", command);

      // Send a response to the incoming request
      res.status(200).send("Control message sent");
    } else {
      const command = "wrong_code";
      // Broadcast the incoming request data to all connected Electron.js clients
      io.emit("remote", command);

      // Send a response to the incoming request
      res.status(200).send("wrong code");
    }
  });
// });

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const userExist = await userModel.find({ username, password });
  if (userExist[0]) {
    res.send(userExist);
  } 
  else {
    res.send("user does not exist");
    // throw 'user does not exist';
  }
});

app.post("/signup", async (req, res) => {
  const { username, password, email } = req.body;
  const userExist = await userModel.find({ username });
  if (!userExist[0]) {
    await userModel
      .create({ username, email, password })
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.send(err);
      });
  } 
  else {
    res.send("user already exists");
  // throw 'user already exists'
  }
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
