import express from 'express';
import { createServer } from 'node:http';
import cors from 'cors';
import { Server } from 'socket.io';
import { nanoid } from 'nanoid'
import {filterUsersInRoom, joinRoom} from "./services/room.js";
import OpenAI from "openai";

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

app.use(cors({
    origin: "*"
}), express.json());

let rooms = [];
const publicRooms = [];
let publicUsers = [];

const DEFAULT_POINT_WIN = 1;
const SPEED_POINT_WIN = 2;

const questions = [
    {
        id: 1,
        question: 'Quel est le fleuve qui traverse Paris ?',
        answerPropositions: ['La Seine', 'Le Rhône', 'La Loire', 'Le Danube'],
        answer: 'La Seine',
        explication: 'La Seine est le fleuve emblématique qui traverse la ville de Paris, contribuant grandement à sa beauté et à son charme.',
        displayed: true,
    },
    {
        id: 2,
        question: 'Quelle est la capitale de la France ?',
        answerPropositions: ['Londres', 'Rome', 'Berlin', 'Paris'],
        answer: 'Paris',
        explication: 'Paris est la capitale de la France, célèbre pour ses monuments emblématiques, sa culture riche et son histoire fascinante.',
        displayed: false,
    },
    {
        id: 3,
        question: 'Où se trouve la célèbre tour Eiffel ?',
        answerPropositions: ['Londres', 'Rome', 'Berlin', 'Paris'],
        answer: 'Paris',
        explication: 'La tour Eiffel est située à Paris, en France, et est l\'un des symboles les plus reconnaissables du pays.',
        displayed: false,
    },
]


io.on('connection', (socket) => {

    io.emit('public-rooms', publicRooms);

    socket.on('join-room', (data) => {
        joinRoom(rooms, data, socket, io);
    });

    socket.on('join-public-room', (data) => {
        joinRoom(publicRooms, data, socket, io);
    });

    socket.on('create-room', (data) => {

        let roomId = nanoid(4);

        if(data.type === 'public')
        {
            roomId = 'public-' + nanoid(4);
        }

        //Create object room then push it with all the others room
        const roomObject = {
            roomType: data.type,
            difficulty: data.difficulty,
            roundNumber: data.roundNumber,
            questionNumber: data.questionNumber,
            category: data.category,
            roomId: roomId,
            partyEnded: false,
            users: [{
                id: data.socketId,
                username: data.username,
                score: 0,
            }],
            questions: questions,
        }

        if(data.type === 'public')
        {
            publicRooms.push(roomObject);
        } else {
            rooms.push(roomObject);
        }

        //Subscribe room and users to a channel and emit event to this channel
        socket.join(roomObject.roomId);
        socket.join(data.socketId);
        io.to(roomObject.roomId).emit('room-created', true);
        io.to(roomObject.roomId).emit('get-room-id', roomObject.roomId);
        io.to(roomObject.roomId).emit('get-users', roomObject.users);
        io.emit('public-rooms', publicRooms);
    });

    socket.on('begin-party', (roomId) => {
        socket.join(roomId);
        io.to(roomId).emit('room-joined', true);

        rooms.some(room => {
            if(roomId === room.roomId)
            {
                io.to(roomId).emit('get-room', room);
                io.to(roomId).emit('get-room-question', room.questions);
                return true;
            }
            return false;
        });
    });

    socket.on('join-created-room', (data) => {
        socket.join(data);
        io.to(data).emit('room-joined', true);
    });

    //Check if user's response is correct
    socket.on('send-response', (data) => {
        data.room.questions.some(question => {
            if(question.id === data.questions.id)
            {
                if(data.response === question.answer)
                {
                    io.to(data.room.roomId).emit('send-answer', {correct: true, explication: question.explication});
                    console.log(data.user);
                    console.log(data.room.users);
                    data.room.users.forEach(user => {
                        if (user.id === data.user)
                        {
                            user.score += DEFAULT_POINT_WIN;
                        }
                    });
                    io.to(data.room.roomId).emit('get-users', data.room.users);
                } else {
                    io.to(data.room.roomId).emit('send-answer', {correct: false, explication: question.explication});
                }
                question.displayed = false;

                if( question.id < data.room.questionNumber)
                {
                    const nextQuestionId = question.id + 1;


                    data.room.questions.some(q => {
                        if(nextQuestionId === q.id) {
                            q.displayed = true;
                            return true;
                        }
                        return false;
                    });
                } else {
                    data.room.partyEnded = true;
                }

                io.to(data.room.roomId).emit('send-next-question', data.room);

                return true;
            }
            return false;
        });
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