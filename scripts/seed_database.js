import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: 5432,
  user: process.env.DB_USER || 'cdc_user',
  password: process.env.DB_PASSWORD || 'cdc_password',
  database: process.env.DB_NAME || 'site_cdc_db',
});

async function seed() {
  console.log('🌱 Iniciando inclusão de dados iniciais (seed) no banco PostgreSQL...');

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 1. Capas
    console.log('📸 Inserindo capas de páginas...');
    await client.query(`
      INSERT INTO capa (pagina, url_img, titulo) VALUES
      ('inicio', 'banners/6-_MG_8182.jpg', 'Centro de Desenvolvimento e Cidadania'),
      ('institucional', 'banners/18-IMG_7339_(1).jpg', 'Institucional - Nossa História e Ação'),
      ('programas', 'banners/22-IMG_6735.jpg', 'Programas e Projetos Sociais'),
      ('noticias', 'banners/7-_MG_8129.jpg', 'Notícias e Atualizações'),
      ('publicacoes', 'banners/4-IMG_7093_(1).jpg', 'Publicações e Documentos'),
      ('contato', 'banners/27-IMG_6039.JPG', 'Fale Conosco')
      ON CONFLICT DO NOTHING;
    `);

    // 2. Parceiros
    console.log('🤝 Inserindo logos de parceiros...');
    await client.query(`
      INSERT INTO parceiro (url_imagem) VALUES
      ('parceiros/6-logo_(3)_(1).png'),
      ('parceiros/13-logo_(1).png'),
      ('parceiros/14-logo-slogan-governo-federal-uniao-reconstrucao-alta-vetor-1-scaled_(1).jpg'),
      ('parceiros/15-Marca_redesign_CCLF_horizontal_CMYK_(1).jpg'),
      ('parceiros/20-logo_(4).png'),
      ('parceiros/23-atacadao-logo.png'),
      ('parceiros/24-cielo_CINZA_RGB-01.png'),
      ('parceiros/7-GovPERGB_(1).png');
    `);

    // 3. Programas
    console.log('🚀 Inserindo programas de ação social...');
    await client.query(`
      INSERT INTO programas (titulo, subtitulo, descricao, resumo, url_image_capa, is_ativo) VALUES
      ('Fortalecimento de Vínculos e Cidadania', 'Ações socioeducativas para crianças e jovens', 'Promover a garantia de direitos e o fortalecimento de vínculos familiares e comunitários.', 'Atividades formativas comunitárias', 'noticias/100-IMG_0711.jpg', true),
      ('Qualificação Profissional e Inclusão', 'Capacitação técnica para o mercado de trabalho', 'Cursos e oficinas práticas visando à autonomia e empregabilidade dos participantes.', 'Cursos práticos e formação técnica', 'noticias/105-_MG_8323.jpg', true),
      ('Incidência e Políticas Públicas', 'Defesa de direitos e controle social', 'Atuação em conselhos de direitos e articulação em redes para fortalecimento democrático.', 'Controle social e incidência política', 'noticias/101-IMG_3763.JPG', true);
    `);

    // 4. Notícias
    console.log('📰 Inserindo notícias...');
    await client.query(`
      INSERT INTO noticias (titulo, subtitulo, conteudo, imagem_capa, data_publicacao) VALUES
      ('CDC promove encontro sobre fortalecimento de políticas públicas', 'Evento reuniu lideranças comunitárias e especialistas em cidadania.', 'O Centro de Desenvolvimento e Cidadania promoveu um grande ciclo de debates para fortalecer a participação cidadã na construção de políticas públicas locais e promoção de direitos.', 'noticias/100-IMG_0711.jpg', '2026-07-20'),
      ('Abertas as inscrições para novas formações socioeducativas', 'Oficinas gratuitas voltadas para jovens da comunidade.', 'Estão abertas as inscrições para as turmas do projeto de capacitação para o mercado de trabalho. As vagas são voltadas para jovens e adultos em situação de vulnerabilidade social.', 'noticias/105-_MG_8323.jpg', '2026-07-15'),
      ('Relatório de Impacto Social celebra conquistas do último ano', 'Ações beneficiaram mais de 5.000 pessoas nas regiões atendidas.', 'Foi publicado o relatório anual destacando os principais avanços, parcerias firmadas e número de famílias atendidas ao longo do último ciclo de projetos.', 'noticias/106-IMG_5713.jpg', '2026-07-10');
    `);

    // 5. Rodapé
    console.log('📍 Inserindo dados de rodapé...');
    await client.query(`
      INSERT INTO rodape (endereco, cep, horario_funcionamento, cnpj, link_facebook, link_instagram, link_linkedin, telefone) VALUES
      ('Rua Principal, CDC - Recife / PE', '50000-000', 'Segunda a Sexta, 08h às 17h', '00.000.000/0001-00', 'https://facebook.com/cdc', 'https://instagram.com/cdc', 'https://linkedin.com/company/cdc', '(81) 3333-4444');
    `);

    await client.query('COMMIT');
    console.log('✅ Seed executado com sucesso!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Erro durante o seed:', err.message);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
