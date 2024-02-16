import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: 'chatgpt-key',
});

export default async function createQuestions(room) {
    const stream = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
            {
                role: "user",
                content: `Peux-tu me créer ${room.questionNumber} questions sur le thème suivant : ${room.category} en mode ${room.difficulty} avec 4 propositions, la réponse et une explication pour chaque question.`,
            }
        ],
        stream: true,
    });
    console.log(stream);
}