"use client"
import Image from 'next/image'
import Link from "next/link";
import {useEffect, useState} from "react";
import CreateRoom from "@/components/room/create";
import JoinRoom from "@/components/room/join";
import {useRouter} from "next/navigation";
import {io} from "socket.io-client";

export default function Home() {

    const [createOrJoin, setCreateOrJoin] = useState('join');
    const [isConnected, setIsConnected] = useState(false);
    const [room, setRoom] = useState(false);
    //
    const socket = io('http://localhost:3001');
    //
    useEffect(() => {
        socket.on('connect', () => {
            console.log('connected, socket id', socket.id );
        });
    },[]);

    return (
        <>
            <h1>TP Quiz - React - Socket.io</h1>
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
            {
                createOrJoin === 'create' && <CreateRoom socket={socket}/>
            }
            {
                createOrJoin === 'join' && <JoinRoom socket={socket}/>
            }
        </>

    )
}
