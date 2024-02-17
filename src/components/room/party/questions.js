"use client"

import {useForm} from "react-hook-form";
import {useEffect, useState} from "react";

export default function Questions({socket, roomInformations, resetSubmittedAnswer, timeLeft}) {

    const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);

    const {
        formState: { errors },
    } = useForm();

    const submitAnswer = (value, question) => {
        socket.emit('send-response', {questions: question, response: value, room: roomInformations, user: socket.id});
        setIsAnswerSubmitted(true);
    }

    useEffect(() => {
        setIsAnswerSubmitted(resetSubmittedAnswer);
    }, [roomInformations]);

    const [divStyle, setDivStyle] = useState({});

    useEffect(() => {
        setDivStyle({
            width: ((timeLeft * 10) / 2) + '%',
        });

        if(timeLeft === 0)
        {
            socket.emit('send-response', {response: null, user: socket.id});
            setIsAnswerSubmitted(true);
        }
    }, [timeLeft]);

    return (
        <div>
            {
                Object.keys(roomInformations).length > 0 && roomInformations.questions.map((question, index) => {
                    if(question.displayed)
                    {
                        return(
                            <div key={index}>
                                <h2 className={"text-5xl font-bold text-center mt-4 mb-20"}>{question.question}</h2>
                                <div className={"grid grid-cols-2 gap-8"}>
                                    {
                                        question.answerPropositions.map((propositions, index) => {
                                            return (
                                                <button key={index} className={"btn primary"} onClick={(e) => submitAnswer(e.target.value, question)} value={propositions} disabled={isAnswerSubmitted}>{propositions}</button>
                                            )
                                        })
                                    }
                                </div>

                            </div>
                        )
                    }
                })
            }
            <div className={"flex flex-col gap-y-4 mt-10"}>
                <p className={"text-xl font-bold text-center"}>{timeLeft > 0 ? `${timeLeft} secondes` : 'Temps écoulé'}</p>
                <div className={"border border-primary w-full h-4 ease-in-out duration-300 rounded-md flex flex-row gap-x-4"}>
                    <div className={"bg-primary h-full ease-in-out duration-300"} style={divStyle}></div>
                </div>
            </div>
        </div>
    )
}