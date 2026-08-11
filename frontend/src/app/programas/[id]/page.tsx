'use client'
import Footer from '@/components/molecules/Footer'
import HeaderBannerUnique from '@/components/templates/HeaderBannerUnique'
import { useParams } from 'next/navigation'
import Box from '@mui/material/Box'
import { useProgramaQuery } from '@/clients/api/programas'
import LatestNews from '@/components/molecules/LastestNews'
import Transparency from '@/features/institucional/Transparency'
import { resolveMediaUrl, resolveMediaUrlOrFallback } from '@/lib/media'
import Typography from '@mui/material/Typography'
import { useTransparenciaAreaQuery } from '@/clients/api/transparencia'
import { useNoticiasAreaQuery } from '@/clients/api/noticias'
import Grid from '@mui/material/Grid'
import VectorRoundedLines from '@/components/atoms/VectorRoundedLines'
import SanitizedHtmlBox from '@/utils/stripHtmlTags'
import { useConteudoSecaoQuery } from '@/clients/api/conteudo-secao'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import { useEffect } from 'react'

export default function ProgramaUniquePage() {
  const { id } = useParams()
  const { data } = useProgramaQuery(id)
  const idsArea = data?.areas?.map((item) => item.id).join(',');
  const { data: listTransparencia } = useTransparenciaAreaQuery({ area_id: idsArea })
  const { data: listNoticias } = useNoticiasAreaQuery({ area_id: idsArea })
  const listImagePrograms = data?.imagens
  const { data: transparencySectionInfo } = useConteudoSecaoQuery("transparencia")

  useEffect(() => {
    if (data?.titulo) document.title = `${data.titulo} | CDC`
  }, [data?.titulo])

  const Banner = {
    id: 1,
    title: data?.titulo,
    image: resolveMediaUrl(data?.url_image_capa),
    highlight: data?.subtitulo
  }

  return (
    <>
      <GoogleAnalytics />
      <HeaderBannerUnique noneMobile Banner={Banner} />
      {data?.descricao && (
        <Box width={'100%'} maxWidth={'100vw'} display='flex' justifyContent={'center'}>
          <VectorRoundedLines left={0} margin="300px 0px 0px 0px" />
          <Grid
            container
            rowSpacing="24px"
            columnSpacing="24px"
            width={"100%"}
            p={{ xs: '32px 6px', sm: "40px 6px", md: "40px 10px" }}
          >
            <Grid item xs={12} sm={12} md={6}>
              <Box width="100%">
                <Typography variant='h3' color="primary" pb="16px">
                  Sobre o programa
                </Typography>
                <SanitizedHtmlBox html={data?.descricao} />
              </Box>
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <Box
                width="100%"
                height="100%"
                borderRadius="32px"
                sx={{
                  bgcolor: 'gray',
                  backgroundImage: `url("${resolveMediaUrlOrFallback(listImagePrograms?.[0]?.url_imagem)}")`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                }}
              />
            </Grid>
            {listImagePrograms?.slice(1).map((image) => (
              <Grid
                item
                key={image.id}
                xs={12}
                sm={6}
                md={6}
                height={{ xs: "155px", sm: "300px", md: "330px" }}
              >
                <Box
                  height="100%"
                  width="100%"
                  bgcolor="gray"
                  display="flex"
                  justifyContent="flex-end"
                  borderRadius="32px"
                  sx={{
                    backgroundImage: `url("${resolveMediaUrlOrFallback(image.url_imagem)}")`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </Box >
      )}
      <LatestNews listNoticia={listNoticias?.data} programa />
      {data?.areas.length && listTransparencia?.data?.length ? (
        <Box px={{ xs: '16px', md: '32px' }} mt="64px" pb={{ xs: '80px', md: '160px' }} width="100%" maxWidth={"100vw"}>
          <Transparency sectionInfo={transparencySectionInfo?.[0]} listTransparencia={listTransparencia} />
        </Box>
      ) : ""}
      <Footer />
    </>
  )
}
