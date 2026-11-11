import { useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Services from './components/Services'
import Process from './components/Process'
import Engine from './components/Engine'
import Projects from './components/Projects'
import Faq from './components/Faq'
import Contact from './components/Contact'
import Footer from './components/Footer'
import MobileCta from './components/MobileCta'
import { ToastProvider } from './components/Toast'

export default function App() {
  // El servicio elegido en «Servicios» llega preseleccionado al email de contacto.
  const [topic, setTopic] = useState(null)

  return (
    <ToastProvider>
      <a href="#contenido" className="btn btn-primary fixed left-4 top-3 z-50 -translate-y-20 focus-visible:translate-y-0">
        Saltar al contenido
      </a>
      <Navbar />
      <main id="contenido">
        <Hero />
        <Services onPick={setTopic} />
        <Process />
        <Engine />
        <Projects />
        <Faq />
        <Contact topic={topic} onTopic={setTopic} />
      </main>
      <Footer />
      <MobileCta />
    </ToastProvider>
  )
}
