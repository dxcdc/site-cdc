export interface IMenu {
  id: number
  label: string
  link?: string
  subMenus?: ISubMenu[]
}

export interface ISubMenu {
  id: number
  label: string
  scrollView?: string
  link?: string
}

export const MenuOptions = [
  {
    id: 0,
    label: 'Início',
    link: '/',
  },
  {
    id: 1,
    label: 'Institucional',
    link: "/institucional",
    subMenus: [
      { id: 10, label: 'Linha do tempo', scrollView: 'timeline' },
      { id: 11, label: 'Estrutura organizacional', scrollView: 'organizacao' },
      { id: 12, label: 'Lideranças', scrollView: 'liderancas' },
      { id: 13, label: 'Transparência', scrollView: 'transparencia' },
      { id: 14, label: 'Perguntas frequentes', scrollView: 'faq' },
      { id: 15, label: 'Trabalhe conosco', link: 'trabalhe-conosco' },
    ],
  },
  {
    id: 2,
    label: 'Programas',
    link: "/programas",
    subMenus: [],
  },
  {
    id: 3,
    label: 'Informe-se',
    subMenus: [
      { id: 30, label: 'Notícias', link: 'noticias' },
      { id: 31, label: 'Publicações', link: 'publicacoes' },
    ],
  },
  {
    id: 4,
    label: 'Contato',
    link: '/contato',
  },
]
