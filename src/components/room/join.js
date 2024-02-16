"use client";
import { useForm } from "react-hook-form"
import ErrorMessage from "@/components/error-message";
import {useEffect} from "react";

export default function JoinRoom({socket, session, status}) {
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


    return (
        <div>
            <h1>Rejoindre une salle privée</h1>
            <form onSubmit={handleSubmit(onSubmit)} className={"flex flex-col gap-y-8 mt-16"}>
                <div className={"flex flex-col"}>
                    <input {...register('username', { required: true })} type={'text'} placeholder={'Nom d\'utilisateur'} className={'mx-auto'}/>
                    {errors.username && <ErrorMessage margin={"mx-auto mt-4"}>Veuillez ajouter un nom d'utilisateur</ErrorMessage>}
                </div>

                <input {...register('roomId')} type={'text'} placeholder={'Exemple : ABC123'} className={'mx-auto'}/>
                <button type={'submit'} className={'btn primary w-1/6 mx-auto'}>Rejoindre</button>
            </form>
        </div>
    )
}