const express = require('express');
const colors = require('colors')
const app = express();
const path = require('path');
const { readFileSync, writeFileSync} = require('fs');
const {createServer} = require('http')
const {Server} = require('socket.io');



const httpServer = createServer(app);

const io = new Server(httpServer);

io.on('connection',(socket)=>{
    const latestCaht = JSON.parse(readFileSync(path.join(__dirname,'db.json')).toString());
    io.sockets.emit('allChat',latestCaht)
    //console.log(oldChat); 
    socket.on('chat',({name,photo,message})=>{
        const oldChat = JSON.parse(readFileSync(path.join(__dirname,'db.json')).toString());

        oldChat.push({name,photo,message});
        writeFileSync(path.join(__dirname,'db.json'),JSON.stringify(oldChat));
        const latestCaht = JSON.parse(readFileSync(path.join(__dirname,'db.json')).toString());
        io.sockets.emit('allChat',latestCaht)
        //console.log(oldChat); 
    })
   

   




}) 


app.use(express.static(path.join(__dirname,'')))


app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'client.html'))
})


httpServer.listen(5000,()=>{
    console.log('server is running'.bgBlue);
})