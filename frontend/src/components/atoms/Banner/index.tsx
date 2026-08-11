'use client'
import React, { useCallback, useEffect, useState } from 'react'
import { useTheme } from '@mui/material'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ButtonAction from '../ButtonAction'
import CircleIcon from '@mui/icons-material/Circle'
import { useRouter } from 'next/navigation'
import { resolveMediaUrlOrFallback } from '@/lib/media'
import { INoticiasResponse } from '@/clients/api/noticias'
import AnimationSplitText from '@/components/animations/splitText'

export default function Banner({ data }: { data?: INoticiasResponse }) {
  const { push } = useRouter()
  const {
    palette: { secondary, background },
  } = useTheme()
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [resetTimer, setResetTimer] = useState<boolean>(false)
  const sliceNoticias = data?.data?.slice(0, 3)

  //É ESQUISITO MAS NÃO TROQUE, PODE SURGIR MUDANÇA DA FONTE DA NOTICIA
  const BannerOption = [
    {
      id: sliceNoticias?.[0].id,
      title: sliceNoticias?.[0].titulo,
      image: sliceNoticias?.[0].imagem_capa,
      link: `noticias/${sliceNoticias?.[0].id}`,
      highlight: ""
    },
    {
      id: sliceNoticias?.[1].id,
      title: sliceNoticias?.[1].titulo,
      image: sliceNoticias?.[1].imagem_capa,
      link: `noticias/${sliceNoticias?.[1].id}`,
      highlight: ""
    },
    {
      id: sliceNoticias?.[2].id,
      title: sliceNoticias?.[2].titulo,
      image: sliceNoticias?.[2].imagem_capa,
      link: `noticias/${sliceNoticias?.[2].id}`,
      highlight: ""
    },
  ].filter((banner) => banner.id && banner.title)

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? BannerOption.length - 1 : prevIndex - 1
    )
    setResetTimer((prev) => !prev)
  }

  const handleNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % BannerOption.length)
    setResetTimer((prev) => !prev)
  }, [BannerOption.length])

  const handleDotClick = (index: number) => {
    setCurrentIndex(index)
    setResetTimer((prev) => !prev)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext()
    }, 6000)

    return () => clearInterval(interval)
  }, [handleNext, resetTimer])

  return (
    <Box
      width="100vw"
      height="100%"
      sx={{
        backgroundColor: background.default,
        borderRadius: '0 0 16px 16px',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <Box
        display="flex"
        width={`${BannerOption?.length * 100}vw`}
        height="100%"
        sx={{
          transition: 'transform 0.5s ease-in-out',
          transform: `translateX(-${currentIndex * 100}vw)`,
        }}
      >
        {BannerOption?.map((banner, index) => (
          <Box
            key={banner.id}
            width="100vw"
            height="100%"
            sx={{
              backgroundImage: `
                linear-gradient(rgba(0, 0, 0, 0.68), rgba(0, 0, 0, 0.58)),
                url("${resolveMediaUrlOrFallback(banner?.image)}")
              `,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexShrink: 0,
            }}
          >
            <Box
              display={{ xs: 'none', lg: 'flex' }}
              alignItems="center"
              justifyContent="center"
              height="100%"
              paddingX="30px"
              sx={{
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: '#0000008d',
                },
              }}
              onClick={handlePrev}
            >
              <ArrowBackIosNewIcon fontSize="large" htmlColor="#F6F6F699" />
            </Box>

            <Box
              display="flex"
              flexDirection="column"
              gap="24px"
              px={{ xs: '24px', sm: '50px' }}
              mb="80px"
              alignItems="flex-start"
              width="100%"
            >
              <AnimationSplitText initialFontWeight={700} delay={0} threshold={0}>
                <Typography
                  component={index === currentIndex ? 'h1' : 'h2'}
                  maxWidth="790px"
                  lineHeight="120%"
                  fontSize={{ xs: '30px', sm: '40px', lg: '48px' }}
                  color="#fff"
                >
                  {banner?.title}
                </Typography>
              </AnimationSplitText>

              <Box>
                <ButtonAction
                  onClick={() => push(banner?.link)}
                  endIcon={
                    <ArrowForwardIosIcon
                      sx={{ height: '14px', width: '20px' }}
                    />
                  }
                >
                  Leia mais
                </ButtonAction>
              </Box>
            </Box>

            <Box
              display={{ xs: 'none', lg: 'flex' }}
              alignItems="center"
              justifyContent="center"
              height="100%"
              paddingX="30px"
              sx={{
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: '#0000008d',
                },
              }}
              onClick={handleNext}
            >
              <ArrowForwardIosIcon fontSize="large" htmlColor="#F6F6F699" />
            </Box>
          </Box>
        ))}
      </Box>
      <Box
        position="absolute"
        bottom={20}
        left="50%"
        sx={{ display: 'flex', gap: '8px', transform: 'translateX(-50%)' }}
      >
        {BannerOption?.map((banner, index) => (
          <CircleIcon
            key={banner.id}
            onClick={() => handleDotClick(index)}
            sx={{
              width: '10px',
              color: index === currentIndex ? secondary?.light : '#ccc',
              transition: 'color 0.3s ease-in-out',
              cursor: 'pointer',
            }}
          />
        ))}
      </Box>
    </Box>
  )
}
