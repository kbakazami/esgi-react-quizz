export default function CreatedRoom({roomId, socket}) {
    return (
        <div>
            <h1>Votre code pour rejoindre la salle : {roomId}</h1>
            <button type={'submit'}
                    className={'btn primary w-1/6 mx-auto flex justify-center mt-8'}
                    onClick={() => socket.emit('join-created-room', roomId)}>
                Rejoindre
            </button>
        </div>
    )
}