export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-xs text-dim sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>© {new Date().getFullYear()} AXM · Estudio independiente</p>
        <p>Hecho a mano con React y CSS. Sin rastreadores.</p>
        <a href="#inicio" className="link-hover transition-colors duration-200">
          Volver arriba ↑
        </a>
      </div>
    </footer>
  )
}
