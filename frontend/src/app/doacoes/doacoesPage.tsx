"use client"
import { useBannerQuery } from '@/clients/api/banners'
import { TypeBannerUnique } from '@/components/atoms/Banner/unique'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import Footer from '@/components/molecules/Footer'
import HeaderBannerUnique from '@/components/templates/HeaderBannerUnique'
import { resolveMediaUrl } from '@/lib/media'
import Doacoes from '@/features/doacoes'

export default function DoacoesPage() {
  const { data } = useBannerQuery("doacao")

  const Banner: TypeBannerUnique = {
    id: data?.[0]?.id,
    title: data?.[0]?.titulo,
    image: resolveMediaUrl(data?.[0]?.url_img),
  }

  return (
    <>
      <GoogleAnalytics />
      <HeaderBannerUnique Banner={Banner} />
      <Doacoes />
      <Footer />
    </>
  )
}
