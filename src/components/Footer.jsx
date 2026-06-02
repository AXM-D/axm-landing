export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 py-12">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid sm:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2.5">
              <img src="/axm-logo.jpeg" alt="AXM" className="h-7 w-7 rounded object-cover ring-1 ring-slate-700" />
              <span className="text-base font-semibold text-white">AXM</span>
            </div>
            <p className="mt-3 text-sm text-slate-400 leading-relaxed max-w-xs">
              Intelligence engines for OSINT platforms. Built by AXM.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Product</h4>
            <ul className="mt-4 space-y-2.5">
              <li><a href="#engine" className="text-sm text-slate-400 hover:text-white transition-colors">Engine</a></li>
              <li><a href="#dysh" className="text-sm text-slate-400 hover:text-white transition-colors">DySH Editions</a></li>
              <li><a href="#compare" className="text-sm text-slate-400 hover:text-white transition-colors">Comparison</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Contact</h4>
            <ul className="mt-4 space-y-2.5">
              <li><a href="mailto:axm.central@outlook.com" className="text-sm text-slate-400 hover:text-white transition-colors">axm.central@outlook.com</a></li>
              <li><a href="https://github.com/AXM-D" className="text-sm text-slate-400 hover:text-white transition-colors">github.com/AXM-D</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} AXM. All rights reserved.</p>
          <p>Built on TaQ Engine</p>
        </div>
      </div>
    </footer>
  )
}
