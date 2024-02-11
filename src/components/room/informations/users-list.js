const usersList = ({users}) => {
    return (
        <>
            <p>Liste des utilisateurs</p>
            {users.map((user) => {
                return (
                    <p key={user.id}>{user.username}</p>
                )
            })}
        </>

    )
}

export default usersList;