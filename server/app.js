import express from 'express';
import { createServer } from 'node:http';
import cors from 'cors';
import { Server } from 'socket.io';
import { nanoid } from 'nanoid'
import {filterUsersInRoom} from "./services/room.js";

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

let rooms = [];
let publicUsers = [];

io.on('connection', (socket) => {

    socket.on('join-room', (data) => {

        //If the submitted id is the same id of the first room found then add the user and let him join the channel & send event
        rooms.some(room => {
            if(data.roomId === room.roomId)
            {
                room.users.push({
                    id: socket.id,
                    username: data.username,
                });

                socket.join(room.roomId);
                io.to(room.roomId).emit('room-joined', true);
                io.to(room.roomId).emit('get-users', room.users);
                return true;
            }
            return false;
        })
    });

    //WIP
    socket.on('join-public-room', (data) => {
        publicUsers.push({
            id: socket.id,
            username: data.username,
        });

        socket.join('public-room');
        io.to('public-room').emit('room-joined', true);
        io.to('public-room').emit('get-users', publicUsers);
    });

    socket.on('create-room', (data) => {

        //Create object room then push it with all the others room
        const roomObject = {
            roomType: data.type,
            difficulty: data.difficulty,
            roundNumber: data.roundNumber,
            questionNumber: data.questionNumber,
            category: data.category,
            roomId: nanoid(4),
            users: [{
                id: data.socketId,
                username: data.username,
            }],
        }

        rooms.push(roomObject);

        //Subscribe room and users to a channel and emit event to this channel
        socket.join(roomObject.roomId);
        io.to(roomObject.roomId).emit('room-created', true);
        io.to(roomObject.roomId).emit('get-room-id', roomObject.roomId);
        io.to(roomObject.roomId).emit('get-users', roomObject.users);
        io.to(roomObject.roomId).emit('get-room', roomObject);
    });

    socket.on('join-created-room', (data) => {
        socket.join(data);
        io.to(data).emit('room-joined', true);
    });


    //Remove users in room when disconnecting
    socket.on('disconnect', () => {
        filterUsersInRoom(rooms, socket, io);
    });

    //Disconnect user when leaving + remove from room
    socket.on('leave', () => {
        filterUsersInRoom(rooms, socket, io);
        socket.disconnect();
    });
});


server.listen(3001, () => {
    console.log('server running');
});