import HomePage from '@/features/home'
import HeaderBanner from '@/components/templates/HeaderBanner'
import Footer from '@/components/molecules/Footer'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import DiagnosticButton from '@/components/atoms/DiagnosticButton'

export default function Home() {
  return (
    <>
      <GoogleAnalytics />
      <HeaderBanner />
      <HomePage />
      <DiagnosticButton />
      <Footer />
    </>
  )
}
