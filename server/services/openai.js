import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: 'chatgpt-key',
});

export async function createQuestions(room) {
    const difficulty = translateDifficulty(room.difficulty);

    const stream = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
            {
                role: "user",
                content: `Peux-tu me créer ${room.questionNumber} questions sur le thème suivant : ${room.category} en mode ${difficulty} avec 4 propositions, la réponse et une explication pour chaque question.`,
            }
        ],
        stream: true,
    });
    console.log(stream);
}

export async function generateTopic() {
    const stream = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
            {
                role: "user",
                content: `Peux-tu me créer 20 sujets différents pour des questions.`,
            }
        ],
        stream: true,
    });
    console.log(stream);
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