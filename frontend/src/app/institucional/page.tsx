"use client"
import Footer from '@/components/molecules/Footer'
import InstitucionalPage from '@/features/institucional'
import HeaderBannerUnique from '@/components/templates/HeaderBannerUnique'
import { TypeBannerUnique } from '@/components/atoms/Banner/unique'
import { useBannerQuery } from '@/clients/api/banners'
import { resolveMediaUrl } from '@/lib/media'
import GoogleAnalytics from '@/components/GoogleAnalytics'

export default function Institucional() {
  const { data } = useBannerQuery("institucional")

  const Banner: TypeBannerUnique = {
    id: data?.[0]?.id,
    title: data?.[0]?.titulo,
    image: resolveMediaUrl(data?.[0]?.url_img),
  }

  return (
    <>
      <GoogleAnalytics />
      <HeaderBannerUnique Banner={Banner} />
      <InstitucionalPage />
      <Footer />
    </>
  )
}
