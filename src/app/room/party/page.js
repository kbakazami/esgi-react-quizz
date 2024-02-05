export default function PartyRoom() {
    return (
        <div className={'h-full w-full border border-primary mt-12 rounded-md p-8'}>
            <p className={'underline-offset-8 underline'}>Question n°1</p>
            <h1 className={"mt-40"}>Lorem ipsum dolor sit amet</h1>
            <p className={'text-center mt-10'}>Explication</p>
            <form className={"grid grid-cols-2 gap-x-12 gap-y-6 pt-56"}>
                <button type={'submit'} value={'1'} className={'btn primary'}>Réponse n°1</button>
                <button type={'submit'} value={'2'} className={'btn primary'}>Réponse n°2</button>
                <button type={'submit'} value={'3'} className={'btn primary'}>Réponse n°3</button>
                <button type={'submit'} value={'4'} className={'btn primary'}>Réponse n°4</button>
            </form>
        </div>
    )
}