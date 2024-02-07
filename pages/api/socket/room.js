
const room = {
    roomType: '',
    difficulty: '',
    roundNumber: '',
    questionNumber: '',
    category: '',
};

export default async function handler(req, res) {
    if(res.socket.server.io) {
        console.log('in handler');
        // console.log(room);
        room.roomType = req.body.type;
        room.difficulty = req.body.difficulty;
        room.roundNumber = req.body.roundNumber;
        room.questionNumber = req.body.questionNumber;
        room.category = req.body.category;
        console.log(room);
        // return room;
        res.socket.server.emit('create-room', room);


    }
    res.end();
}