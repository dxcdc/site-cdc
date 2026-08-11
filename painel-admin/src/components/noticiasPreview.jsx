import { Box, Text } from '@adminjs/design-system';


const NoticiaPreview = (props) => {
  const { record, property } = props;
  const rawHtml = record.params[property.path] || '';

  const titulo = record.params.titulo
  const dataPublicacao = record.params.data_publicacao
    ? new Date(record.params.data_publicacao).toLocaleDateString('pt-BR')
    : 'Sem data';

  const tipo = record.params.tipo || 'Sem tipo';

  const cleanHtmlContent = (html) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    // Remove elementos indesejados
    tempDiv.querySelectorAll('script, style, iframe').forEach(el => el.remove());

    // Aplica estilos consistentes
    tempDiv.querySelectorAll('*').forEach(el => {
      el.style.fontFamily = "'Segoe UI', Roboto, sans-serif";
      el.style.fontSize = '14px';
      el.style.lineHeight = '1.5';
      el.style.color = 'var(--cdc-content-text, #333)';
      el.style.margin = '0 0 8px 0';
    });

    // Estiliza imagens
    tempDiv.querySelectorAll('img').forEach(img => {
      img.style.maxWidth = '100%';
      img.style.maxHeight = '120px';
      img.style.borderRadius = '4px';
      img.style.margin = '8px 0';
      img.style.objectFit = 'cover';
    });

    // Limita a 3 primeiros parágrafos
    const paragraphs = tempDiv.querySelectorAll('p');
    if (paragraphs.length > 3) {
      for (let i = 3; i < paragraphs.length; i++) {
        paragraphs[i].remove();
      }
    }

    return tempDiv.innerHTML;
  };

  const previewHtml = cleanHtmlContent(rawHtml);

  return (
    <Box
      className="cdc-news-preview"
      style={{
        maxWidth: '320px',
        border: '1px solid var(--cdc-topbar-border, #e0e0e0)',
        borderRadius: '8px',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        background: 'var(--cdc-surface, white)',
        ':hover': {
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }
      }}
    >
      {/* Cabeçalho */}
      <Box
        style={{
          padding: '12px 16px',
          background: 'var(--cdc-preview-muted, #f8f9fa)',
          borderBottom: '1px solid var(--cdc-topbar-border, #e0e0e0)'
        }}
      >

        <Text
          fontWeight="bold"
          fontSize={16}
          style={{
            color: 'var(--cdc-preview-title, #A7181D)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '100%', // ou um valor fixo como '240px'
            // fontWeight:"bold"
          }}
        >
          {titulo}
        </Text>
      </Box>

      {/* Conteúdo */}
      <Box
        style={{
          padding: '16px',
          maxHeight: '200px',
          overflow: 'hidden'
        }}
      >
        <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
      </Box>

      {/* Rodapé */}
      <Box
        style={{
          padding: '8px 16px',
          background: 'var(--cdc-preview-muted, #f8f9fa)',
          borderTop: '1px solid var(--cdc-topbar-border, #e0e0e0)',
          fontSize: '12px',
          color: 'var(--cdc-muted, #666)',
          display: 'flex',
          justifyContent: 'space-between'
        }}
      >
        <span>{dataPublicacao}</span>
        <span>{tipo}</span>
      </Box>
    </Box>
  );
};

export default NoticiaPreview;
