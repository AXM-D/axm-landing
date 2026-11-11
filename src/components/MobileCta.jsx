import { useEffect, useState } from 'react'
import { CTA_LABEL } from '../data'
import { ArrowRight } from './icons'

/*
  Barra de contacto fija en móvil. Aparece cuando el hero (que ya enseña el mismo
  botón) sale de pantalla y se retira al llegar a la sección de contacto.
*/
export default function MobileCta() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const hero = document.getElementById('inicio')
    const contact = document.getElementById('contacto')
    const footer = document.querySelector('footer')
    if (!hero || !contact || !footer) return
    const seen = new Map()
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((e) => seen.set(e.target, e.isIntersecting))
      setShow(!seen.get(hero) && !seen.get(contact) && !seen.get(footer))
    }, { rootMargin: '-96px 0px 0px 0px' })
    observer.observe(hero)
    observer.observe(contact)
    observer.observe(footer)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      inert={!show}
      className="band-dark fixed inset-x-0 bottom-0 z-30 border-t border-line !bg-bg/90 px-4 pt-3 backdrop-blur-md md:hidden"
      style={{
        paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))',
        transform: show ? 'translateY(0)' : 'translateY(100%)',
        transition: show ? 'transform 380ms var(--ease-drawer)' : 'transform 200ms var(--ease-out)',
      }}
    >
      <a href="#contacto" className="btn btn-primary w-full">
        {CTA_LABEL}
        <ArrowRight className="size-4" />
      </a>
    </div>
  )
}
