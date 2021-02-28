const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const cors = require('cors');
const io = require('socket.io')(server);

const PORT = process.env.PORT || 5000;
ORIGINI_ALLOWED = ['http://localhost:3000',]

var sessions = {}

app.use(cors({
    origin: ORIGINI_ALLOWED
  }));

const videoRoom = io.of('/video')
io.on("connection", (socket)=>{
    console.log("a user has connected");
    socket.emit("welcome message", "you have joined successufully")
})


//code for the video call
videoRoom.on('connection',(socket)=>{
    console.log('a user is connected to the video channel')
    socket.on('join',(sessionDesc, callback)=>{
        try{
        socket.join(sessionDesc.sessionID);
        if (!sessions[sessionDesc.sessionID]){
        sessions[sessionDesc.sessionID] = {inCall : 0}}
        //socket.broadcast.to(user.room).emit('message',{user : 'admin', text: `the user : ${user.name} has joined this room`})
        //socket.emit('message', {user : 'admin',text:`you have joined the room ${user.room} successfully`})
        callback('success')
    }
        catch(e){
        }
    });
    
    socket.on('offer', (sessionDesc , offer , callback)=>{
        console.log(sessionDesc)
        console.log(`server has received a video offer`)
        socket.to(sessionDesc.sessionID).emit('signalOffer', offer);

        callback();
    })
    socket.on('answer', (sessionDesc , answer, callback)=>{
        console.log(`user : sent an answer`);
        console.log(`server has received a video answer`)
        socket.to(sessionDesc.sessionID).emit('signalAnswer', answer);

        callback();
    })
    socket.on('new-ice-candidate',(sessionDesc , candidate, callback)=>{
        console.log(`ice condidate`)
        socket.to(sessionDesc.sessionID).emit('iceCandidate', candidate);

        callback();

    })

    socket.on('join-call', (sessionDesc , callback)=>{
        if(sessions[sessionDesc.sessionID].inCall===0){
        sessions[sessionDesc.sessionID].inCall = 1;
        callback('wait')
    }
        else{
            sessions[sessionDesc.sessionID].inCall = 2;
            callback('call')
        }
    })

    socket.on('disconnect', () => {
        console.log('user disconnected')
      })
});


//code for the chat room 
/*
const Chat = io.of('/chat');

io.on("connection", (socket)=>{
    console.log("a user has connected");
    socket.emit("welcome message", "you have joined successufully")
})
Chat.on('connection',(socket)=>{
    console.log('a user is connected to the Chat channel')
    socket.on('join',({room,name}, callback)=>{
        const { error, user } = addUser({ id: socket.id, name, room });
        if(error) return callback(error);
        socket.join(user.room)
        socket.broadcast.to(user.room).emit('message',{user : 'admin', text: `the user : ${user.name} has joined this room`})
        socket.emit('message', {user : 'admin',text:`you have joined the room ${user.room} successfully`})
        callback();
    });
    socket.on('send message',(message, callback) => {
        const user = getUser(socket.id);
        console.log(`user : ${user}`)
        Chat.to(user.room).emit('message', {user : user.name , text : message});

        callback();
    })
    socket.on('disconnect', () => {
        const user = removeUser(socket.id);
        if(user) {
          io.to(user.room).emit('message', { user: 'Admin', text: `${user.name} has left.` });
          videoRoom.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)});
        }
      })
});
*/
//fin du code de chat

app.get('/',(req,res)=>{
    res.send('Hello world');
})
server.listen(PORT , ()=>{
    console.log(`The server is up and running ${PORT}`)
})


