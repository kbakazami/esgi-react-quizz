"use client";
import {useEffect, useState} from "react";
import {io} from "socket.io-client";
import CreateRoom from "@/components/room/create";
import JoinRoom from "@/components/room/join";
import RoomParty from "@/components/room/party";
import CreatedRoom from "@/components/room/created";
import {useSession} from "next-auth/react";
import JoinPublicRoom from "@/components/room/join-public";

const socket = io('http://localhost:3001');

export default function Home() {
    const [createOrJoin, setCreateOrJoin] = useState('join-public');
    const [roomJoined, setRoomJoined] = useState(false);
    const [roomCreated, setRoomCreated] = useState(false);
    const [roomId, setRoomId] = useState(false);
    const [users, setUsers] = useState([]);
    const [roomInformations, setRoomInformations] = useState({});
    const [questionInformations, setQuestionInformation] = useState({});
    const [roomQuestion, setRoomQuestion] = useState({});
    const [roomRoundId, setRoomRoundId] = useState('');
    const [publicRooms, setPublicRooms] = useState([]);
    const [socketId, setSocketId] = useState('');
    const [questionTimeLeft, setQuestionTimeLeft] = useState(20);

    const {data: session, status} = useSession();

    useEffect(() => {
        socket.on('connect', () => {
            console.log('client connected - id', socket.id);
            setSocketId(socket.id);
        });

        socket.on('room-joined', (value) => {
            setRoomJoined(value);
        });

        socket.on('room-joined-waiting', (value) => {
            if(value)
            {
                setCreateOrJoin('waiting');
            }
        });

        socket.on('room-created', (data) => {
            setRoomCreated(data);
        });

        socket.on('get-room-id', (data) => {
            setRoomId(data);
        });

        socket.on('get-users', (data) => {
            setUsers(data);
        });

        socket.on('get-room', (data) => {
            setRoomInformations(data);
        });

        socket.on('public-rooms', (data) => {
            setPublicRooms(data);
        });

        socket.on('get-room-question', (data) => {
            setRoomQuestion(data.questions[0]);
            setRoomRoundId(data.roundId);
        });

        socket.on('question-time-left', (timeLeft) => {
            setQuestionTimeLeft(timeLeft);
        });

        socket.on('send-next-question', (data) => {
            //TODO : Make timer for question

            console.log('next question sended');
            console.log(data.question);
            // console.log('time left -- ', questionTimeLeft);
            // if(questionTimeLeft === 0)
            // {
                // setTimeout(() => {
                // console.log('get-room question data -- ', data);
                // console.log('time left -- ', questionTimeLeft);
                    setRoomQuestion(data.question);
                    setRoomRoundId(data.roundId);
                    setQuestionTimeLeft(20);
                // }, 2000);
            // }
        });

        socket.on('send-answer', (data) => {
            setQuestionInformation(data);
        });

        socket.on('disconnect', () => {
            window.location.reload();
        });

        // return () => {
        //     socket.disconnect();
        // };
    }, []);

    return (
        <div>
            <h1>TP Quiz - React - Socket.io</h1>
            <p>Socket - {socketId}</p>
            { !roomJoined && !roomCreated &&
                (
                    <div className={"flex flex-col items-center justify-center mt-4"}>
                        <div className={"flex flex-row items-center justify-center gap-x-24"}>
                            <button className={"btn primary"} onClick={() => setCreateOrJoin('join-public')}>
                                Rejoindre une salle publique
                            </button>
                            <button className={"btn primary"} onClick={() => setCreateOrJoin('join')}>
                                Rejoindre une salle privée
                            </button>
                            <button className={"btn primary"} onClick={() => setCreateOrJoin('create')}>
                                Créer une salle
                            </button>
                        </div>
                    </div>
                )
            }

            {
                !roomJoined && !roomCreated && createOrJoin === 'create' && <CreateRoom socket={socket} session={session} status={status}/>
            }
            {
                !roomJoined && roomCreated && createOrJoin === 'create' && <CreatedRoom socket={socket} roomId={roomId} users={users} waiting={false}/>
            }
            {
                !roomJoined && createOrJoin === 'waiting' && <CreatedRoom socket={socket} roomId={roomId} users={users} waiting={true}/>
            }
            {
                !roomJoined && createOrJoin === 'join' && <JoinRoom socket={socket} session={session} status={status}/>
            }
            {
                !roomJoined && createOrJoin === 'join-public' && <JoinPublicRoom socket={socket} rooms={publicRooms} session={session} status={status}/>
            }
            {
                roomJoined && <RoomParty socket={socket} users={users} roomInformations={roomInformations} questionInformations={questionInformations} roomQuestion={roomQuestion} roundId={roomRoundId} timeLeft={questionTimeLeft}/>
            }
        </div>
    )
}