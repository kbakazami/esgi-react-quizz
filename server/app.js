import express from 'express';
import { createServer } from 'node:http';
import cors from 'cors';
import { Server } from 'socket.io';
import { nanoid } from 'nanoid'
import {filterUsersInRoom, joinRoom, sendNextQuestion} from "./services/room.js";
import {createQuestions} from "./services/openai.js";

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

const DEFAULT_POINT_WIN = 2000;
const DEFAULT_TIMER_QUESTION = 20;
let timer = 20;

io.on('connection', (socket) => {

    io.emit('public-rooms', publicRooms);

    socket.on('check-username-exist', (data) => {
        const room = rooms.find(room => room.roomId === data.roomId);
        if(room)
        {
            const username = room.users.find(user => user.username === data.username);
            if(username)
            {
                io.emit('username-already-taken', true);
            } else {
                io.emit('username-already-taken', false);
            }
        }
    });

    socket.on('join-room', (data) => {
        joinRoom(rooms, data, socket, io);
    });

    socket.on('join-public-room', (data) => {
        joinRoom(publicRooms, data, socket, io);
    });

    socket.on('create-room', async (data) => {

        let roomId = nanoid(4);

        if (data.type === 'public') {
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
                type: 'host',
            }],
            questions: [],
            isPlaying: false,
        }

        const questions = await createQuestions(roomObject);

        //Parse the response because openAI put the json object into a json string + remove all \n or it'll fail
        const parsedQuestions = JSON.parse(questions.replaceAll('\n', '').trim());

        roomObject.questions = parsedQuestions.rounds;

        if (data.type === 'public') {
            //push to publicRooms array to display it on the client side
            publicRooms.push(roomObject);
            rooms.push(roomObject);
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

    //Connect the host to the party and begin the party by sending the first question
    socket.on('begin-party', (roomId) => {

        const room = rooms.find(room => room.roomId === roomId);

        room.isPlaying = true;

        socket.join(roomId);
        io.to(roomId).emit('room-joined', true);
        io.to(roomId).emit('get-room', room);
        io.to(roomId).emit('get-room-question', room.questions[0]);

        setTimeout(() => {
            startTimer(roomId);
        }, 2000);
    });

    //Check if user's response is correct
    socket.on('send-response', (data) => {

        const actualRoom = data.room;
        const actualQuestion = data.question;
        let isAnswerCorrect = false;

        const round = actualRoom.questions.find(round => round.roundId === data.roundId);
        const question = round.questions.find(question => question.id === actualQuestion.id);

        if(round && question && data.response === question.answer)
        {
            isAnswerCorrect = true;
        }

        //In how much second the user responded
        const responseInSec = (DEFAULT_TIMER_QUESTION - timer);

        //Give the maximum point if the user responded before 1 sec
        let score = DEFAULT_POINT_WIN;

        //Else count the points he will get
        if(responseInSec > 1)
        {
            const secDividedByTimer = responseInSec / DEFAULT_TIMER_QUESTION
            const responseInSecDividedBy2 = secDividedByTimer / 2;
            const susbtractOne = 1 - responseInSecDividedBy2;
            const multiply = susbtractOne * DEFAULT_POINT_WIN;
            score = Math.ceil(multiply);
        }

        if(isAnswerCorrect)
        {
            const room = rooms.find(room => room.roomId === actualRoom.roomId);
            const user = room.users.find(user => user.id === data.user);

            if(room && user)
            {
                user.score += score;
                io.to(actualRoom.roomId).emit('get-users', room.users);
            }
        }

        io.to(data.user).emit('send-answer', {correct: isAnswerCorrect, explication: actualQuestion.explication});
    });

    socket.on('get-next-question', (data) => {

        const actualRoom = data.room;
        const nextQuestionId = data.actualQuestionId + 1;
        const actualRoundId = data.actualRoundId;

        io.to(actualRoom.roomId).emit('user-waiting', {value: false, room: actualRoom});

        if(actualRoundId <= actualRoom.roundNumber)
        {
            if(nextQuestionId <= actualRoom.questionNumber)
            {
                const actualRound = actualRoom.questions.find(room => room.roundId === actualRoundId);
                const nextQuestion = actualRound.questions.find(question => question.id === nextQuestionId);

                sendNextQuestion(io, actualRoom.roomId, nextQuestion, actualRound.roundId, startTimer);
            } else {
                const nextRound = actualRoom.questions.find(room => room.roundId === (actualRoundId + 1));

                if(nextRound === undefined)
                {
                    actualRoom.partyEnded = true;
                    io.to(actualRoom.roomId).emit('get-room', actualRoom);
                } else {
                    sendNextQuestion(io, actualRoom.roomId, nextRound.questions[0], nextRound.roundId, startTimer);
                }
            }
        }
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

function startTimer(roomId) {
    const questionInterval = setInterval(() => {
        timer--;
        io.to(roomId).emit('question-time-left', timer);

        if(timer === 0)
        {
            clearInterval(questionInterval);
            timer = 20;
        }
    }, 1000);
}


server.listen(3001, () => {
    console.log('server running');
});
