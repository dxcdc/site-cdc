"use client"
import Footer from '@/components/molecules/Footer'
import ContatoPage from '@/features/contato'
import HeaderBannerUnique from '@/components/templates/HeaderBannerUnique'
import { useBannerQuery } from '@/clients/api/banners'
import { resolveMediaUrl } from '@/lib/media'
import { TypeBannerUnique } from '@/components/atoms/Banner/unique'
import GoogleAnalytics from '@/components/GoogleAnalytics'

export default function Contato() {
  const { data } = useBannerQuery("contato")

  const Banner: TypeBannerUnique = {
    id: data?.[0]?.id,
    title: data?.[0]?.titulo,
    image: resolveMediaUrl(data?.[0]?.url_img),
  }

  return (
    <>
      <GoogleAnalytics />
      <HeaderBannerUnique Banner={Banner} />
      <ContatoPage />
      <Footer />
    </>
  )
}
