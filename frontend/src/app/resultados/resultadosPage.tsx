'use client'

import { useBannerQuery } from '@/clients/api/banners'
import { getPesquisasList, IPesquisa, usePesquisaQuery } from '@/clients/api/pesquisa'
import ZoomOutOnView from '@/components/animations/zoomOutOnView'
import { TypeBannerUnique } from '@/components/atoms/Banner/unique'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import Footer from '@/components/molecules/Footer'
import ListCards from '@/components/molecules/ListCards'
import MenuAreasWithSearchInput from '@/components/molecules/MenuAreaWithSearchInput'
import HeaderBannerUnique from '@/components/templates/HeaderBannerUnique'
import { resolveMediaUrl } from '@/lib/media'
import { CircularProgress, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function ResultadosPage() {
  const { data: dataBanner } = useBannerQuery("resultados")

  const Banner: TypeBannerUnique = {
    id: dataBanner?.[0]?.id,
    title: dataBanner?.[0]?.titulo,
    image: resolveMediaUrl(dataBanner?.[0]?.url_img),
  }

  const searchParams = useSearchParams()
  const termoDePesquisa = searchParams.get('pesquisa')
  const { data, isLoading: isLoadingPesquisa } = usePesquisaQuery(termoDePesquisa)
  const [fieldSearch, setFieldSearch] = useState('')
  const [areaSelect, setAreaSelect] = useState<string[]>([])
  const [listPesquisas, setListPesquisas] = useState<IPesquisa[]>([])
  const [areasFiltro, setAreasFiltro] = useState<{ id: number, nome: string }[]>([])

  const onSearch = async () => {
    if (fieldSearch !== '') {
      const { data, areas_filtro } = await getPesquisasList(fieldSearch.toLowerCase())
      setListPesquisas(data)
      setAreasFiltro(areas_filtro)
    }
  }

  useEffect(() => {
    if (data?.data && areaSelect.length > 0) {
      const filtradas = data.data.filter((noticia: IPesquisa) =>
        noticia.areas?.some(area => areaSelect.includes(area.nome))
      )
      setListPesquisas(filtradas)
    } else if (data?.data) {
      setListPesquisas(data.data)
    }
  }, [areaSelect, data])

  useEffect(() => {
    if (data) {
      setListPesquisas(data.data)
      setAreasFiltro(data.areas_filtro)
    }
  }, [data])

  return (
    <>
      <GoogleAnalytics />
      <HeaderBannerUnique noneMobile Banner={Banner} />
      <Box
        p={{ xs: '32px 16px 32px 16px', md: '40px 32px 160px 32px' }}
        display="flex"
        flexDirection="column"
        gap={{ xs: '32px', md: '24px' }}
        bgcolor="background.default"
        overflow="hidden"
        width="100%"
        maxWidth="100vw"
      >
        <ZoomOutOnView>
          <Box display="flex" gap="24px" alignItems="center">
            <MenuAreasWithSearchInput
              valueInput={fieldSearch}
              setValueInput={setFieldSearch}
              areaSelect={areaSelect}
              setAreaSelect={setAreaSelect}
              listAreasAvailable={areasFiltro}
              onSearch={onSearch}
            />
          </Box>
        </ZoomOutOnView>
        {isLoadingPesquisa ? (
          <Box width={"100%"} display={"flex"} justifyContent={"center"}>
            <CircularProgress size={100} />
          </Box>
        ) : (
          listPesquisas.length ? (
            <ListCards page="/resultados" list={listPesquisas} />
          ) : (
            <Typography variant="h3" lineHeight={'120%'} textAlign={'center'}>
              NÃ£o foram encontrados resultados para essa pesquisa.
            </Typography>
          )
        )}

      </Box>
      <Footer />
    </>
  )
}
