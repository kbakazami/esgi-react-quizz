import CustomRadioWrapper from "@/components/custom-radio-wrapper";
import CustomRadio from "@/components/custom-radio";

export default function CreateRoom() {
    const roomType = [
        {id: 'private', value: 'Privée', name: 'type'},
        {id: 'public', value: 'Publique', name: 'type'},
    ];

    const difficulties = [
        {id: 'easy', value: 'Facile', name: 'difficulty'},
        {id: 'medium', value: 'Moyen', name: 'difficulty'},
        {id: 'hard', value: 'Difficile', name: 'difficulty'}
    ];

    const categories = [];

    for (let i = 0; i <= 20; i++) {
        categories.push({id: `category-${i}`, value: 'Lorem Ipsum', name: 'category'})
    }

    return (
        <div>
            <h1>Création d'une salle</h1>
            <div className={"flex flex-col mt-10"}>
                <div className={"flex flex-row"}>
                    <div className={"flex flex-col gap-y-6 w-1/2 justify-center"}>
                        <div className={"flex flex-row items-center gap-x-10"}>
                            <p className={"w-52 text-xl"}>Type de salle</p>
                            <div className={"flex flex-row gap-x-6"}>
                                <CustomRadioWrapper classUl={'room-type'} data={roomType}/>
                            </div>
                        </div>
                        <div className={"flex flex-row items-center gap-x-10"}>
                            <p className={"w-52 text-xl"}>Difficulté du quizz</p>
                            <CustomRadioWrapper classUl={'difficulty'} data={difficulties}/>
                        </div>
                    </div>
                    <div className={"flex flex-col gap-y-6 w-1/2"}>
                        <div className={"flex flex-row items-center gap-x-10"}>
                            <p className={"w-52 text-xl"}>Type de salle</p>
                            <input type={"number"} placeholder={"Exemple : 1"} min={1}/>
                        </div>
                        <div className={"flex flex-row items-center gap-x-10"}>
                            <p className={"w-52 text-xl"}>Nombre de question</p>
                            <input type={"number"} placeholder={"Exemple : 12"} min={1}/>
                        </div>
                    </div>
                </div>
                <div className={"flex flex-col items-center gap-y-5 mt-14"}>
                    <p className={"text-xl"}>Choix de la catégorie</p>
                    <ul className={"category"}>
                        <CustomRadio id={'random'} value={"Aléatoire"} name={"category"} classLi={'category'}/>
                    </ul>
                    <CustomRadioWrapper classUl={'category grid grid-cols-10 gap-y-4 justify-center'} data={categories} classLi={'category'}/>
                </div>
                <button className={"btn primary w-1/6 mt-8 mx-auto"}>Créer</button>
            </div>
        </div>
    )
}