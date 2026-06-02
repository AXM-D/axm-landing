import useScrollReveal from '../hooks/useScrollReveal'

export default function Hero() {
  const [ref, visible] = useScrollReveal()

  return (
    <section ref={ref} className="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-transparent pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-blue-100/30 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className={`mx-auto max-w-5xl px-6 text-center relative transition-all duration-700 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-full text-xs font-medium text-blue-700 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          OSINT intelligence engines
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.1]">
          Intelligence Engines for{' '}
          <span className="text-blue-600">OSINT Platforms</span>
        </h1>
        <p className="mt-6 text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
          AXM builds automation, scoring, and query engines that transform OSINT platforms into intelligent investigation systems.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="#engine" className="w-full sm:w-auto text-center text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-7 py-3 rounded-lg shadow-sm hover:shadow-md transition-all">
            Explore the engine
          </a>
          <a href="#dysh" className="w-full sm:w-auto text-center text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 px-7 py-3 rounded-lg transition-colors">
            See DySH editions
          </a>
        </div>
      </div>
    </section>
  )
}
