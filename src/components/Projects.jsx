import Reveal from './Reveal'
import { PROJECTS } from '../data'

function Arrow() {
  return (
    <svg viewBox="0 0 16 16" className="card-arrow size-4 text-dim" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M5 11l6-6M6 5h5v5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ProjectCard({ p, index }) {
  return (
    <Reveal index={index} className={p.featured ? 'md:col-span-3' : ''}>
      <a
        href={p.href}
        target="_blank"
        rel="noreferrer"
        className="card-hover group flex h-full flex-col rounded-3xl border border-line bg-ink-2 p-7 transition-[background-color,border-color] duration-200 sm:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-line-2 px-2.5 py-0.5 text-[11px] text-mute">{p.tag}</span>
            <span className={`flex items-center gap-1.5 text-[11px] ${p.featured ? 'text-signal' : 'text-dim'}`}>
              {p.featured && <span className="pulse-dot size-1.5 rounded-full bg-signal" />}
              {p.status}
            </span>
          </div>
          <Arrow />
        </div>
        <h3 className={`mt-8 font-medium tracking-[-0.03em] ${p.featured ? 'text-4xl sm:text-5xl' : 'text-2xl'}`}>{p.name}</h3>
        <p className={`mt-3 leading-relaxed text-mute ${p.featured ? 'max-w-2xl text-base sm:text-lg' : 'text-[15px]'}`}>{p.desc}</p>
        <ul className="mt-auto flex flex-wrap gap-x-4 gap-y-1 pt-8 font-mono text-[12px] text-dim">
          {p.stack.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </a>
    </Reveal>
  )
}

export default function Projects() {
  return (
    <section id="proyectos" className="scroll-mt-20 border-t border-line py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-signal">Portafolio</p>
            <h2 className="mt-4 text-4xl font-medium leading-[1.05] tracking-[-0.03em] sm:text-5xl">
              Proyectos <span className="font-serif italic tracking-normal text-mute">seleccionados.</span>
            </h2>
          </Reveal>
          <Reveal index={1}>
            <p className="max-w-sm text-base leading-relaxed text-mute">
              Herramientas propias de seguridad, datos y arquitectura. Todas nacen de un problema real y comparten la misma idea: entender antes de actuar.
            </p>
          </Reveal>
        </div>
        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {PROJECTS.map((p, i) => (
            <ProjectCard key={p.name} p={p} index={p.featured ? 0 : i - 1} />
          ))}
        </div>
      </div>
    </section>
  )
}
