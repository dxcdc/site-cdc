'use client'
import { useTheme } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import AddIcon from '@mui/icons-material/Add'
import AnimetedSlide from '@/components/animations/slide'
import { IPrograma } from '@/clients/api/programas'
import { useRouter } from 'next/navigation'
import { resolveMediaUrl } from '@/lib/media'
import SanitizedHtmlBox from '@/utils/stripHtmlTags'

export default function AccordionProjectsMobile({
  projectList,
  expandedAccordion,
  setExpandedAccordion }: {
    projectList?: IPrograma[],
    expandedAccordion: IPrograma | undefined,
    setExpandedAccordion: React.Dispatch<React.SetStateAction<IPrograma | undefined>>
  }) {

  const {
    palette: { secondary, text, background },
  } = useTheme()

  const contentRef = useRef<HTMLDivElement>(null)
  const [contentHeight, setContentHeight] = useState(0)
  const { push } = useRouter()

  useEffect(() => {
    if (expandedAccordion?.id !== 0 && contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight)
    } else {
      setContentHeight(0)
    }
  }, [expandedAccordion])

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
      px="16px"
      display='flex'
      width="100%"
      gap="16px"
      flexDirection="column"
      mb="40px"
    >
      <AnimetedSlide distance={100} tension={10} friction={5}>
        <Box
          display="flex"
          gap="12px"
          maxWidth="100%"
          overflow="auto"
          sx={{
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
          }}
        >
          {projectList?.map((item) => (
            <button
              key={item.id}
              onClick={() => handleExpandAccordionImage(item)}
              style={{
                height: '40px',
                padding: '11px 14px',
                borderRadius: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                gap: '6px',
                backgroundColor:
                  expandedAccordion?.id === item.id
                    ? secondary.light
                    : 'transparent',
                border: `1px solid ${secondary.light}`,
              }}
            >
              {expandedAccordion?.id === item.id && (
                <CloseIcon fontSize="small" htmlColor="#333" />
              )}
              <Typography
                variant="subtitle2"
                lineHeight="120%"
                color={text.primary}
                whiteSpace={'nowrap'}
              >
                {item?.titulo}
              </Typography>
            </button>
          ))}
        </Box>
      </AnimetedSlide>

      <AnimetedSlide distance={100} tension={10} friction={5}>
        <Box
          padding={expandedAccordion?.id !== 0 ? '16px' : '0px'}
          bgcolor={'background.paper'}
          borderRadius="32px"
          boxShadow="0px 15px 38.2px 0px #0000001F"
        >
          <Box
            ref={contentRef}
            sx={{
              maxHeight: `${contentHeight}px`,
              overflow: 'hidden',
              transition:
                'max-height 0.3s ease-in-out, opacity 0.3s ease-in-out',
              opacity: expandedAccordion?.id !== 0 ? 1 : 0,
            }}
          >
            {expandedAccordion?.id !== 0 && (
              <Box display="flex" flexDirection="column" gap="8px">
                <Typography
                  textTransform="none"
                  color={'text.primary'}
                  variant="overline"
                  lineHeight="150%"
                >
                  {expandedAccordion?.subtitulo}
                </Typography>
                <SanitizedHtmlBox html={expandedAccordion?.resumo} />
                <Box
                  display="flex"
                  justifyContent="flex-end"
                  color="primary"
                  mb="8px"
                >
                  <Button
                    size="small"
                    onClick={() => push(`/programas/${expandedAccordion?.id}`)}
                  >
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
            )}
          </Box>
          <Box
            sx={{
              width: '100%',
              height: '480px',
              borderRadius: '32px',
              backgroundColor: background.default,
              backgroundImage: `url("${resolveMediaUrl(expandedAccordion?.url_image_capa) ?? ''}")`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              transition: 'background-image 0.5s ease-in-out',
            }}
          />
        </Box>
      </AnimetedSlide>
    </Box>
  )
}
