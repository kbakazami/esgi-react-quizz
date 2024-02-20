export function filterUsersInRoom(rooms, socket, io){
    return rooms.forEach(room => {
        room.users = room.users.filter((user) => user.id !== socket.id);
        io.to(room.roomId).emit('get-users', room.users);
    });
}

export function joinRoom(roomsArray, data, socket, io) {
    //If the submitted id for the room exist then add the user and let him join the channel & send event
    //Else send error
    const room = roomsArray.find(room => room.roomId === data.roomId);

    if(room)
    {
        const user = room.users.find(user => user.id === socket.id);

        if(user === undefined)
        {
            room.users.push({
                id: socket.id,
                username: data.username,
                score: 0,
                type: 'player'
            });

            socket.join(room.roomId);
            socket.join(socket.id);

            if(!room.isPlaying)
            {
                io.to(socket.id).emit('room-joined-waiting', true);
            } else {
                io.to(socket.id).emit('room-joined', true);
                io.to(socket.id).emit('user-waiting', {value: true, room: room});
            }
            io.to(room.roomId).emit('get-users', room.users);

        } else {
            io.emit('join-room-error', {message: 'Vous ne pouvez pas rejoindre une salle que vous avez créé !'});
        }
    } else {
        io.emit('join-room-error', {message: 'Le code est invalide ou la salle n\'existe pas, veuillez réessayer'});
    }
}

export function sendNextQuestion(io, roomId, nextQuestion, roundId, startTimer) {
    io.to(roomId).emit('send-next-question', {question: nextQuestion, roundId: roundId});
    io.to(roomId).emit('reset-explication');
    setTimeout(() => {
        startTimer(roomId);
    }, 2000);
}