"use client";
import { useForm } from "react-hook-form"
import {useEffect, useState} from "react";
import RoomParty from "@/components/room/party";
import ErrorMessage from "@/components/error-message";

export default function CreateRoom({socket}) {

    const roomType = [
        {id: 'private', value: 'Privée', name: 'type'},
        {id: 'public', value: 'Publique', name: 'type'},
    ];

    const difficulties = [
        {id: 'easy', value: 'Facile', name: 'difficulty'},
        {id: 'medium', value: 'Moyen', name: 'difficulty'},
        {id: 'hard', value: 'Difficile', name: 'difficulty'}
    ];

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm()

    const onSubmit = (data) => {
        data.socketId = socket.id;
        socket.emit('create-room', data);
    }

    return (
        <div>
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
                                            <li>
                                                <input {...register('type', { required: true })} type={"radio"}
                                                       id={'private'}
                                                       className={"btn primary"}
                                                       value={'private'}/>
                                                <label htmlFor={'private'}>Privée</label>
                                            </li>
                                            <li>
                                                <input {...register('type', { required: true })} type={"radio"}
                                                       id={'public'}
                                                       className={"btn primary"}
                                                       value={'public'}/>
                                                <label htmlFor={'public'}>Publique</label>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                {errors.type && <ErrorMessage margin={"mt-4"}>Veuillez choisir un type de salle</ErrorMessage>}
                            </div>

                            <div className={"flex flex-col"}>
                                <div className={"flex flex-row items-center gap-x-10"}>
                                    <p className={"w-52 text-xl"}>Difficulté du quizz</p>
                                    <ul className={`flex flex-row gap-x-6 difficulty`}>
                                        <li>
                                            <input {...register('difficulty', { required: true })} type={"radio"}
                                                   id={'easy'}
                                                   className={"btn primary"}
                                                   value={'easy'}/>
                                            <label htmlFor={'easy'}>Facile</label>
                                        </li>
                                        <li>
                                            <input {...register('difficulty', { required: true })} type={"radio"}
                                                   id={'medium'}
                                                   className={"btn primary"}
                                                   value={'medium'}/>
                                            <label htmlFor={'medium'}>Moyen</label>
                                        </li>
                                        <li>
                                            <input {...register('difficulty', { required: true })} type={"radio"}
                                                   id={'hard'}
                                                   className={"btn primary"}
                                                   value={'hard'}/>
                                            <label htmlFor={'hard'}>Difficile</label>
                                        </li>
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
                        <ul className={"category grid grid-cols-10 gap-x-6 gap-y-4 justify-center"}>
                            {[...Array(20)].map((x, i) =>
                                <li className={`category`} key={`category-${i}`}>
                                    <input {...register('category', { required: true })} type={"radio"}
                                           id={`category-${i}`}
                                           className={"btn primary"}
                                           value={`category-${i}`}/>
                                    <label htmlFor={`category-${i}`}>Catégorie - {i}</label>
                                </li>
                            )}
                        </ul>
                        {errors.category && <ErrorMessage margin={"mt-4"}>Veuillez choisir une catégorie</ErrorMessage>}

                    </div>
                    <button type={'submit'} className={"btn primary w-1/6 mt-8 mx-auto"}>Créer</button>
                </div>
            </form>
        </div>
    )
}