"use client";
import UsersList from "@/components/room/informations/users-list";
import Questions from "@/components/room/party/questions";
import {useEffect, useState} from "react";

export default function RoomParty({socket, users, roomInformations, questionInformations}) {

    const [answer, setAnswer] = useState(null);
    const [explication, setExplication] = useState('');

    useEffect(() => {
        if(questionInformations)
        {
            setAnswer(questionInformations.correct);
            setExplication(questionInformations.explication);
        }
    }, [questionInformations]);

    return (
        <div>
            Room party
            <div className={`flex ${roomInformations.partyEnded ? 'flex-col gap-y-10 justify-center items-center' : 'flex-row justify-between items-start'}`}>
                {roomInformations && roomInformations.partyEnded && <h2>La partie est finie !</h2>}
                <UsersList users={users} partyEnded={roomInformations.partyEnded} socket={socket}/>
                <button className={`btn primary`} onClick={() => socket.emit('leave')}>Quitter la partie</button>
            </div>
            {
                roomInformations && !roomInformations.partyEnded && (
                    <>
                        <Questions roomInformations={roomInformations} socket={socket} resetSubmittedAnswer={false}/>
                        {
                            answer !== undefined && answer ? <p>Bonne réponse !</p> : answer !== undefined && <p>Mauvaise réponse</p>
                        }
                        {
                            explication !== undefined && <p>Explication : {questionInformations.explication}</p>
                        }
                    </>
                )
            }
        </div>
    )
}