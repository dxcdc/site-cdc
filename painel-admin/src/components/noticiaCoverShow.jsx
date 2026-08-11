import { Box, Label } from '@adminjs/design-system';

const STORAGE_URL = 'https://storage.googleapis.com/cdc-site/';

const NoticiaCoverShow = ({ record, property }) => {
  const value = record.params[property.path];
  if (!value) return null;

  const src = value.startsWith('http') ? value : `${STORAGE_URL}${value}`;

  return (
    <Box marginBottom="xxl">
      <Label>Imagem de capa</Label>
      <a href={src} target="_blank" rel="noopener noreferrer" title="Abrir imagem em tamanho original">
        <img
          src={src}
          alt="Imagem de capa da notícia"
          style={{
            display: 'block',
            width: '100%',
            maxWidth: '520px',
            maxHeight: '320px',
            objectFit: 'cover',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
          }}
        />
      </a>
    </Box>
  );
};

export default NoticiaCoverShow;
