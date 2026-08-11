'use client'

import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import CardTagDesc from '@/components/atoms/CardTagDesc'
import AnimationSplitText from '@/components/animations/splitText'
import { ITransparencia, ITransparenciaResponse } from '@/clients/api/transparencia'
import { useTheme } from '@mui/material'
import ZoomOutOnView from '@/components/animations/zoomOutOnView'
import { IConteudoSecao } from '@/clients/api/conteudo-secao'

export default function Transparency({ listTransparencia, sectionInfo }: { listTransparencia?: ITransparenciaResponse, sectionInfo?: IConteudoSecao }) {
  const { palette: { primary: { main } } } = useTheme()

  return (
    <Box overflow={"hidden"} width={"100%"} maxWidth={"100vw"}>
      {listTransparencia?.data && (
        <Box display="flex" flexDirection="column" gap="16px" pb="24px" id="transparencia">
          <AnimationSplitText direction='down'>
            <Typography variant="h3" color="primary" width="100%">
              {sectionInfo?.titulo ?? "Transparência"}
            </Typography>
          </AnimationSplitText>
          <AnimationSplitText initialFontWeight={500}>
            <Typography
              variant="overline"
              textTransform="none"
              color="text.primary"
              lineHeight="150%"
              maxWidth="600px"
            >
              {sectionInfo?.resumo ?? "O CDC conta com um time especializado para garantir o sucesso das ações e efetivar transformações sociais significativas."}
            </Typography>
          </AnimationSplitText>
        </Box>
      )}
      <Grid container spacing={4} pb="64px" >
        {listTransparencia?.data?.map((item: ITransparencia) => (
          <Grid item key={item.id} xs={12} sm={6} md={4} lg={3}>
            <ZoomOutOnView delay={200} scaleFrom={1.3}>
              <Box
                component={'a'}
                sx={{
                  cursor: 'pointer', '&:hover': {
                    span: {
                      color: `${main} !important`
                    }
                  }
                }}
                href={item.documento_url}
                target='_blank'
              >
                <CardTagDesc
                  info={{
                    id: item.id,
                    areas: item.areas,
                    description: item.titulo,
                    image: item.url_imagem
                  }}
                  transparency
                />
              </Box>
            </ZoomOutOnView>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
