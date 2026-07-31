'use client'

import { IParceiro } from '@/clients/api/parceiros'
import { resolveMediaUrl } from '@/lib/media'
import Box from '@mui/material/Box'
import React from 'react'

interface ScrollInfiniteHorizontalProps {
  items?: IParceiro[]
  itemWidth?: number
  itemHeight?: number
  gap?: number
  speed?: number
  maxWidth?: string | number
}

export default function ScrollInfiniteHorizontal({
  items = [],
  itemWidth = 210,
  itemHeight = 100,
  gap = 100,
  speed = 40,
  maxWidth = 1536,
}: ScrollInfiniteHorizontalProps) {
  const totalWidth = (itemWidth + gap) * items.length

  return (
    <Box
      sx={{
        width: '90%',
        maxWidth: `${maxWidth}px`,
        marginInline: 'auto',
        overflow: 'hidden',
        position: 'relative',
        height: `${itemHeight}px`,
        maskImage:
          'linear-gradient(to right, rgba(0,0,0,0), rgba(0,0,0,1) 20%, rgba(0,0,0,1) 80%, rgba(0,0,0,0))',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          gap: `${gap}px`,
          width: `${totalWidth * 2}px`, // porque duplicamos
          animation: `scrollLeft ${speed}s linear infinite`,
        }}
      >
        {[...items, ...items].map((item, index) => (
          <Box
            key={`${item.id}-${index}`}
            sx={{
              width: `${itemWidth}px`,
              height: `${itemHeight}px`,
              borderRadius: '6px',
              backgroundImage: `url("${resolveMediaUrl(item.url_imagem)}")`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              flexShrink: 0,
            }}
          />
        ))}
      </Box>

      <style>{`
        @keyframes scrollLeft {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-${totalWidth}px);
          }
        }
      `}</style>
    </Box>
  )
}
