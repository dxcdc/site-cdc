'use client'
import React, { memo } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import ButtonTag from '../ButtonTag'
import { resolveMediaUrlOrFallback } from '@/lib/media'

interface ICardTagDesc {
  info: any
  personal?: boolean
  leadership?: boolean
  leiaTambem?: boolean
  transparency?: boolean
  onclick?: (_?: any) => void
  onclickTag?: (_?: any) => void
}

function CardTagDesc({
  info,
  personal,
  leadership,
  leiaTambem,
  transparency,
  onclick,
  onclickTag,
}: ICardTagDesc) {
  const imageNotFound = 'https://ih1.redbubble.net/image.4905811447.8675/flat,750x,075,f-pad,750x1000,f8f8f8.jpg'
  const imgUrl = (path?: string | null) => resolveMediaUrlOrFallback(path, imageNotFound)
  if (leadership) {
    return (
      <Box display="flex" flexDirection="column" gap="12px" width="100%">
        <Box
          width="100%"
          height="260px"
          sx={{
            backgroundImage: `url("${imgUrl(info?.image)}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            borderRadius: '32px',
            backgroundColor: 'gray',
          }}
        />

        <Box display={'flex'} gap='10px' flexWrap={'wrap'}>
          {info?.areas?.map((area: { id: number, nome: string }) => (
            <ButtonTag noAnimation key={area.id}>{area.nome}</ButtonTag>
          ))}
        </Box>
        <Box display="flex" flexDirection="column" gap="4px">
          <Typography
            variant="overline"
            lineHeight="150%"
            textTransform="none"
            color="text.primary"
            maxWidth="390px"
          >
            {info.description}
          </Typography>
          {info.occupation && (
            <Typography
              variant="subtitle2"
              lineHeight="150%"
              textTransform="none"
              color="#727271"
            >
              {info.occupation}
            </Typography>
          )}
          {info.email && (
            <Typography
              variant="subtitle2"
              lineHeight="150%"
              textTransform="none"
              color="#727271"
            >
              {info.email}
            </Typography>
          )}
        </Box>
      </Box>
    )
  }

  if (transparency) {
    return (
      <Box display="flex" flexDirection="column" gap="12px" width="100%">
        <Box
          width="100%"
          height="196px"
          sx={{
            backgroundImage: `url("${imgUrl(info?.image)}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            borderRadius: '32px',
            backgroundColor: 'gray',
          }}
        />

        <Box display={'flex'} gap='10px' flexWrap={'wrap'}>
          {info?.areas?.map((area: { id: number, nome: string }) => (
            <ButtonTag noAnimation key={area.id}>{area.nome}</ButtonTag>
          ))}
        </Box>
        <Box display="flex" flexDirection="column" gap="4px">
          <Typography
            variant="overline"
            lineHeight="150%"
            textTransform="none"
            color="text.primary"
            maxWidth="390px"
          >
            {info.description}
          </Typography>
          {info.occupation && (
            <Typography
              variant="subtitle2"
              lineHeight="150%"
              textTransform="none"
              color="#727271"
            >
              {info.occupation}
            </Typography>
          )}
          {info.email && (
            <Typography
              variant="subtitle2"
              lineHeight="150%"
              textTransform="none"
              color="#727271"
            >
              {info.email}
            </Typography>
          )}
        </Box>
      </Box>
    )
  }

  if (personal) {
    return (
      <Box display="flex" flexDirection="column" gap="12px" width="100%">
        <Box
          width="100%"
          height="192px"
          sx={{
            backgroundImage: `url("${imgUrl(info?.image)}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            borderRadius: '32px',
            backgroundColor: 'gray',
          }}
        />

        <Box display={'flex'} gap='10px' flexWrap={'wrap'}>
          {info?.areas?.map((area: { id: number, nome: string }) => (
            <ButtonTag noAnimation key={area.id}>{area.nome}</ButtonTag>
          ))}
        </Box>
        <Box display="flex" flexDirection="column" gap="4px">
          <Typography
            variant="overline"
            lineHeight="150%"
            textTransform="none"
            color="text.primary"
            maxWidth="390px"
          >
            {info.description}
          </Typography>
          {info.occupation && (
            <Typography
              variant="subtitle2"
              lineHeight="150%"
              textTransform="none"
              color="#727271"
            >
              {info.occupation}
            </Typography>
          )}
          {info.email && (
            <Typography
              variant="subtitle2"
              lineHeight="150%"
              textTransform="none"
              color="#727271"
            >
              {info.email}
            </Typography>
          )}
        </Box>
      </Box>
    )
  }

  if (leiaTambem) {
    return (
      <Box display="flex" flexDirection="column" gap="12px" width="100%">
        <Box
          width="100%"
          height="176px"
          sx={{
            backgroundImage: `url("${imgUrl(info?.image)}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            borderRadius: '32px',
            backgroundColor: 'gray',
          }}
        />
        <Box display="flex" flexDirection="column" gap="4px">
          <Typography
            variant="overline"
            lineHeight="150%"
            textTransform="none"
            color="text.primary"
            maxWidth="390px"
          >
            {info.description}
          </Typography>
        </Box>
      </Box>
    )
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      gap="12px"
      sx={{
        cursor: 'pointer',
        '&:hover .imgZoom': {
          backgroundSize: '110%',
        },
        '&:hover .descText': {
          color: 'primary.main',
        },
      }}
    >
      <Box
        onClick={onclick}
        height={{
          xs: '230px',
          sm: '173px',
          md: '230px',
          lg: '266px',
        }}
        sx={{
          width: '100%',
          borderRadius: '8px',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <Box
          className="imgZoom"
          sx={{
            width: '100%',
            height: '100%',
            backgroundImage: `url("${imgUrl(info?.imagem_capa ?? info?.url_imagem ?? info?.url_image_capa)}")`,
            backgroundColor: 'gray',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            transition: 'background-size 0.3s ease-in-out',
            borderRadius: "32px"
          }}
        />
      </Box>
      <Box display={'flex'} gap='10px' flexWrap={'wrap'}>
        {info?.areas?.map((area: { id: number, nome: string }) => (
          <ButtonTag noAnimation={true} onClick={onclickTag} key={area.id}>{area.nome}</ButtonTag>
        ))}
      </Box>
      <Box onClick={onclick}>
        <Typography
          className="descText"
          variant="overline"
          lineHeight="150%"
          textTransform="none"
          color="text.primary"
          maxWidth="390px"
        >
          {info?.titulo ?? "Título não informado"}
        </Typography>
      </Box>
    </Box>
  )
}

export default memo(CardTagDesc)
