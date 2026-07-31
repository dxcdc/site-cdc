'use client'
import HeaderBannerUnique from '@/components/templates/HeaderBannerUnique'
import React from 'react'
import { useParams } from 'next/navigation'
import VacancyDescription from './vacancyDescription'
import Box from '@mui/material/Box'
import FormEnrollment from './formEnrollment'
import { useOportunidadeQuery } from '@/clients/api/oportunidades'
import VectorRoundedLines from '@/components/atoms/VectorRoundedLines'
import { useBannerQuery } from '@/clients/api/banners'
import { resolveMediaUrl } from '@/lib/media'

export default function TrabalheConoscoVagaPage() {
  const { id } = useParams()
  const { data } = useOportunidadeQuery(id)
  const { data: dataBanner } = useBannerQuery("trabalhe_conosco")

  const Banner = {
    id: dataBanner?.[0]?.id,
    title: data?.titulo,
    image: `${resolveMediaUrl(dataBanner?.[0]?.url_img)}`,
  }

  return (
    <>
      <HeaderBannerUnique Banner={Banner} />
      <Box
        width="100%"
        px="16px"
        pt={{ lg: '60px', md: '40px', xs: '16px' }}
        display="flex"
        flexDirection={'column'}
        alignItems="center"
      >
        <VectorRoundedLines left={0} margin='10% 0 0 0' />
        <Box maxWidth="802px">
          <VacancyDescription
            description={data?.descricao}
          />
          <FormEnrollment tituloVaga={data?.titulo} />
        </Box>
      </Box>
    </>
  )
}
