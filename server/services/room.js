export function filterUsersInRoom(rooms, socket, io){
    return rooms.forEach(room => {
        room.users = room.users.filter((user) => user.id !== socket.id);
        io.to(room.roomId).emit('get-users', room.users);
    });
}

export function joinRoom(roomsArray, data, socket, io) {
    //If the submitted id is the same id of the first room found then add the user and let him join the channel & send event
    roomsArray.some(room => {
        if(data.roomId === room.roomId)
        {
            room.users.push({
                id: socket.id,
                username: data.username,
                score: 0,
                type: 'player'
            });

            socket.join(room.roomId);
            socket.join(socket.id);
            // io.to(room.roomId).emit('room-joined', true);
            io.to(socket.id).emit('room-joined-waiting', true);
            io.to(room.roomId).emit('get-users', room.users);
            return true;
        }
        return false;
    });
}