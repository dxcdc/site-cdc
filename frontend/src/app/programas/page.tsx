"use client"
import Footer from '@/components/molecules/Footer'
import HeaderBannerUnique from '@/components/templates/HeaderBannerUnique'
import Programas from '@/features/programas'
import { useBannerQuery } from '@/clients/api/banners'
import { resolveMediaUrl } from '@/lib/media'
import { TypeBannerUnique } from '@/components/atoms/Banner/unique'
import GoogleAnalytics from '@/components/GoogleAnalytics'

export default function ProgramasPage() {
  const { data } = useBannerQuery("programas")

  const Banner: TypeBannerUnique = {
    id: data?.[0]?.id,
    title: data?.[0]?.titulo,
    highlight: data?.[0]?.subtitulo,
    image: resolveMediaUrl(data?.[0]?.url_img),
  }

  return (
    <>
      <GoogleAnalytics />
      <HeaderBannerUnique noneMobile Banner={Banner} />
      <Programas />
      <Footer />
    </>
  )
}
