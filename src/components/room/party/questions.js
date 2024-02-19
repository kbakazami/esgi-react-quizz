"use client"

import {useEffect, useState} from "react";

export default function Questions({socket, room, timeLeft, question, round}) {

    const [disabledColor, setIsDisabledColor] = useState('');
    const [disabled, setDisabled] = useState(false);
    const [divStyle, setDivStyle] = useState({});
    const [timerText, setTimerText] = useState('');
    const [answer, setAnswer] = useState(undefined);
    const [explication, setExplication] = useState(undefined);
    const [isWaitingAnswer, setIsWaitingAnswer] = useState(false);
    const [responseChoosen, setResponseChoosen] = useState('');

    const submitAnswer = (value) => {
        socket.emit('send-response', {question: question, response: value, room: room, user: socket.id, roundId: round});
        setDisabled(true);
        setIsWaitingAnswer(true);
        setResponseChoosen(value);
    }

    useEffect(() => {
        setDisabled(false);
        setIsDisabledColor('');
    }, [room]);

    useEffect(() => {
        setDivStyle({
            width: ((timeLeft * 10) / 2) + '%',
        });

        setTimerText(`${timeLeft} secondes`);

        if(timeLeft === 0)
        {
            setTimerText('Temps écoulé');

            if(disabled === false)
            {
                submitAnswer(null);
                setDisabled(true);
            }

            setIsDisabledColor('add-color');
            setIsWaitingAnswer(false);
        }
    }, [timeLeft]);

    useEffect(() => {
        setDivStyle({
            width: '100%',
        });

        if(timeLeft > 0)
        {
            if(disabled === false)
            {
                setTimerText('20 secondes');
            }
            setDisabled(false);
            setIsDisabledColor('');
        }
    }, [question]);

    useEffect(() => {

        socket.on('send-answer', (data) => {
            setAnswer(data.correct);
            setExplication(data.explication);
        });

        socket.on('reset-explication', () => {
            setAnswer(undefined);
            setExplication(undefined);
        });
    }, []);

    return (
        <div>
            <div>
                <h2 className={"text-5xl font-bold text-center mt-4 mb-20"}>{question.question}</h2>
                {
                    !isWaitingAnswer && answer !== undefined && explication !== undefined && (
                        <div className={"flex flex-col gap-y-4 justify-center text-center my-24"}>
                            {
                                <p className={"text-2xl"}> {answer ? 'Bonne réponse ! :)' : 'Mauvaise réponse :('}</p>
                            }
                            <p className={"text-xl"}>Explication : {explication}</p>
                        </div>
                    )
                }
                {
                    isWaitingAnswer && (
                        <p className={"text-2xl text-center my-24"}>En attente de la réponse de tout le monde...</p>
                    )
                }
                <div className={"grid grid-cols-2 gap-8"}>
                    {
                        Object.keys(question).length > 0 && question.answerPropositions.map((propositions, index) => {
                            return (
                                <button key={index}
                                        className={`btn primary ${disabledColor} ${propositions === question.answer ? 'correct-response' : 'wrong-response'} ${propositions === responseChoosen ? 'selected' : ''}`}
                                        onClick={(e) => submitAnswer(e.target.value)}
                                        value={propositions}
                                        disabled={disabled}>
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