import { Box, H2, H5, Icon, Illustration, Text } from '@adminjs/design-system';
import RocketSVG from '../../node_modules/adminjs/lib/frontend/components/app/utils/rocket-svg.js';

const onboardingCards = [
  {
    variant: 'Details',
    title: 'Adicionando Recursos',
    description: 'Como adicionar novos recursos à barra lateral',
    href: 'https://docs.adminjs.co/basics/resource#providing-resources-explicitly',
  },
  {
    variant: 'Docs',
    title: 'Personalizar Recursos',
    description: 'Definindo comportamento, adicionando propriedades e mais...',
    href: 'https://docs.adminjs.co/basics/resource#customizing-resources',
  },
  {
    variant: 'Plug',
    title: 'Personalizar Ações',
    description: 'Modificar ações existentes e adicionar novas',
    href: 'https://docs.adminjs.co/basics/action',
  },
  {
    variant: 'Cup',
    title: 'Escrever Componentes',
    description: 'Como modificar o visual do AdminJS',
    href: 'https://docs.adminjs.co/ui-customization/writing-your-own-components',
  },
  {
    variant: 'Photos',
    title: 'Dashboard Personalizado',
    description: 'Como modificar esta página e adicionar novas páginas à barra lateral',
    href: 'https://docs.adminjs.co/ui-customization/dashboard-customization',
  },
  {
    variant: 'IdentityCard',
    title: 'Controle de Acesso Baseado em Perfil',
    description: 'Criar perfis de usuário e permissões no AdminJS',
    href: 'https://docs.adminjs.co/tutorials/adding-role-based-access-control',
  },
];

const shortcuts = [
  { label: 'Configurações', description: 'Áreas e parâmetros gerais', icon: 'Settings', href: '/admin/resources/Area' },
  { label: 'Início', description: 'Apresentação e conteúdos da página inicial', icon: 'Home', href: '/admin/resources/Organizacao' },
  { label: 'Institucional', description: 'Lideranças e transparência', icon: 'Users', href: '/admin/resources/Lideranca' },
  { label: 'Programas', description: 'Projetos e programas do CDC', icon: 'Layers', href: '/admin/resources/Programa' },
  { label: 'Informe-se', description: 'Notícias e publicações', icon: 'BookOpen', href: '/admin/resources/Noticia' },
  { label: 'Acesso Google', description: 'E-mails autorizados no OAuth', icon: 'Shield', href: '/admin/pages/googleAccess' },
];

const CdcDashboard = () => (
  <Box className="cdc-dashboard-page">
    <section className="cdc-onboarding-header" aria-labelledby="cdc-welcome-title">
      <div className="cdc-onboarding-rocket" aria-hidden="true">
        <RocketSVG />
      </div>
      <div className="cdc-onboarding-message">
        <H2 id="cdc-welcome-title" fontWeight="bold">Bem-vindo à bordo!</H2>
        <Text>Agora você é um de nós! Preparamos algumas dicas para você começar:</Text>
      </div>
    </section>

    <section className="cdc-onboarding-grid" aria-label="Guias de introdução ao AdminJS">
      {onboardingCards.map((card) => (
        <a
          className="cdc-onboarding-card"
          href={card.href}
          key={card.title}
          target="_blank"
          rel="noreferrer"
        >
          <Illustration variant={card.variant} width={100} height={70} />
          <H5>{card.title}</H5>
          <Text>{card.description}</Text>
        </a>
      ))}
    </section>

    <section className="cdc-dashboard-shortcuts" aria-labelledby="cdc-shortcuts-title">
      <H2 id="cdc-shortcuts-title">Painel Administrativo CDC</H2>
      <Text marginTop="md">
        Selecione uma área para consultar ou administrar os conteúdos.
      </Text>
      <div className="cdc-dashboard-grid">
        {shortcuts.map((shortcut) => (
          <a className="cdc-dashboard-card" href={shortcut.href} key={shortcut.label}>
            <Icon icon={shortcut.icon} />
            <strong>{shortcut.label}</strong>
            <span>{shortcut.description}</span>
          </a>
        ))}
      </div>
    </section>
  </Box>
);

export default CdcDashboard;
