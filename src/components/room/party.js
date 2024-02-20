"use client";
import UsersList from "@/components/room/informations/users-list";
import Questions from "@/components/room/party/questions";
import {useEffect, useState} from "react";

export default function RoomParty({socket, users}) {

    const [room, setRoom] = useState({});
    const [question, setQuestion] = useState({});
    const [round, setRound] = useState(0);
    const [timeLeft, setTimeLeft] = useState(20);
    const [isUserWaiting, setIsUserWaiting] = useState(false);

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

    useEffect(() => {
        socket.on('user-waiting', (data) => {
            if(data.value) {
                setRoom(data.room);
                if(timeLeft !== 0 && data.room.isPlaying === true)
                {
                    setIsUserWaiting(true);
                }
            } else {
                setIsUserWaiting(false);
            }
        });
    }, []);

    return (
        <div>
            <p>Sujet des questions : {room.category}</p>
            {
                isUserWaiting && <div className={"flex flex-col items-center justify-center gap-x-4 mt-20"}>
                    <h1 className={"italic"}>En attente de la fin de la question</h1>
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
                !isUserWaiting && (
                    <>
                        <div className={`flex ${room.partyEnded ? 'flex-col gap-y-10 justify-center items-center' : 'flex-row justify-between items-start'}`}>
                            {room && room.partyEnded && <h2 className={"mt-4"}>La partie est finie !</h2>}
                            <UsersList users={users} partyEnded={room.partyEnded} socket={socket}/>
                            <button className={`btn primary`} onClick={() => socket.emit('leave')}>Quitter la partie</button>
                        </div>

                        {
                            room && !room.partyEnded && (
                                <div className={"flex flex-row gap-x-10 mt-4"}>
                                    <p>Code de la salle : {room.roomId}</p>
                                    <p>Sujet des questions : {room.category}</p>
                                    <p>Round n°{round} / {room.roundNumber}</p>
                                    <p>Question n°{question.id} / {room.questionNumber}</p>
                                </div>
                            )
                        }

                        {
                            room && !room.partyEnded && (
                                <>
                                    <Questions room={room} socket={socket} timeLeft={timeLeft} question={question} round={round} isUserWaiting={isUserWaiting}/>
                                    {
                                        users.map((user) => {
                                            if(timeLeft === 0 && user.type === 'host' && user.id === socket.id && !room.partyEnded)
                                            {
                                                return (
                                                    <button key={user.id} className={"btn primary flex mx-auto mt-4"} onClick={() => {
                                                        socket.emit('get-next-question', {actualQuestionId: question.id, actualRoundId: round, room: room});
                                                        setIsUserWaiting(false);
                                                    }}>Question suivante</button>
                                                )
                                            }
                                        })
                                    }
                                </>
                            )
                        }
                    </>
                )
            }

        </div>
    )
}