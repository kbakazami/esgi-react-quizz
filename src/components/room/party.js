"use client";
import UsersList from "@/components/room/informations/users-list";
import Questions from "@/components/room/party/questions";
import {useEffect, useState} from "react";
import usersList from "@/components/room/informations/users-list";

export default function RoomParty({socket, users, roomInformations, questionInformations, timeLeft, roomQuestion, roundId}) {

    const [answer, setAnswer] = useState(null);
    const [explication, setExplication] = useState('');

    useEffect(() => {
        if(questionInformations)
        {
            setAnswer(questionInformations.correct);
            setExplication(questionInformations.explication);
        }
    }, [questionInformations]);

    useEffect(() => {
        setAnswer(undefined);
        setExplication(undefined);
    }, [roomQuestion]);

    return (
        <div>
            <p>Round n°{roundId} / {roomInformations.roundNumber}</p>
            <p>Question n°{roomQuestion.id} / {roomInformations.questionNumber}</p>
            <div className={`flex ${roomInformations.partyEnded ? 'flex-col gap-y-10 justify-center items-center' : 'flex-row justify-between items-start'}`}>
                {roomInformations && roomInformations.partyEnded && <h2>La partie est finie !</h2>}
                <UsersList users={users} partyEnded={roomInformations.partyEnded} socket={socket}/>
                <button className={`btn primary`} onClick={() => socket.emit('leave')}>Quitter la partie</button>
            </div>
            {
                roomInformations && !roomInformations.partyEnded && (
                    <>
                        <Questions roomInformations={roomInformations} socket={socket} resetSubmittedAnswer={false} timeLeft={timeLeft} roomQuestion={roomQuestion} roundId={roundId}/>
                        {
                            answer !== undefined && answer ? <p>Bonne réponse !</p> : answer !== undefined && <p>Mauvaise réponse</p>
                        }
                        {
                            explication !== undefined && <p>Explication : {questionInformations.explication}</p>
                        }
                        {
                            users.map((user) => {
                                if(timeLeft === 0 && user.type === 'host' && user.id === socket.id && !roomInformations.partyEnded)
                                {
                                    return (
                                        <button key={user.id} className={"btn primary flex mx-auto mt-4"} onClick={() => socket.emit('get-next-question', {actualQuestionId: roomQuestion.id, actualRoundId: roundId, room: roomInformations})}>Question suivante</button>
                                    )
                                }
                            })
                        }
                    </>
                )
            }
        </div>
    )
}