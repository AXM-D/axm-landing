import { Wordmark } from './Logo'

export default function Footer() {
  return (
    <footer className="band-dark overflow-hidden border-t border-line">
      <div className="wrap pb-8 pt-12 md:pt-16">
        <Wordmark className="h-auto w-full text-fg" title="AXM" />
        <div className="mt-8 flex flex-col gap-3 text-sm text-muted sm:flex-row sm:items-center sm:justify-between md:mt-10">
          <p>
            <span lang="en">Context Infrastructure Systems</span>
            <span className="text-dim">, {new Date().getFullYear()}</span>
          </p>
          <p>Sin cookies ni rastreadores.</p>
          <a href="#inicio" className="tlink -my-3 py-3 text-fg">
            Volver arriba
          </a>
        </div>
      </div>
    </footer>
  )
}
