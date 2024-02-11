"use client";
import UsersList from "@/components/room/informations/users-list";

export default function RoomParty({socket, users}) {
    return (
        <div>
            Room party
            <UsersList users={users}/>
            <button className={"btn primary"} onClick={() => socket.emit('leave')}>Quitter la partie</button>
        </div>
    )
}