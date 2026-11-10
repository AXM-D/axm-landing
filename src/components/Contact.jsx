import Reveal from './Reveal'
import CopyEmail from './CopyEmail'
import { CONTACT_EMAIL, LINKS } from '../data'

export default function Contact() {
  return (
    <section id="contacto" className="scroll-mt-20 border-t border-line py-24 md:py-36">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-signal">Contacto</p>
          <h2 className="mt-5 text-4xl font-medium leading-[1.02] tracking-[-0.035em] sm:text-6xl">
            ¿Tienes señales <span className="font-serif italic tracking-normal text-signal">sin contexto?</span>
          </h2>
        </Reveal>
        <Reveal index={1}>
          <p className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-mute sm:text-lg">
            Un proyecto a medida, una integración o una revisión de arquitectura. Escríbeme y te respondo personalmente.
          </p>
        </Reveal>
        <Reveal index={2} className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a href={`mailto:${CONTACT_EMAIL}`} className="btn btn-primary">
            Escribir un email
          </a>
          <CopyEmail />
        </Reveal>
        <Reveal index={3} className="mt-8 flex justify-center gap-6 text-sm text-dim">
          <a href={LINKS.githubDevs} target="_blank" rel="noreferrer" className="link-hover transition-colors duration-200">
            github.com/AXM-DEVs
          </a>
          <a href={LINKS.githubD} target="_blank" rel="noreferrer" className="link-hover transition-colors duration-200">
            github.com/AXM-D
          </a>
        </Reveal>
      </div>
    </section>
  )
}
