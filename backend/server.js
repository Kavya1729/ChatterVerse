const express = require('express');
const { chats } = require('./data/data');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const colors = require('colors');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');


const {notfound,errorHandler} = require('./middleware/errorMiddleware');
const path = require('path');
 


dotenv.config();
connectDB();

const app = express();

app.use(express.json());



app.use('/api/user',userRoutes);
app.use('/api/chat',chatRoutes);
app.use('/api/message',messageRoutes);

const __dirname1 = path.resolve();
if(process.env.NODE_ENV === 'production'){
  app.use(express.static(path.join(__dirname1,'/frontend/build')));

  app.get('*',(req,res)=>{
    res.sendFile(path.resolve(__dirname1,'frontend','build','index.html'));
  })
}
else{
  app.get("/", (req, res) => {
    res.send("API is running...");
  });
}

const PORT = process.env.PORT || 5001;

app.use(notfound);
app.use(errorHandler);


const server = app.listen(PORT,console.log(`Server running on port ${PORT}`.blue.bold));

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "https://lets-chat-1-rp50.onrender.com",
  },
});

io.on("connection", (socket) => {
  // console.log("Connected to socket.io");

  socket.on('setup',(userData)=>{
    socket.join(userData._id);
    socket.emit('connected');
  })

  socket.on('join chat',(room)=>{
    socket.join(room);
    console.log("User joined room"+ room);
  })

  socket.on('typing',(room)=>{
    socket.in(room).emit('typing');
  })
  socket.on('stop typing',(room)=>{
    socket.in(room).emit('stop typing');
  })

  socket.on('new message',(newMessageRecieved)=>{
    var chat = newMessageRecieved.chat;

    if(!chat.users) return console.log("Chat.users not defined");

    chat.users.forEach((user)=>{
        if(user._id === newMessageRecieved.sender._id) return;

        socket.in(user._id).emit('message recieved',newMessageRecieved);
    })
  })

  socket.off("setup", () => {
    // console.log("Disconnedtec");
    socket.leave(userData._id);
  });
});