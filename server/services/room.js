export function filterUsersInRoom(rooms, socket, io){
    return rooms.forEach(room => {
        room.users = room.users.filter((user) => user.id !== socket.id);
        io.to(room.roomId).emit('get-users', room.users);
    });
}