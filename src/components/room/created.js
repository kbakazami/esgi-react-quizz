import {useEffect, useState} from "react";
import UsersList from "@/components/room/informations/users-list";

export default function CreatedRoom({socket, users, waiting}) {

    const [isPublicRoom, setIsPublicRoom] = useState(false);
    const [roomId, setRoomId] = useState('');

    useEffect(() => {
        socket.on('get-room-id', (data) => {
            setRoomId(data);

            if(data.toString().includes('public'))
            {
                setIsPublicRoom(true);
            }
        });
    }, []);

    return (
        <div>
            {
                waiting ?
                    <h1 className={"mb-10"}>En attente du lancement de la partie</h1>
                    :
                    <h1 className={"mb-10"}>
                        {
                            !isPublicRoom ? `Votre code pour rejoindre la salle : ${roomId}` : 'Votre salle a été créée, vous pouvez rejoindre la salle !'
                        }
                    </h1>
            }

            <UsersList users={users} partyEnded={false} waiting={true} socket={socket}/>

            {
                !waiting &&

                <button type={'submit'}
                        className={'btn primary w-1/6 mx-auto flex justify-center mt-8'}
                        onClick={() => socket.emit('begin-party', roomId)}>
                    Rejoindre
                </button>
            }

            <button className={`btn primary flex mx-auto mt-8`} onClick={() => socket.emit('leave')}>Quitter la partie</button>

        </div>
    )
}