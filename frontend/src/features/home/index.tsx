"use client"
import Image from 'next/image'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import ImagesRounded from '@/components/atoms/ImagesRounded'
import OrganicShapeScircle from '../../assets/background-elements/organic-shape-circle.svg'
import VectorRoundedLines from '../../assets/background-elements/vector-rounded-lines.svg'
import CardInformation from '@/components/molecules/CardInformation'
import MissionImage from '../../assets/cards-information/mission.svg'
import VisionImage from '../../assets/cards-information/vision.svg'
import AccordionProjects from '@/components/molecules/AccordionProjects'
import Partners from '@/components/atoms/Partners'
import LatestNews from '@/components/molecules/LastestNews'
import AnimationSplitText from '@/components/animations/splitText'
import AnimetedSlide from '@/components/animations/slide'
import { useCardsInformativosListQuery } from '@/clients/api/cards-informativos'
import { resolveMediaUrl } from '@/lib/media'
import Indicadores from './Indicadores'
import { useOrganizacaoListQuery } from '@/clients/api/organizacao'
import { useNoticiasListQuery } from '@/clients/api/noticias'
import { useConteudoSecaoQuery } from '@/clients/api/conteudo-secao'
import SanitizedHtmlBox from '@/utils/stripHtmlTags'

export default function HomePage() {
  const { data: cardOption } = useCardsInformativosListQuery()
  const { data: cardsOrganizacao } = useOrganizacaoListQuery()
  const { data: noticiasResponse } = useNoticiasListQuery()
  const cardVisao = cardOption?.find(item => item.titulo === "Visão")
  const cardMissao = cardOption?.find(item => item.titulo === "Missão")
  const { data: programsSectionInfo } = useConteudoSecaoQuery("entrada-programas")

  const cardOptions = [
    {
      id: 0,
      image: cardMissao?.url_imagem ? resolveMediaUrl(cardMissao?.url_imagem) : MissionImage,
      title: cardMissao?.titulo,
      description: cardMissao?.descricao
    },
    {
      id: 1,
      image: cardVisao?.url_imagem ? resolveMediaUrl(cardVisao?.url_imagem) : VisionImage,
      title: cardVisao?.titulo,
      description: cardVisao?.descricao
    },
  ]

  return (
    <>
      {cardsOrganizacao?.map(card => (
        <Box
          key={card.id}
          width="100%"
          display="flex"
          flexDirection={{
            xs: 'column',
            md: 'row',
          }}
          justifyContent="space-between"
          gap={{
            xs: '56px',
            lg: '20px',
          }}
          padding={{
            xs: '32px 16px ',
            lg: '32px',
          }}
          position="relative"
          mt="48px"
        >
          <Box
            width={{
              xs: '100%',
              md: '50%',
            }}
          >
            <AnimationSplitText>
              <Typography variant="h3" color="primary" pb="16px">
                {card.titulo}
              </Typography>
            </AnimationSplitText>
            <SanitizedHtmlBox html={card.descricao} />
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            gap="24px"
            width={{
              xs: '100%',
              md: '50%',
            }}
          >
            <AnimetedSlide distance={100} tension={10} friction={5} threshold={0.8}>
              <Box width="100%" height="172px">
                <ImagesRounded url={resolveMediaUrl(card.imagens[0]) ?? ''} />
              </Box>
            </AnimetedSlide>
            <AnimetedSlide distance={100} tension={10} friction={5} threshold={0.8}>
              <Box
                width="100%"
                display="flex"
                justifyContent="space-between"
                gap="24px"
                height="172px"
              >
                <ImagesRounded url={resolveMediaUrl(card.imagens[1]) ?? ''} />
                <ImagesRounded url={resolveMediaUrl(card.imagens[2]) ?? ''} />
              </Box>
            </AnimetedSlide>
          </Box>
          <Box
            position="absolute"
            right={0}
            zIndex={-1}
            mr="40px"
            display={{
              xs: 'none',
              md: 'block',
            }}
          >
            <AnimetedSlide distance={100} tension={10} friction={5} threshold={0.8}>
              <Image src={OrganicShapeScircle} alt="organic shape" />
            </AnimetedSlide>
          </Box>

          <Box
            position="absolute"
            left={0}
            bottom={0}
            mb={-30}
            zIndex={-1}
            display={{
              xs: 'none',
              md: 'block',
            }}
          >
            <Image src={VectorRoundedLines} alt="vector rounded lines" />
          </Box>
        </Box>
      ))}
      <Box
        pt={{ xs: '40px', md: '80px' }}
        pb="40px"
        flexDirection={{ xs: 'column', md: 'row' }}
        display="flex"
        justifyContent="space-between"
        gap="24px"
        px={{ xs: '16px', md: '24px' }}
      >
        {cardOptions.map((item) => (
          <Box width={{ xs: '100%', md: '50%' }} key={item.id}>
            <AnimetedSlide distance={100} tension={10} friction={5} threshold={0.5}>
              <CardInformation item={item} />
            </AnimetedSlide>
          </Box>
        ))}
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        px={{ xs: '16px', md: '32px' }}
        gap="16px"
        pb="24px"
        mt="48px"
        alignItems="center"
      >
        <AnimationSplitText >
          <Typography
            variant="h3"
            color="primary"
            textAlign="center"
            lineHeight="120%"
          >
            {programsSectionInfo?.[0].titulo ?? "Na luta para o fortalecimento democrático e cidadão pela redução das desigualdades."}
          </Typography>
        </AnimationSplitText>
        <AnimationSplitText initialFontWeight={500}>
          <Typography
            variant="overline"
            color="text.primary"
            textTransform="none"
            lineHeight="150%"
            textAlign="center"
          >
            {programsSectionInfo?.[0].resumo ?? "Atuamos por meio de programas para desenvolver ações para fortalecimento cidadão na luta pela redução das desigualdades."}
          </Typography>
        </AnimationSplitText>
      </Box>
      <AccordionProjects />
      <Partners />
      <Indicadores />
      <LatestNews listNoticia={noticiasResponse?.data} />
    </>
  )
}
