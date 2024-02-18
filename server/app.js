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

const DEFAULT_POINT_WIN = 1000;
const DEFAULT_TIMER_QUESTION = 20;
let timer = 5;

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




const toto = [
    {
        roundId: 1,
        questions: [
            {
                id: 1,
                question: 'Quel est le fleuve qui traverse Paris ?',
                answerPropositions: ['La Seine', 'Le Rhône', 'La Loire', 'Le Danube'],
                answer: 'La Seine',
                explication: 'La Seine est le fleuve emblématique qui traverse la ville de Paris, contribuant grandement à sa beauté et à son charme.',
            },
            {
                id: 2,
                question: 'Quelle est la capitale de la France ?',
                answerPropositions: ['Londres', 'Rome', 'Berlin', 'Paris'],
                answer: 'Paris',
                explication: 'Paris est la capitale de la France, célèbre pour ses monuments emblématiques, sa culture riche et son histoire fascinante.',
            },
            {
                id: 3,
                question: 'Où se trouve la célèbre tour Eiffel ?',
                answerPropositions: ['Londres', 'Rome', 'Berlin', 'Paris'],
                answer: 'Paris',
                explication: 'La tour Eiffel est située à Paris, en France, et est l\'un des symboles les plus reconnaissables du pays.',
            },
        ]
    },
    {
        roundId: 2,
        questions: [
            {
                id: 1,
                question: 'Qui est toto',
                answerPropositions: ['Toto', 'Tata', 'Lolo', 'Lala'],
                answer: 'Toto',
                explication: 'Toto',
            },
            {
                id: 2,
                question: 'Qui est tata',
                answerPropositions: ['Toto', 'Tata', 'Lolo', 'Lala'],
                answer: 'Tata',
                explication: 'Tata',
            },
            {
                id: 3,
                question: 'Qui est lolo',
                answerPropositions: ['Toto', 'Tata', 'Lolo', 'Lala'],
                answer: 'Lolo',
                explication: 'Lolo',
            },
        ]
    }
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
                type: 'host',
            }],
            questions: toto,
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
                io.to(roomId).emit('get-room-question', room.questions[0]);
                return true;
            }
            return false;
        });

        setTimeout(() => {
            startTimer(roomId);
        }, 2000);
    });

    socket.on('join-created-room', (data) => {
        socket.join(data);
        io.to(data).emit('room-joined', true);
    });

    //Check if user's response is correct
    socket.on('send-response', (data) => {

        const actualRoom = data.room;
        const actualRound = data.roundId;
        const actualQuestion = data.question;
        let isAnswerCorrect = false;

        actualRoom.questions.some(round => {
            if(round.roundId === actualRound)
            {
                round.questions.some(question => {
                    if(question.id === actualQuestion.id)
                    {
                        if(data.response === question.answer)
                        {
                            isAnswerCorrect = true;
                            return true;
                        }
                    }
                    return false;
                });
                return true;
            }
            return false;
        });

        //In how much second the user responded
        const responseInSec = (DEFAULT_TIMER_QUESTION - timer);

        //Give the maximum point if the user responded before 1 sec
        let score = DEFAULT_POINT_WIN;

        //Else count the points he will get
        if(responseInSec > 0.5)
        {
            const secDividedByTimer = responseInSec / DEFAULT_TIMER_QUESTION

            const responseInSecDividedBy2 = secDividedByTimer / 2;

            const susbtractOne = 1 - responseInSecDividedBy2;

            const multiply = susbtractOne * DEFAULT_POINT_WIN;

            score = Math.ceil(multiply);
        }

        if(isAnswerCorrect)
        {
            rooms.some(room => {
                if(room.roomId === actualRoom.roomId)
                {
                    room.users.some(user => {
                        if(user.id === data.user)
                        {
                            user.score += score;
                            io.to(actualRoom.roomId).emit('get-users', room.users);
                        }
                    })
                }
            })
        }
        io.to(data.user).emit('send-answer', {correct: isAnswerCorrect, explication: actualQuestion.explication});
    });

    socket.on('get-next-question', (data) => {
        const actualRoom = data.room;
        const actualQuestionId = data.actualQuestionId;
        const nextQuestionId = actualQuestionId + 1;
        const actualRoundId = data.actualRoundId;
        const nextRoundId = actualRoundId + 1;
        console.log('actualRound', actualRoundId);

        actualRoom.questions.some(round => {
            if(actualRoundId <= actualRoom.roundNumber)
            {
                if(round.roundId === actualRoundId)
                {
                    round.questions.some(question => {
                        //If the id of displayed question is under the number of question choosen at the beggining search for the next question
                        if(actualQuestionId < actualRoom.questionNumber)
                        {
                            //If the next id of the question wanted match a question in the room with the same id is sended to the client
                            //Else it means  the party is over
                            if(nextQuestionId === question.id)
                            {
                                io.to(actualRoom.roomId).emit('send-next-question', {question: question, roundId: round.roundId});
                                io.to(actualRoom.roomId).emit('reset-explication');
                                setTimeout(() => {
                                    startTimer(actualRoom.roomId);
                                }, 2000);
                                return true;
                            }
                        }  else {
                            //WIP
                            // actualRoom.questions.some(round => {
                            //     if(round.roundId === nextRoundId)
                            //     {
                            //         io.to(actualRoom.roomId).emit('send-next-question', {question: round.questions[0], roundId: round.roundId});
                            //         io.to(actualRoom.roomId).emit('reset-explication');
                            //         setTimeout(() => {
                            //             startTimer(actualRoom.roomId);
                            //         }, 2000);
                            //         return true;
                            //     }
                            //     return false;
                            // });
                            return false;
                        }
                    });
                }
            } else {
                actualRoom.partyEnded = true;
                io.to(actualRoom.roomId).emit('get-room', actualRoom);
                return false;
            }
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

function startTimer(roomId) {
    // let timeLeft = timer;

    const questionInterval = setInterval(() => {
        timer--;
        io.to(roomId).emit('question-time-left', timer);

        if(timer === 0)
        {
            clearInterval(questionInterval);
            timer = 5;
        }
    }, 1000);
}


server.listen(3001, () => {
    console.log('server running');
});