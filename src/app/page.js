"use client";
import {useEffect, useState} from "react";
import {io} from "socket.io-client";
import CreateRoom from "@/components/room/create";
import JoinRoom from "@/components/room/join";
import RoomParty from "@/components/room/party";
import CreatedRoom from "@/components/room/created";

const socket = io('http://localhost:3001');

export default function Home() {
    const [createOrJoin, setCreateOrJoin] = useState('join');
    const [roomJoined, setRoomJoined] = useState(false);
    const [roomCreated, setRoomCreated] = useState(false);
    const [roomId, setRoomId] = useState(false);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        socket.on('connect', () => {
            console.log('client connected - id', socket.id);
        });

        socket.on('room-joined', (value) => {
            setRoomJoined(value);
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

        socket.on('disconnect', () => {
            setCreateOrJoin('join');
            setRoomJoined(false);
        });

        // return () => {
        //     socket.disconnect();
        // };
    }, []);

    return (
        <div>
            <h1>TP Quiz - React - Socket.io</h1>
            { !roomJoined && !roomCreated &&
                (
                    <div className={"flex flex-col items-center justify-center mt-4"}>
                        <div className={"flex flex-row items-center justify-center gap-x-24"}>
                            <button className={"btn primary"} onClick={() => setCreateOrJoin('join')}>
                                Rejoindre une salle
                            </button>
                            <button className={"btn primary"} onClick={() => setCreateOrJoin('create')}>
                                Créer une salle
                            </button>
                        </div>
                    </div>
                )
            }

            {
                !roomJoined && !roomCreated && createOrJoin === 'create' && <CreateRoom socket={socket}/>
            }
            {
                !roomJoined && roomCreated && createOrJoin === 'create' && <CreatedRoom socket={socket} roomId={roomId}/>
            }
            {
                !roomJoined && createOrJoin === 'join' && <JoinRoom socket={socket}/>
            }
            {
                roomJoined && <RoomParty socket={socket} users={users}/>
            }
        </div>
    )
}