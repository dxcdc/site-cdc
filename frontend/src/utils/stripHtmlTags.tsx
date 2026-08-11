'use client'

import { Box } from '@mui/material'
import DOMPurify from 'isomorphic-dompurify'
import { FC, useContext, useMemo } from 'react'
import { Lato } from 'next/font/google'
import { SettingsContext } from '../context/settingsContext'

const lato = Lato({ subsets: ['latin'], weight: '400' })

type Props = {
  html?: string
  initialFontScale?: number
  initialFontWeightScale?: number
  indicadores?: boolean
}

const extractFontSizeFromHtml = (html?: string): number | null => {
  if (!html) return null
  const match = html.match(/font-size:\s*(\d+)(px|rem)/i)
  if (!match) return null
  const value = parseFloat(match[1])
  const unit = match[2]
  return unit === 'rem' ? value : value / 18
}

const extractFontWeightFromHtml = (html?: string): number | null => {
  if (!html) return null
  const match = html.match(/font-weight:\s*(\d+)/i)
  return match ? parseInt(match[1], 10) : null
}

const SanitizedHtmlBox: FC<Props> = ({
  html,
  initialFontScale = 1,
  indicadores = false,
}) => {
  const { fontScale, fontWeightScale } = useContext(SettingsContext)

  const baseFontSize = useMemo(() => {
    const extracted = extractFontSizeFromHtml(html)
    return extracted ?? initialFontScale
  }, [html, initialFontScale])

  const baseFontWeight = useMemo(() => {
    const extracted = extractFontWeightFromHtml(html)
    return extracted ?? 400
  }, [html])

  const finalFontSize = baseFontSize * fontScale
  const finalFontWeight = baseFontWeight * fontWeightScale
  const indicadoresFinalFontSize = baseFontSize * fontScale
  const indicadoresFontWeight = baseFontWeight * fontWeightScale

  const sanitizeHtml = (html?: string): string => {
    if (!html) return ''

    const sanitized = DOMPurify.sanitize(html, {
      ADD_TAGS: ['iframe'],
      ADD_ATTR: [
        'allow',
        'allowfullscreen',
        'frameborder',
        'scrolling',
        'src',
        'style',
        'width',
        'height',
        'data-*',
      ],
    })

    const parser = new DOMParser()
    const doc = parser.parseFromString(sanitized, 'text/html')

    if (indicadores) {
      doc.querySelectorAll('h1').forEach((heading) => {
        const replacement = doc.createElement('h2')
        Array.from(heading.attributes).forEach(({ name, value }) => replacement.setAttribute(name, value))
        replacement.innerHTML = heading.innerHTML
        heading.replaceWith(replacement)
      })
    }

    const normalizeFontWeight = (value: number): number => {
      if (value < 500) return 400
      if (value < 650) return 600
      return 700
    }

    const walk = (el: HTMLElement) => {
      const style = el.style

      // Font Size
      if (style.fontSize) {
        const match = style.fontSize.match(/(\d+)(px|rem)/)
        if (match) {
          const value = parseFloat(match[1])
          const unit = match[2]
          const baseSize = unit === 'rem' ? value : value / 18
          const newSize = baseSize * fontScale
          style.fontSize = `${newSize}rem`
        }
      }

      // Font Weight
      if (style.fontWeight) {
        const weight = parseInt(style.fontWeight)
        if (!isNaN(weight)) {
          const scaled = weight * fontWeightScale
          const normalized = normalizeFontWeight(Math.round(scaled))
          style.fontWeight = `${normalized}`
        }
      }

      // Color — preserva
      if (style.color) {
        style.color = style.color
      }

      Array.from(el.children).forEach(child => walk(child as HTMLElement))
    }

    Array.from(doc.body.children).forEach(el => walk(el as HTMLElement))

    return doc.body.innerHTML
  }

  return (
    <Box
      sx={{
        fontSize: `${finalFontSize}rem`,
        fontFamily: `${lato.style.fontFamily}, "Source Sans Pro", sans-serif`,

        '& *:not([style*="font-size"])': {
          fontSize: `${finalFontSize}rem`,
          fontFamily: `${lato.style.fontFamily}, "Source Sans Pro", sans-serif`,
        },
        '& *:not([style*="font-weight"])': {
          fontWeight: finalFontWeight,
        },

        ...(indicadores && {
          '& h1': {
            fontWeight: `${indicadoresFontWeight} !important`,
            lineHeight: 1.2,
            letterSpacing: '0px',
            verticalAlign: 'middle',
            fontSize: {
              xs: `${indicadoresFinalFontSize * 0.7}rem !important`,
              sm: `${indicadoresFinalFontSize * 0.8}rem !important`,
              md: `${indicadoresFinalFontSize}rem !important`,
            }
          },
          '& span': {
            fontFamily: `${lato.style.fontFamily}, "Source Sans Pro", sans-serif`,
            fontSize: {
              xs: `${indicadoresFinalFontSize * 0.7}rem !important`,
              sm: `${indicadoresFinalFontSize * 0.8}rem !important`,
              md: `${indicadoresFinalFontSize}rem !important`,
            }
          },
        }),
      }}
      dangerouslySetInnerHTML={{ __html: sanitizeHtml(html) }}
    />
  )
}

export default SanitizedHtmlBox
