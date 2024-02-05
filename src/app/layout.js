import './globals.scss'
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className={""}>
      <div className={"page-wrapper px-20 py-5"}>
          <main id={"main-content"}>
                  <Header/>
                  {children}
          </main>
      </div>
      <Footer/>
      </body>
    </html>
  )
}
