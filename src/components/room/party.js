"use client";
import UsersList from "@/components/room/informations/users-list";
import Questions from "@/components/room/party/questions";
import {useEffect, useState} from "react";

export default function RoomParty({socket, users}) {

    const [room, setRoom] = useState({});
    const [question, setQuestion] = useState({});
    const [round, setRound] = useState(0);
    const [timeLeft, setTimeLeft] = useState(20);

    useEffect(() => {
        socket.on('get-room', (data) => {
            setRoom(data);
        });

        socket.on('get-room-question', (data) => {
            setQuestion(data.questions[0]);
            setRound(data.roundId);
        });

        socket.on('question-time-left', (timeLeft) => {
            setTimeLeft(timeLeft);
        });

        socket.on('send-next-question', (data) => {
            setQuestion(data.question);
            setRound(data.roundId);
            setTimeLeft(20);
        });
    }, []);

    return (
        <div>
            <div className={`flex ${room.partyEnded ? 'flex-col gap-y-10 justify-center items-center' : 'flex-row justify-between items-start'}`}>
                {room && room.partyEnded && <h2>La partie est finie !</h2>}
                <UsersList users={users} partyEnded={room.partyEnded} socket={socket}/>
                <button className={`btn primary`} onClick={() => socket.emit('leave')}>Quitter la partie</button>
            </div>
            <div className={"flex flex-row gap-x-10 mt-4"}>
                <p>Round n°{round} / {room.roundNumber}</p>
                <p>Question n°{question.id} / {room.questionNumber}</p>
            </div>
            {
                room && !room.partyEnded && (
                    <>
                        <Questions room={room} socket={socket} timeLeft={timeLeft} question={question} round={round}/>
                        {
                            users.map((user) => {
                                if(timeLeft === 0 && user.type === 'host' && user.id === socket.id && !room.partyEnded)
                                {
                                    return (
                                        <button key={user.id} className={"btn primary flex mx-auto mt-4"} onClick={() => socket.emit('get-next-question', {actualQuestionId: question.id, actualRoundId: round, room: room})}>Question suivante</button>
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