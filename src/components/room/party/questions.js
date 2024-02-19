"use client"

import {useEffect, useState} from "react";

export default function Questions({socket, roomInformations, resetSubmittedAnswer, timeLeft, roomQuestion, roundId}) {

    const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
    const [divStyle, setDivStyle] = useState({});
    const [timerText, setTimerText] = useState('');

    console.log(roomQuestion);

    const submitAnswer = (value) => {
        socket.emit('send-response', {question: roomQuestion, response: value, room: roomInformations, user: socket.id, roundId: roundId});
        setIsAnswerSubmitted(true);
    }

    useEffect(() => {
        setIsAnswerSubmitted(resetSubmittedAnswer);
    }, [roomInformations]);

    useEffect(() => {
        setDivStyle({
            width: ((timeLeft * 10) / 2) + '%',
        });

        setTimerText(`${timeLeft} secondes`);

        if(timeLeft === 0)
        {
            setTimerText('Temps écoulé');

            if(isAnswerSubmitted === false)
            {
                submitAnswer(null);
                setIsAnswerSubmitted(true);
            }
        }
    }, [timeLeft]);

    useEffect(() => {
        setDivStyle({
            width: '100%',
        });

        if(timeLeft > 0)
        {
            if(isAnswerSubmitted === false)
            {
                setTimerText('20 secondes');
            }
            setIsAnswerSubmitted(false);
        }
    }, [roomQuestion]);

    return (
        <div>
            <div>
                <h2 className={"text-5xl font-bold text-center mt-4 mb-20"}>{roomQuestion.question}</h2>
                <div className={"grid grid-cols-2 gap-8"}>
                    {
                        Object.keys(roomQuestion).length > 0 && roomQuestion.answerPropositions.map((propositions, index) => {
                            return (
                                <button key={index}
                                        className={`btn primary ${propositions === roomQuestion.answer ? 'correct-response' : 'wrong-response'}`}
                                        onClick={(e) => submitAnswer(e.target.value)}
                                        value={propositions}
                                        disabled={isAnswerSubmitted}>
                                    {propositions}
                                </button>
                            )
                        })
                    }
                </div>
            </div>
            <div className={"flex flex-col gap-y-4 mt-10"}>
                <p className={"text-xl font-bold text-center"}>{timerText}</p>
                <div className={"border border-primary w-full h-4 ease-in-out duration-300 rounded-md flex flex-row gap-x-4"}>
                    <div className={"bg-primary h-full ease-in-out duration-300"} style={divStyle}></div>
                </div>
            </div>
        </div>
    )
}