"use client"
import Image from "next/image";
import logo from "../images/logo.png";
import Link from "next/link";
import {signOut, useSession} from "next-auth/react";

export default function Header() {
    const {data: session, status} = useSession();
    if(status === 'loading') {
        return null;
    }


    return (
        <nav className={"flex flex-row items-center justify-between"}>
            <div className={"w-4/12"}>
                <Link href={"/"}>
                    <Image src={logo} alt={"Logo"}/>
                </Link>
            </div>
            <div className={"flex flex-row items-center justify-center gap-x-24 w-4/12"}>
                <button className={"link"}>
                    Rejoindre une salle
                </button>
                <button className={"link"}>
                    Créer une salle
                </button>
            </div>
            {status === 'authenticated' ? (
                <div className={"flex flex-row items-center justify-end gap-x-10 w-4/12"}>
                    <p>Connecté(e) en tant que : { session?.user?.name }</p>
                    <span onClick={() => signOut({redirect: "/"})} className={"btn primary cursor-pointer"}>
                        Déconnexion
                    </span>
                </div>
                ) : (
                <div className={"flex flex-row items-center justify-end gap-x-10 w-4/12"}>
                    <Link href={'/register'} className={"link"}>
                        Inscription
                    </Link>
                    <Link href={'/login'} className={"btn primary"}>
                        Connexion
                    </Link>
                </div>
    )
}
</nav>
)
}