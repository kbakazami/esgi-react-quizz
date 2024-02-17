"use client"

import {useForm} from "react-hook-form";
import {useEffect, useState} from "react";

export default function Questions({socket, roomInformations, resetSubmittedAnswer}) {

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

    return (
        <div>
            {
                Object.keys(roomInformations).length > 0 && roomInformations.questions.map((question, index) => {
                    if(question.displayed)
                    {
                        return(
                            <div key={index}>
                                <h2 className={"text-center mt-4"}>{question.question}</h2>
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
        </div>
    )
}