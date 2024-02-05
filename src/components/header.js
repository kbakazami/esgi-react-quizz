import Image from "next/image";
import logo from "../images/logo.png";
import Link from "next/link";

export default function Header() {
    return (
        <nav className={"flex flex-row items-center justify-between"}>
            <div className={"w-2/12"}>
                <Link href={'/'}>
                    <Image src={logo} alt={"Logo"}/>
                </Link>
            </div>
            <div className={"flex flex-row items-center justify-center gap-x-24 w-8/12"}>
                <Link href={'/room/join'} className={"link"}>
                    Rejoindre une salle
                </Link>
                <Link href={'/room/create'} className={"link"}>
                    Créer une salle
                </Link>
            </div>
            <div className={"flex flex-row items-center justify-end gap-x-10 w-2/12"}>
                <Link href={'#'} className={"link"}>
                    Inscription
                </Link>
                <Link href={'#'} className={"btn primary"}>
                    Connexion
                </Link>
            </div>
        </nav>
    )
}