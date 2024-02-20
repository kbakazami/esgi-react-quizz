"use client";
import { useForm } from "react-hook-form"
import {useEffect, useState} from "react";
import ErrorMessage from "@/components/error-message";

export default function CreateRoom({socket, session, status}) {

    const [waitingRoom, setWaitingRoom] = useState(false);

    const roomType = [
        {id: 'private', value: 'Privée', name: 'type'},
        {id: 'public', value: 'Publique', name: 'type'},
    ];

    const difficulties = [
        {id: 'easy', value: 'Facile', name: 'difficulty'},
        {id: 'medium', value: 'Moyen', name: 'difficulty'},
        {id: 'hard', value: 'Difficile', name: 'difficulty'}
    ];

    const categories= [
        {id: 'Langue', value: 'Langue', name: 'category'},
        {id: 'Cinéma', value: 'Cinéma', name: 'category'},
        {id: 'Jeux vidéos', value: 'Jeux vidéos', name: 'category'},
        {id: 'Culture Nippone', value: 'Culture Nippone', name: 'category'},
        {id: 'Sport', value: 'Sport', name: 'category'},
        {id: 'Voiture', value: 'Voiture', name: 'category'},
        {id: 'Informatique', value: 'Informatique', name: 'category'},
        {id: 'Musique', value: 'Musique', name: 'category'},
        {id: 'Astronomie', value: 'Astronomie', name: 'category'},
        {id: 'Géographie', value: 'Géographie', name: 'category'},
        {id: 'Histoire', value: 'Histoire', name: 'category'},
        {id: 'Célébritées', value: 'Célébritées', name: 'category'},
        {id: 'Santé', value: 'Santé', name: 'category'},
        {id: 'Science', value: 'Science', name: 'category'},
        {id: 'Mythologie grecque', value: 'Mythologie grecque', name: 'category'},
        {id: 'Mythologie égyptienne', value: 'Mythologie égyptienne', name: 'category'},
        {id: 'Football', value: 'Football', name: 'category'},
        {id: 'Animaux', value: 'Animaux', name: 'category'},
        {id: 'Plantes', value: 'Plantes', name: 'category'},
        {id: 'Mathématiques', value: 'Mathématiques', name: 'category'},
    ]

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm()

    const onSubmit = (data) => {
        data.socketId = socket.id;
        const random = Math.floor(Math.random() * categories.length);

        if(data.category === 'random')
        {
            data.category = categories[random].id;
        }

        setWaitingRoom(true);

        socket.emit('create-room', data);
    }

    useEffect(() => {
        if(status === 'authenticated') {
            setValue('username', session?.user?.name);
        }
    }, [status]);

    return (
        <div>
            {
                waitingRoom && <div className={"flex flex-col items-center justify-center gap-x-4 mt-20"}>
                    <h1 className={"italic"}>La salle est en cours de création</h1>
                    <svg version="1.1" id="L5" x="0px" y="0px" viewBox="0 0 100 100" enableBackground="new 0 0 0 0" className={"w-16"}>
                        <circle fill="currentColor" stroke="none" cx="6" cy="50" r="6">
                            <animateTransform attributeName="transform" dur="1s" type="translate" values="0 15 ; 0 -15; 0 15" repeatCount="indefinite" begin="0.1"/>
                        </circle>
                        <circle fill="currentColor" stroke="none" cx="30" cy="50" r="6">
                            <animateTransform attributeName="transform" dur="1s" type="translate" values="0 10 ; 0 -10; 0 10" repeatCount="indefinite" begin="0.2"/>
                        </circle>
                        <circle fill="currentColor" stroke="none" cx="54" cy="50" r="6">
                            <animateTransform attributeName="transform" dur="1s" type="translate" values="0 5 ; 0 -5; 0 5" repeatCount="indefinite" begin="0.3"/>
                        </circle>
                    </svg>
                </div>
            }
            {
                !waitingRoom && <>
                    <h1>Création d'une salle</h1>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className={"flex flex-col mt-10"}>
                            <div className={"flex flex-row mb-8"}>
                                <div className={"flex flex-row items-center gap-x-10"}>
                                    <p className={"w-52 text-xl"}>Nom d'utilisateur</p>
                                    <input {...register("username", { required: true })} type={"text"} placeholder={"Nom d\'utilisateur"}/>
                                    {errors.username && <ErrorMessage>Veuillez ajouter un nom d'utilisateur</ErrorMessage>}
                                </div>
                            </div>
                            <div className={"flex flex-row"}>
                                <div className={"flex flex-col gap-y-6 w-1/2 justify-center"}>
                                    <div className={"flex flex-col"}>
                                        <div className={"flex flex-row items-center gap-x-10"}>
                                            <p className={"w-52 text-xl"}>Type de salle</p>
                                            <div className={"flex flex-row gap-x-6"}>
                                                <ul className={`flex flex-row gap-x-6 room-type`}>
                                                    {
                                                        roomType.map((room) => {
                                                            return (
                                                                <li key={room.id}>
                                                                    <input {...register(room.name, { required: true })} type={"radio"}
                                                                           id={room.id}
                                                                           className={"btn primary"}
                                                                           value={room.id}/>
                                                                    <label htmlFor={room.id}>{room.value}</label>
                                                                </li>
                                                            )
                                                        })
                                                    }
                                                </ul>
                                            </div>
                                        </div>
                                        {errors.type && <ErrorMessage margin={"mt-4"}>Veuillez choisir un type de salle</ErrorMessage>}
                                    </div>

                                    <div className={"flex flex-col"}>
                                        <div className={"flex flex-row items-center gap-x-10"}>
                                            <p className={"w-52 text-xl"}>Difficulté du quizz</p>
                                            <ul className={`flex flex-row gap-x-6 difficulty`}>
                                                {
                                                    difficulties.map((difficulty) => {
                                                        return (
                                                            <li key={difficulty.id}>
                                                                <input {...register(difficulty.name, { required: true })} type={"radio"}
                                                                       id={difficulty.id}
                                                                       className={"btn primary"}
                                                                       value={difficulty.id}/>
                                                                <label htmlFor={difficulty.id}>{difficulty.value}</label>
                                                            </li>
                                                        )
                                                    })
                                                }
                                            </ul>
                                        </div>
                                        {errors.difficulty && <ErrorMessage margin={"mt-4"}>Veuillez choisir une difficulté</ErrorMessage>}
                                    </div>

                                </div>
                                <div className={"flex flex-col gap-y-6 w-1/2"}>
                                    <div className={"flex flex-col"}>
                                        <div className={"flex flex-row items-center gap-x-10 min-h-12"}>
                                            <p className={"w-52 text-xl"}>Nombre de round</p>
                                            <input {...register("roundNumber", { required: true })} type={"number"} placeholder={"Exemple : 1"} min={1}/>
                                        </div>
                                        {errors.roundNumber && <ErrorMessage margin={"mt-4"}>Veuillez entrer un nombre de round</ErrorMessage>}
                                    </div>

                                    <div className={"flex flex-col"}>
                                        <div className={"flex flex-row items-center gap-x-10 min-h-12"}>
                                            <p className={"w-52 text-xl"}>Nombre de question</p>
                                            <input {...register("questionNumber", { required: true })} type={"number"} placeholder={"Exemple : 12"} min={1}/>
                                        </div>
                                        {errors.questionNumber && <ErrorMessage margin={"mt-4"}>Veuillez entrer un nombre de question</ErrorMessage>}
                                    </div>
                                </div>
                            </div>
                            <div className={"flex flex-col items-center gap-y-5 mt-14"}>
                                <p className={"text-xl"}>Choix de la catégorie</p>
                                <ul className={"category"}>
                                    <li>
                                        <input {...register('category', { required: true })} type={"radio"}
                                               id={'random'}
                                               className={"btn primary"}
                                               value={'random'}/>
                                        <label htmlFor={'random'}>Aléatoire</label>
                                    </li>
                                </ul>
                                <ul className={"category grid grid-cols-8 gap-x-6 gap-y-4 justify-center"}>
                                    {categories.map((category, index) =>
                                        <li className={`category`} key={`category-${index}`}>
                                            <input {...register('category', { required: true })} type={"radio"}
                                                   id={category.id}
                                                   className={"btn primary"}
                                                   value={category.value}/>
                                            <label htmlFor={category.id}>{category.value}</label>
                                        </li>
                                    )}
                                </ul>
                                {errors.category && <ErrorMessage margin={"mt-4"}>Veuillez choisir une catégorie</ErrorMessage>}

                            </div>
                            <button type={'submit'} className={"btn primary w-1/6 mt-8 mx-auto"}>Créer</button>
                        </div>
                    </form>
                </>
            }
        </div>
    )
}