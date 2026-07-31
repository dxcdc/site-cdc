'use client'
import Footer from '@/components/molecules/Footer'
import HeaderBannerUnique from '@/components/templates/HeaderBannerUnique'
import { useParams, useRouter } from 'next/navigation'
import { INoticias, useNoticiaQuery, useNoticiasAreaQuery } from '@/clients/api/noticias'
import { Box, Grid, Typography, useTheme } from '@mui/material'
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'
import CardTagDesc from '@/components/atoms/CardTagDesc'
import AnimetedSlide from '@/components/animations/slide'
import { resolveMediaUrl } from '@/lib/media'
import SanitizedHtmlBox from '@/utils/stripHtmlTags'
import GoogleAnalytics from '@/components/GoogleAnalytics'

dayjs.locale('pt-br')

export default function NoticiasUniquePage() {
  const { id } = useParams()
  const { data } = useNoticiaQuery(id)
  const idsArea = data?.areas?.map((item) => item.id).join(',');
  const { data: listNoticias } = useNoticiasAreaQuery({ area_id: idsArea })
  const { palette: { primary: { main } } } = useTheme()
  const { push } = useRouter()

  const dataFormatada = dayjs(data?.data_publicacao).format('D [de] MMMM [de] YYYY')

  const Banner = {
    id: 1,
    title: data?.titulo,
    image: resolveMediaUrl(data?.imagem_capa),
  }

  return (
    <>
      <GoogleAnalytics />
      <HeaderBannerUnique noneMobile Banner={Banner} />
      {data?.html_original && (
        <Box width={'100%'} display='flex' justifyContent={'center'} maxWidth={"100vw"}>
          <Box width={'100%'} maxWidth={'800px'} p='16px'>
            <Box display={"flex"} gap="16px" pt={{ xs: "0px", md: "20px" }} pb="16px">
              <Typography variant='body1' color="text.secondary" fontWeight={400}>
                {dataFormatada}
              </Typography>
              <Typography variant='body1' color="text.secondary" fontWeight={400}>
                {data?.tempo_leitura} min de leitura
              </Typography>
              {data?.areas?.map(area => (
                <Typography key={area.id} variant='body1' display={{ xs: "none", sm: "none", md: "block" }} color="text.secondary" fontWeight={400}>
                  {area.nome}
                </Typography>
              ))}
            </Box>
            <SanitizedHtmlBox html={data.html_original} />
            <Box
              pt="64px"
            >
              <AnimetedSlide>
                <Typography
                  variant={"h4"}
                  color="primary"
                  textTransform="none"
                >
                  Leia também
                </Typography>
              </AnimetedSlide>
              <Grid container spacing={2} pb={{ xs: "50px", md: "160px" }} pt="16px" >
                {data.html_original && listNoticias?.data?.slice(0, 3).map((item: INoticias) => (
                  <Grid item key={item.id} xs={12} sm={6} md={4} lg={4}>
                    <AnimetedSlide>
                      <Box
                        sx={{
                          cursor: 'pointer', '&:hover': {
                            span: {
                              color: `${main} !important`
                            }
                          }
                        }}
                        onClick={() => push(`/noticias/${item.id}`)}
                      >
                        <CardTagDesc
                          info={{
                            id: item.id,
                            description: item.titulo,
                            image: item.imagem_capa
                          }}
                          leiaTambem
                        />
                      </Box>
                    </AnimetedSlide>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Box>
        </Box>
      )}
      <Footer />
    </>
  )
}
