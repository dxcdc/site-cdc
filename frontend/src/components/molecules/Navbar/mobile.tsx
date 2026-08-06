import { IMenu, ISubMenu } from '@/constants/menuNavigation'
import { useTheme } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { useNavigation } from '@/hooks/useNavigation'
import { useRouter } from 'next/navigation'
import ButtonSearch from '@/components/atoms/ButtonSearch'

interface INavbarMobile {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  menuOptions: IMenu[]
}

export default function NavbarMobile({ menuOptions, setOpen }: INavbarMobile) {
  const {
    palette: { secondary, background },
  } = useTheme()
  const { handleSubMenuClick } = useNavigation()
  const { push } = useRouter()

  const handleSubMenu = (subItem: ISubMenu, labelItem: string) => {
    handleSubMenuClick(subItem, labelItem)
    setOpen(false)
  }

  return (
    <Box
      position="fixed"
      top="94px"
      left={0}
      width="100%"
      maxWidth="100vw"
      height="calc(100vh - 94px)"
      sx={{
        backgroundColor: background.default,
        zIndex: 20,
        overflowY: 'auto',
        overflowX: 'hidden',
        WebkitOverflowScrolling: 'touch',
      }}
      pl="16px"
      pb="20px"
    >
      <Box my="48px">
        <ButtonSearch />
      </Box>

      {menuOptions?.slice(1).map((item) => (
        <Box key={item.id} sx={{ maxWidth: '100%', overflowX: 'hidden' }}>
          <Button
            sx={{
              color: secondary.dark,
              height: '34px',
              mb: '20px',
              width: '100%',
              justifyContent: 'flex-start',
            }}
            onClick={() => {
              if (item.link) {
                push(item.link)
                setOpen(false)
              }
            }}
          >
            <Typography
              textTransform="capitalize"
              variant="overline"
              fontWeight={700}
            >
              {item.label}
            </Typography>
          </Button>

          {item.subMenus && (
            <Box
              display="flex"
              flexDirection="column"
              gap="2px"
              mb="40px"
              mt="10px"
              maxWidth="100%"
            >
              {item.subMenus.map((subMenu: ISubMenu) => (
                <Button
                  key={subMenu.id}
                  sx={{
                    color: secondary.dark,
                    pl: '24px',
                    pr: '24px',
                    display: 'flex',
                    justifyContent: 'flex-start',
                    width: '100%',
                    overflowX: 'hidden',
                  }}
                  onClick={() => handleSubMenu(subMenu, item.label)}
                >
                  <Typography
                    textAlign="left"
                    lineHeight="150%"
                    variant="overline"
                    textTransform="capitalize"
                  >
                    {subMenu.label}
                  </Typography>
                </Button>
              ))}
            </Box>
          )}
        </Box>
      ))}
    </Box>
  )
}
