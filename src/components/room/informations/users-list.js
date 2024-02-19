import {useEffect, useState} from "react";

const usersList = ({users, partyEnded, waiting, socket}) => {
    const [expandUserList, setExpandUserList] = useState(false);

    useEffect(() => {
        if(partyEnded || waiting)
        {
            setExpandUserList(true);
        }
    }, [partyEnded, waiting]);

    return (
        <div className={`border border-primary rounded-md bg-secondary select-none ${partyEnded || waiting ? 'w-1/2 mx-auto' : 'w-fit cursor-pointer'}`} onClick={() => {
            if(!partyEnded && !waiting) {
                setExpandUserList(!expandUserList);
            }}}>
            <div className={"flex flex-row gap-x-4 items-center ease-in-out duration-300 hover:bg-primary hover:text-white px-5 pt-3 pb-4"}>
                <p>Liste des utilisateurs {partyEnded && '- Score final'} {waiting && ' dans la salle'} </p>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                     stroke="currentColor" className={`w-6 h-6 duration-300 ${expandUserList ? 'rotate-180' : 'rotate-0'}  ${partyEnded || waiting ? 'hidden' : ''}`}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5"/>
                </svg>
            </div>
            { expandUserList &&
                (
                    <div className={"border-primary border-t px-5 pb-3 pt-4"}>
                        {
                            users.map((user) => {
                                return (
                                    <div key={user.id} className={"flex flex-row justify-between"}>
                                        <p>{user.username} {user.id === socket.id && <span>(vous)</span>}</p>
                                        <p>{user.score}</p>
                                    </div>
                                )
                            })
                        }
                    </div>
                )
            }
        </div>
    )
}

export default usersList;