'use client'
import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import MenuAreasWithSearchInput from '@/components/molecules/MenuAreaWithSearchInput'
import ListCards from '@/components/molecules/ListCards'
import { useScrollToTop } from '@/hooks/useScroll'
import { INoticias, useNoticiasListQuery } from '@/clients/api/noticias'
import ZoomOutOnView from '@/components/animations/zoomOutOnView'
import Pagination from '@mui/material/Pagination'

export default function Noticias() {
  useScrollToTop()
  const [fieldSearch, setFieldSearch] = useState('')
  const [areaSelect, setAreaSelect] = useState<string[]>([])
  const { data } = useNoticiasListQuery()
  const [listNoticias, setListNoticias] = useState<INoticias[]>([])
  const [areasFiltro, setAreasFiltro] = useState<{ id: number, nome: string }[]>([])
  const [page, setPage] = useState(1)
  const pageSize = 12

  const onSearch = () => {
    if (fieldSearch !== "") {
      const listFilter = listNoticias.filter(item => item.titulo?.toLocaleLowerCase()?.includes(fieldSearch.toLocaleLowerCase()))
      setListNoticias(listFilter)
    } else {
      if (data) {
        setListNoticias(data?.data)
      } else {
        setListNoticias([])
      }
    }
  }

  useEffect(() => {
    if (data?.data && areaSelect.length > 0) {
      const filtradas = data.data.filter((noticia: INoticias) =>
        noticia.areas?.some(area => areaSelect.includes(area.nome))
      )
      setListNoticias(filtradas)
    } else if (data?.data) {
      setListNoticias(data.data)
    }
  }, [areaSelect, data])

  useEffect(() => {
    setPage(1)
  }, [areaSelect, fieldSearch])

  useEffect(() => {
    if (data) {
      setListNoticias(data?.data)
      setAreasFiltro(data?.areas_filtro)
    }
  }, [data])

  return (
    <Box
      p={{ xs: '32px 16px 32px 16px', md: '40px 32px 160px 32px' }}
      display="flex"
      flexDirection="column"
      gap={{ xs: '32px', md: '24px' }}
      bgcolor="background.default"
      overflow={"hidden"} width={"100%"} maxWidth={"100vw"}
    >
      <ZoomOutOnView>
        <Box display={{ xs: 'flex', sm: 'none' }} pb="32px" >
          <Typography variant="h3" color="primary">
            Notícias
          </Typography>
        </Box>
        <Box display="flex" gap="24px" alignItems={'center'}>
          <MenuAreasWithSearchInput
            valueInput={fieldSearch}
            setValueInput={setFieldSearch}
            areaSelect={areaSelect}
            setAreaSelect={setAreaSelect}
            listAreasAvailable={areasFiltro}
            onSearch={onSearch}
          />
        </Box>
      </ZoomOutOnView>
      <ListCards
        page="/noticias"
        list={listNoticias.slice((page - 1) * pageSize, page * pageSize)}
      />
      {listNoticias.length > pageSize && (
        <Box display="flex" justifyContent="center" pt="24px">
          <Pagination
            count={Math.ceil(listNoticias.length / pageSize)}
            page={page}
            onChange={(_, nextPage) => {
              setPage(nextPage)
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            color="primary"
            aria-label="Paginação de notícias"
          />
        </Box>
      )}
    </Box>
  )
}
