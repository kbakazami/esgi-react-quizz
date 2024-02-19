"use client";
import { useForm } from "react-hook-form"
import ErrorMessage from "@/components/error-message";
import {useEffect, useState} from "react";
import {data} from "autoprefixer";

export default function JoinRoom({socket, session, status}) {

    const [exist, setExist] = useState(false);
    const [username, setUsername] = useState('');
    const [roomId, setRoomId] = useState('');

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm();

    const onSubmit = (data) => {
        socket.emit('join-room', data);
    }

    useEffect(() => {
        if(status === 'authenticated') {
            setValue('username', session?.user?.name);
        }
    }, [status]);


    useEffect(() => {
        socket.on('username-already-taken', (data) => {
            setExist(data);
        });
    }, []);

    useEffect(() => {
        socket.emit('check-username-exist', {username: username, roomId: roomId});
    }, [username, roomId]);

    return (
        <div>
            <h1>Rejoindre une salle privée</h1>
            <form onSubmit={handleSubmit(onSubmit)} className={"flex flex-col gap-y-8 mt-16"}>
                <div className={"flex flex-col"}>
                    <input {...register('username', { required: true })} type={'text'} onChange={(e) => setUsername(e.target.value)} placeholder={'Nom d\'utilisateur'} className={'mx-auto'}/>
                    {errors.username && <ErrorMessage margin={"mx-auto mt-4"}>Veuillez ajouter un nom d'utilisateur</ErrorMessage>}
                    {exist && <ErrorMessage margin={"mx-auto mt-4"}>Ce nom d'utilisateur a déjà été pris</ErrorMessage>}
                </div>

                <input {...register('roomId')} type={'text'} onChange={(e) => setRoomId(e.target.value)} placeholder={'Exemple : ABC123'} className={'mx-auto'}/>
                {!exist && <button type={'submit'} className={'btn primary w-1/6 mx-auto'}>Rejoindre</button>}
            </form>
        </div>
    )
}