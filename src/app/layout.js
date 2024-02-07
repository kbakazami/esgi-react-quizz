import './globals.scss'
import 'react-toastify/dist/ReactToastify.css';
import Header from "@/components/header";
import Footer from "@/components/footer";
import Providers from "@/components/providers";

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className={""}>
      <Providers>
          <div className={"page-wrapper px-20 py-5"}>
              <main id={"main-content"}>
                  <Header/>
                  {children}
              </main>
          </div>
          <Footer/>
      </Providers>
      </body>
    </html>
  )
}
