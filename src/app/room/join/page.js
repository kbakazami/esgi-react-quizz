"use client";
import {useEffect, useState} from "react";
import { io as ClientIO } from "socket.io-client";

export default function JoinRoom() {

    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const socketInstance = new ClientIO({
            path: '/api/socket/io',
            addTrailingSlash: false,
        }, process.env.NEXT_PUBLIC_SITE_URL);

        socketInstance.on('connect', () => {
            setIsConnected(true);
            console.log('client connected');
        });

        socketInstance.on('disconnect', () => {
            setIsConnected(false);
            console.log('client disconnected');
        });

        setSocket(socketInstance);

        return () => {
            socketInstance.disconnect();
        };
    },[]);

    return (
        <div>
            <h1>Rejoindre une salle</h1>
            <form className={"flex flex-col gap-y-8 mt-16"}>
                <input type={'text'} placeholder={'Exemple : ABC123'} className={'mx-auto'}/>
                <button type={'submit'} className={'btn primary w-1/6 mx-auto'}>Rejoindre</button>
            </form>
        </div>
    )
}