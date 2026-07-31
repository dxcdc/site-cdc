'use client'
import { useDadosBancariosQuery } from '@/clients/api/dados-bancarios'
import AnimatedContent from '@/components/animations/slide/AnimatedContent'
import AnimationSplitText from '@/components/animations/splitText'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import React from 'react'
import { resolveMediaUrl } from '@/lib/media'
import { useTheme } from '@mui/material'
import { useConteudoSecaoQuery } from '@/clients/api/conteudo-secao'

export default function Doacoes() {
  const { data } = useDadosBancariosQuery()
  const { data: dataConteudoSecao } = useConteudoSecaoQuery("doacao")
  const { palette: { background } } = useTheme()

  return (
    <Box
      width="100%"
      p={{ xs: '40px 11px 100px 11px', md: '40px 16px 100px 16px' }}
      display="flex"
      flexDirection="column"
      alignItems={'center'}
      gap="16px"
    >
      <AnimationSplitText >
        <Typography
          variant="h3"
          color={'primary'}
          textAlign={'center'}
          lineHeight={'120%'}
        >
          {dataConteudoSecao?.[0]?.titulo}
        </Typography>
      </AnimationSplitText>
      <AnimationSplitText initialFontWeight={500}>
        <Typography
          variant="overline"
          textTransform="none"
          color={'text.primary'}
          textAlign={'center'}
          lineHeight={'120%'}
          maxWidth="900px"
        >
          {dataConteudoSecao?.[0]?.resumo}
        </Typography>
      </AnimationSplitText>
      {data?.map((item) => (
        <AnimatedContent reverse key={item.id}>
          <Box mt='40px' width={'100%'} display={'flex'} alignItems={'center'} flexDirection={'column'}>
            <Box
              p="32px"
              display="flex"
              flexDirection="column"
              alignItems={'center'}
              bgcolor={background.paper}
              gap="24px"
              width="100%"
              maxWidth={'800px'}
              justifyContent={'center'}
            >
              <Box
                width={96}
                height={96}
                sx={{
                  backgroundImage: `url("${resolveMediaUrl(item?.url_imagem)}")`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }}
              />
              <Typography
                variant="h4"
                color={'text.primary'}
                textAlign={'center'}
                lineHeight={'120%'}
                py='16px'
              >
                {item.chave_pix ?? "Aguardando informações..."}
              </Typography>
              <Box display={'flex'} flexDirection={'column'} alignItems={'center'}>
                <Typography variant='overline' textTransform={'none'} lineHeight={'150%'}>Conta Corrente: {item.banco}</Typography>
                <Typography variant='overline' textTransform={'none'} lineHeight={'150%'}>Agência: {item.agencia}</Typography>
                <Typography variant='overline' textTransform={'none'} lineHeight={'150%'}>Titular da conta: {item.titular_conta}</Typography>
              </Box>
            </Box>
          </Box>
        </AnimatedContent>
      ))}
    </Box>
  )
}
