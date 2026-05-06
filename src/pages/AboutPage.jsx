import Navbar         from '../components/landing/Navbar'
import LandingFooter  from '../components/landing/LandingFooter'
import AboutHero      from '../components/about/AboutHero'
import AboutWhy       from '../components/about/AboutWhy'
import GlobalStandards from '../components/about/GlobalStandards'
import AboutStory     from '../components/about/AboutStory'
import AboutCTA       from '../components/about/AboutCTA'

const AboutPage = () => (
  <div className="min-h-screen bg-white flex flex-col">
    <Navbar />
    <AboutHero />
    <AboutWhy />
    <GlobalStandards />
    <AboutStory />
    <AboutCTA />
    <LandingFooter />
  </div>
)

export default AboutPage
