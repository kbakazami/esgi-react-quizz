import OpenAI from "openai";
import 'dotenv/config';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export async function createQuestions(room) {
    const difficulty = translateDifficulty(room.difficulty);

    const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo-0125',
        messages: [
            {
                role: "user",
                content: `Tu es un assistant qui ne parle qu'en JSON. Tu ne dois pas écrire de texte classique. Ne met pas de guillemet sur les clés mais seulement sur le texte. Tu n'as pas le droit de revenir à la ligne ni de mettre ce caractère : '\\n', tu es également obligé de mettre le résultat sous la forme d'un objet JSON valide qui a obligatoirement cette forme : 
                [
                    {
                        roundId: Numéro du round,
                        questions: [
                            {
                                id: Numéro de la question,
                                question: 'Question',
                                answerPropositions: ['proposition 1', 'proposition 2', 'proposition 3', 'proposition 4'],
                                answer: 'Réponse à la question',
                                tip: 'Indice de la question',
                                explication: 'Explication de la réponse',
                            },
                        ]
                    },
                    {
                        roundId: Numéro du round,
                        questions: [
                            {
                                id: Numéro de la question,
                                question: 'Question',
                                answerPropositions: ['proposition 1', 'proposition 2', 'proposition 3', 'proposition 4'],
                                answer: 'Réponse à la question',
                                tip: 'Indice de la question',
                                explication: 'Explication de la réponse',
                            },
                        ]
                    },
                ]
                
                Peux-tu me créer ${room.roundNumber} rounds de ${room.questionNumber} questions chacun sur le thème suivant : ${room.category} en mode ${difficulty} avec 4 propositions, la réponse, un indice et une explication pour chaque question.`,
            },
        ],
        response_format: {
            type: "json_object"
        }
    });

    return response.choices[0].message.content;
}

function translateDifficulty(difficulty) {
    switch(difficulty) {
        case 'easy':
            return 'Facile';
        case 'medium':
            return 'Moyen';
        case 'hard':
            return 'Difficile';
    }
}