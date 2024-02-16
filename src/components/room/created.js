import {useEffect, useState} from "react";

export default function CreatedRoom({roomId, socket}) {

    const [isPublicRoom, setIsPublicRoom] = useState(false);

    useEffect(() => {
        if(roomId.toString().includes('public'))
        {
            setIsPublicRoom(true);
        }
    }, [roomId]);

    return (
        <div>
            {
                !isPublicRoom ? <h1>Votre code pour rejoindre la salle : {roomId}</h1> : <h1>Votre salle a été créée, vous pouvez rejoindre la salle !</h1>
            }
            <button type={'submit'}
                    className={'btn primary w-1/6 mx-auto flex justify-center mt-8'}
                    onClick={() => socket.emit('join-created-room', roomId)}>
                Rejoindre
            </button>
        </div>
    )
}