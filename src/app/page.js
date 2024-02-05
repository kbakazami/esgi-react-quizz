import Image from 'next/image'
import Link from "next/link";

export default function Home() {
  return (
      <>
          <h1>TP Quiz - React - Socket.io</h1>
          <div className={"flex flex-col items-center justify-center mt-52"}>
              <div className={"flex flex-row items-center justify-center gap-x-24"}>
                  <Link href={'/room/join'} className={"btn primary"}>
                      Rejoindre une salle
                  </Link>
                  <Link href={'/room/create'} className={"btn primary"}>
                      Créer une salle
                  </Link>
              </div>
          </div>
      </>

  )
}
