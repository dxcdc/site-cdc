import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import React, { useMemo } from 'react'
import DirectorImage from '../../../assets/cards-information/institutional-board.svg'
import CoordinatorImage from '../../../assets/cards-information/institutional-coordinator.svg'
import AssemblyImage from '../../../assets/cards-information/general-assembly.svg'
import AuditImage from '../../../assets/cards-information/audit-committee.svg'
import ProgramImage from '../../../assets/cards-information/program-coordination.svg'
import CardInformation from '@/components/molecules/CardInformation'
import AnimationSplitText from '@/components/animations/splitText'
import AnimetedSlide from '@/components/animations/slide'
import { ICardsInfo } from '@/clients/api/cards-informativos'
import { IConteudoSecao } from '@/clients/api/conteudo-secao'

export default function OrganizationCdcCards({ listCards, sectionInfo }: { listCards?: ICardsInfo[], sectionInfo?: IConteudoSecao }) {

  const cardsMap = useMemo(() => {
    const map: Record<string, { titulo: string; descricao: string }> = {}

    listCards?.forEach((item) => {
      map[item.titulo] = item
    })

    return map
  }, [listCards])

  const cardOptions = useMemo(() => [
    {
      image: DirectorImage,
      titulo: 'Diretoria Institucional',
      xs: 12, md: 6, lg: 6,
    },
    {
      image: CoordinatorImage,
      titulo: 'Coordenação Institucional',
      xs: 12, md: 6, lg: 6,
    },
    {
      image: AssemblyImage,
      titulo: 'Assembleia Geral',
      xs: 12, md: 6, lg: 4,
    },
    {
      image: AuditImage,
      titulo: 'Conselho Fiscal',
      xs: 12, md: 6, lg: 4,
    },
    {
      image: ProgramImage,
      titulo: 'Coordenação de Projetos e Programas',
      xs: 12, md: 12, lg: 4,
    },
  ].map(({ titulo, image, ...sizes }) => {
    const data = cardsMap[titulo]
    return {
      image,
      title: data?.titulo ?? `Título ainda não cadastrado para (${titulo})`,
      description: data?.descricao ?? `Descrição ainda não cadastrada para (${titulo})`,
      ...sizes,
    }
  }), [cardsMap])

  return (
    <>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap="16px"
        pt="90px"
        pb="32px"
      >
        <AnimationSplitText>
          <Typography
            variant="h3"
            color="primary"
            textAlign="center"
            width="100%"
            id='organizacao'
            fontSize={{ xs: '35px', md: '1.94rem' }}
          >
            {sectionInfo?.titulo}
          </Typography>
        </AnimationSplitText>
        <AnimationSplitText initialFontWeight={500}>
          <Typography
            variant="overline"
            textAlign="center"
            textTransform="none"
            color="text.primary"
            lineHeight="150%"
            maxWidth="650px"
          >
            {sectionInfo?.resumo ??
              "O Centro de Desenvolvimento e Cidadania tem uma estrutura estabelecida para garantir confiança e transparência nas decisões tomadas pela ONG."}
          </Typography>
        </AnimationSplitText>
      </Box>
      <Grid container spacing={2} pb={{ xs: '40px', md: '96px' }}>
        {cardOptions.map((item) => (
          <Grid item key={item.title} xs={item.xs} md={item.md} lg={item.lg}>
            <AnimetedSlide>
              <CardInformation item={item} />
            </AnimetedSlide>
          </Grid>
        ))}
      </Grid>
    </>
  )
}
