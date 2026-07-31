'use client'
import React from 'react'
import ImagesRounded from '@/components/atoms/ImagesRounded'
import { useTheme } from '@mui/material'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Circle from '@/components/atoms/Circle'
import AnimationSplitText from '@/components/animations/splitText'
import AnimetedSlide from '@/components/animations/slide'
import AnimatedFade from '@/components/animations/fade'
import { ILinhaTempo } from '@/clients/api/linha-tempo'
import { resolveMediaUrl } from '@/lib/media'
import { sanitizeHtml } from '@/utils/scriptHtmlSanitize'

export default function Timeline({ listTimeLine }: { listTimeLine?: ILinhaTempo[] }) {
  const {
    palette: {
      secondary: { light },
    },
  } = useTheme()

  return listTimeLine?.map((item: ILinhaTempo, index: number) => (
    <Box
      display="flex"
      width="100%"
      gap={{ xs: '24px', lg: '32px' }}
      justifyContent="space-between"
      key={item.id}
      flexDirection={{
        xs: 'row-reverse',
        lg: index % 2 ? 'row-reverse' : 'row',
      }}
      id='timeline'
    >
      <Box
        width={{ xs: '100%', lg: '45%' }}
        display="flex"
        flexDirection="column"
        gap="16px"
        pb={item?.conteudo?.length < 130 ? "54px" : "32px"}
      >
        <AnimationSplitText>
          <Typography variant="h5" color="text.primary">
            {item.titulo}
          </Typography>
        </AnimationSplitText>
        <AnimetedSlide>
          <Typography
            variant="overline"
            textTransform="none"
            color="text.primary"
            lineHeight="150%"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(item?.conteudo || '') }}
          />
        </AnimetedSlide>
        <Box display="flex" flexDirection="column" gap="24px" width="100%">
          {item.imagens[0] && (
            <AnimetedSlide>
              <Box width="100%" height="172px">
                <ImagesRounded url={resolveMediaUrl(item.imagens[0]) ?? ''} />
              </Box>
            </AnimetedSlide>
          )}
          {item.imagens[1] && (
            <AnimetedSlide>
              <Box
                width="100%"
                display="flex"
                justifyContent="space-between"
                gap="24px"
                height="172px"
              >
                <ImagesRounded url={resolveMediaUrl(item.imagens[1]) ?? ''} />
                <ImagesRounded url={resolveMediaUrl(item.imagens[2]) ?? ''} />
              </Box>
            </AnimetedSlide>
          )}
        </Box>
      </Box>
      <Box
        width={{ xs: '140px', lg: '10%' }}
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <AnimatedFade duration={1000} easing="ease-out" initialOpacity={0}>
          <Circle color={light}>
            <Typography variant="h5" color="text.primary" fontWeight={400}>
              {item.ano}
            </Typography>
          </Circle>
        </AnimatedFade>
        <Box
          width="1.35px"
          height="100%"
          bgcolor={listTimeLine.length === index + 1 ? 'transparent' : light}
        />
      </Box>
      <Box
        display={{ xs: 'none', lg: 'block' }}
        width="45%"
        height="100%"
      />
    </Box>
  ))
}
