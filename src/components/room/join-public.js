import {useForm} from "react-hook-form";
import ErrorMessage from "@/components/error-message";
import {useEffect, useState} from "react";

export default function JoinPublicRoom({socket, rooms, session, status}) {

    const [username, setUsername] = useState('');
    const [roomId, setRoomId] = useState('');
    const [exist, setExist] = useState(false);

    function translateDifficulty(param) {
        switch(param) {
            case 'easy':
                return 'Facile';
            case 'medium':
                return 'Moyen';
            case 'hard':
                return 'Difficile';
        }
    }

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm();

    const onSubmit = (data) => {
        socket.emit('join-public-room', data);
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
            <h1>Rejoindre une salle publique</h1>
            {
                rooms.length > 0 ?
                    <form onSubmit={handleSubmit(onSubmit)} className={"flex flex-col gap-y-8 mt-4"}>
                        <div className={"flex flex-col"}>
                            <input {...register('username', { required: true })} type={'text'} placeholder={'Nom d\'utilisateur'} className={'mx-auto'} onChange={(e) => setUsername(e.target.value)}/>
                            {errors.username && <ErrorMessage margin={"mx-auto mt-4"}>Veuillez ajouter un nom d'utilisateur</ErrorMessage>}
                            {exist && <ErrorMessage margin={"mx-auto mt-4"}>Ce nom d'utilisateur a déjà été pris</ErrorMessage>}
                        </div>
                        <ul className={"grid grid-cols-4 gap-8 room"}>
                            {
                                rooms.map(room => {
                                    return (
                                        <li className={"flex flex-col h-32"} key={room.roomId}>

                                            <input {...register('roomId', { required: true })} type={"radio"}
                                                   id={room.roomId}
                                                   className={"btn primary"}
                                                   value={room.roomId} onClick={(e) => setRoomId(e.target.value)}/>

                                            <label htmlFor={room.roomId} className={"flex flex-col"}>
                                                <p>Catégorie : {room.category}</p>
                                                <p>Difficulté : {translateDifficulty(room.difficulty)}</p>
                                                <p>Nombre de round : {room.roundNumber}</p>
                                                <p>Nombre de questions/round : {room.questionNumber}</p>
                                            </label>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                        {errors.room && <ErrorMessage margin={"mx-auto"}>Veuillez choisir une salle</ErrorMessage>}
                        {!exist && <button type={'submit'} className={'btn primary w-1/6 mx-auto'}>Rejoindre</button> }
                    </form>

                    :

                    <h2 className={"text-center mt-4"}>Il n'existe aucune salle publique</h2>
            }
        </div>
    )
}