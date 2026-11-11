import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Engine from './components/Engine'
import Projects from './components/Projects'
import Studio from './components/Studio'
import Contact from './components/Contact'
import Footer from './components/Footer'
import { ToastProvider } from './components/Toast'

export default function App() {
  return (
    <ToastProvider>
      <div className="grain">
        <Navbar />
        <main>
          <Hero />
          <Engine />
          <Projects />
          <Studio />
          <Contact />
        </main>
        <Footer />
      </div>
    </ToastProvider>
  )
}
