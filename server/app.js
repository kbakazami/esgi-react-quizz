import express from 'express';
import { createServer } from 'node:http';
import cors from 'cors';
import { Server } from 'socket.io';
import createRoom from "./services/room.js";


const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

app.use(cors({
    origin: "*"
}));

io.on('connection', (socket) => {
    socket.on('create-room', (data) => {
        createRoom(data);
    })
})


server.listen(3001, () => {
    console.log('server running');
})