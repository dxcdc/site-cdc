'use client'
import React, { useCallback } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import AddIcon from '@mui/icons-material/Add'
import AnimetedSlide from '@/components/animations/slide'
import { IPrograma } from '@/clients/api/programas'
import { resolveMediaUrl } from '@/constants/../lib/media'
import { useRouter } from 'next/navigation'
import { useTheme } from '@mui/material'

interface AccordionItemProps {
  item: IPrograma
  index: number
  isExpanded: boolean
  handleExpandAccordionImage: (_: IPrograma) => void
  isLastItem: boolean
}

const AccordionItem: React.FC<AccordionItemProps> = ({
  item,
  index,
  isExpanded,
  handleExpandAccordionImage,
  isLastItem,
}) => {
  const contentRef = React.useRef<HTMLDivElement>(null)
  const [contentHeight, setContentHeight] = React.useState(0)
  const { push } = useRouter()

  React.useEffect(() => {
    if (isExpanded && contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight)
    } else {
      setContentHeight(0)
    }
  }, [isExpanded])

  return (
    <Box
      key={item.id}
      width="100%"
      p="16px"
      bgcolor={'background.paper'}
      boxShadow="0px 15px 38.2px 0px #0000001F"
      borderRadius={
        index === 0 ? '32px 32px 0 0' : isLastItem ? '0 0 32px 32px' : '0px'
      }
      borderBottom="1px solid #72727133"
      display="flex"
      flexDirection="column"
      gap="8px"
    >
      <AnimetedSlide distance={100} tension={10} friction={5}>
        <Box
          width="100%"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h4" fontWeight={500}>
            {item.titulo}
          </Typography>
          <IconButton
            size="small"
            onClick={() => handleExpandAccordionImage(item)}
            aria-label="expanded-accordion-projects"
          >
            {isExpanded ? (
              <ExpandMoreIcon htmlColor="#333" />
            ) : (
              <ExpandLessIcon htmlColor="#333" />
            )}
          </IconButton>
        </Box>
        <Box
          ref={contentRef}
          sx={{
            maxHeight: `${contentHeight}px`,
            overflow: 'hidden',
            transition: 'max-height 0.3s ease-in-out, opacity 0.3s ease-in-out',
            opacity: isExpanded ? 1 : 0,
          }}
        >
          <Typography
            textTransform="none"
            color={'text.secondary'}
            variant="overline"
            lineHeight="150%"
          >
            {item.subtitulo ?? 'Sem subtitulo disponível'}
          </Typography>
          <Typography
            textTransform="none"
            color={'text.primary'}
            variant="subtitle1"
            lineHeight="150%"
          >
            {item.resumo ?? 'Sem resumo disponível'}
          </Typography>
          <Box display="flex" justifyContent="flex-end" color="primary">
            <Button size="small" onClick={() => push(`/programas/${item.id}`)}>
              <Typography
                textTransform="none"
                variant="subtitle1"
                lineHeight="150%"
              >
                Ver mais
              </Typography>
              <AddIcon fontSize="small" />
            </Button>
          </Box>
        </Box>
      </AnimetedSlide>
    </Box>
  )
}

export default function AccordionProjectsDesktop({
  projectList,
  expandedAccordion,
  setExpandedAccordion }: {
    projectList?: IPrograma[],
    expandedAccordion: IPrograma | undefined,
    setExpandedAccordion: React.Dispatch<React.SetStateAction<IPrograma | undefined>>
  }) {
  const {
    palette: { background },
  } = useTheme()

  const handleExpandAccordionImage = useCallback(
    (item: IPrograma) => {
      setExpandedAccordion((prev: IPrograma | undefined) =>
        prev?.id === item.id
          ? projectList?.[0] ?? undefined
          : item
      )
    },
    [setExpandedAccordion, projectList]
  )

  return (
    <Box
      px="32px"
      display='flex'
      width="100%"
      gap="24px"
      mb="40px"
    >
      <Box bgcolor="transparent" width="50%">
        {projectList?.map((item, index) => {
          const isExpanded = expandedAccordion?.id === item?.id
          return (
            <AccordionItem
              key={item.id}
              item={item}
              index={index}
              isExpanded={isExpanded}
              handleExpandAccordionImage={handleExpandAccordionImage}
              isLastItem={index === projectList?.length - 1}
            />
          )
        })}
      </Box>
      <Box
        sx={{
          width: '50%',
          borderRadius: '32px',
          backgroundColor: background.default,
          backgroundImage: `url("${resolveMediaUrl(expandedAccordion?.url_image_capa) ?? '/media-placeholder.svg'}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          transition: 'background-image 0.5s ease-in-out',
        }}
      />
    </Box>
  )
}
