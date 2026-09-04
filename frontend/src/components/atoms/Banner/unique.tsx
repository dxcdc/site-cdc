'use client'
import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material'
import { resolveMediaUrlOrFallback } from '@/lib/media'

import DOMPurify from 'isomorphic-dompurify'

export interface IBannerUnique {
  Banner: TypeBannerUnique
}

export interface TypeBannerUnique {
  id?: number
  title?: string
  image?: any
  highlight?: string
}

export default function BannerUnique({ Banner }: IBannerUnique) {
  const {
    palette: { background },
  } = useTheme()

  const rawTitle = Banner?.title || ''
  const hasHtml = /<[a-z][\s\S]*>/i.test(rawTitle)

  return (
    <Box
      width="100%"
      maxWidth="100vw"
      height="100%"
      sx={{
        backgroundColor: background.default,
        borderRadius: '0 0 16px 16px',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <Box display="flex" width="100%" maxWidth="100vw" height="100%">
        <Box
          key={Banner.id}
          width="100vw"
          height="100%"
          sx={{
            backgroundImage: `
              linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)),
              url("${resolveMediaUrlOrFallback(Banner.image)}")
            `,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexShrink: 0,
            position: 'relative',
          }}
        >
          <Box
            display="flex"
            flexDirection="column"
            gap="24px"
            pl={{ xs: '16px', sm: '32px' }}
            mt="130px"
            alignItems="flex-start"
            width="100%"
          >
            {hasHtml ? (
              <Box
                maxWidth="790px"
                sx={{
                  color: 'primary.light',
                  '& h1': {
                    fontSize: { xs: '1.8rem', sm: '2.67rem' },
                    lineHeight: '120%',
                    fontWeight: 700,
                    margin: 0,
                  },
                  '& span': {
                    fontSize: { xs: '1.8rem', sm: '2.67rem' },
                    lineHeight: '120%',
                    fontWeight: 700,
                  },
                }}
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(rawTitle, { ADD_ATTR: ['style'] }) }}
              />
            ) : (
              <Typography
                component="h1"
                maxWidth="790px"
                lineHeight="120%"
                variant="h2"
                sx={{
                  fontSize: {
                    sm: '2.67rem',
                  },
                }}
                color={'primary.light'}
              >
                {rawTitle}
                {Banner.highlight && (
                  <Typography
                    variant="h2"
                    color="secondary.light"
                    sx={{
                      fontSize: {
                        sm: '2.67rem',
                      },
                    }}
                    component="span"
                  >
                    {' '}
                    {Banner.highlight}
                  </Typography>
                )}
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
