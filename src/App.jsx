import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import WhyAxm from './components/WhyAxm'
import HowItWorks from './components/HowItWorks'
import Engine from './components/Engine'
import UseCases from './components/UseCases'
import TechSpecs from './components/TechSpecs'
import DyshProducts from './components/DyshProducts'
import ComparisonTable from './components/ComparisonTable'
import Faq from './components/Faq'
import Contact from './components/Contact'
import Footer from './components/Footer'

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <WhyAxm />
        <HowItWorks />
        <Engine />
        <UseCases />
        <TechSpecs />
        <DyshProducts />
        <ComparisonTable />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
