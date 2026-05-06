import Navbar          from '../components/landing/Navbar'
import HeroSection     from '../components/landing/HeroSection'
import PartnersSection from '../components/landing/PartnersSection'
import FeaturesSection from '../components/landing/FeaturesSection'
import WhySection      from '../components/landing/WhySection'
import CTASection      from '../components/landing/CTASection'
import LandingFooter   from '../components/landing/LandingFooter'

const LandingPage = () => (
  <div className="min-h-screen bg-white flex flex-col">
    <Navbar />
    <HeroSection />
    <PartnersSection />
    <FeaturesSection />
    <WhySection />
    <CTASection />
    <LandingFooter />
  </div>
)

export default LandingPage
