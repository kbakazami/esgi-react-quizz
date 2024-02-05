export default function JoinRoom() {

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