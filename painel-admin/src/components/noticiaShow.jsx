import { Box, Label } from '@adminjs/design-system';

const sanitizeHtml = (rawHtml) => {
  const container = document.createElement('div');
  container.innerHTML = rawHtml || '';

  container
    .querySelectorAll('script, style, iframe, object, embed, link, meta, form, input, button')
    .forEach((element) => element.remove());

  container.querySelectorAll('*').forEach((element) => {
    [...element.attributes].forEach((attribute) => {
      const name = attribute.name.toLowerCase();
      const value = attribute.value.trim().toLowerCase();
      if (name.startsWith('on') || name === 'srcdoc') {
        element.removeAttribute(attribute.name);
      }
      if ((name === 'href' || name === 'src') && (value.startsWith('javascript:') || value.startsWith('data:text/html'))) {
        element.removeAttribute(attribute.name);
      }
    });
  });

  container.querySelectorAll('a').forEach((link) => {
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  });

  container.querySelectorAll('img').forEach((image) => {
    image.style.setProperty('width', '100%', 'important');
    image.style.setProperty('max-width', '760px', 'important');
    image.style.setProperty('height', 'auto', 'important');
    image.style.setProperty('display', 'block', 'important');
    image.style.setProperty('margin', '16px auto 6px', 'important');
    image.style.setProperty('border-radius', '8px', 'important');
    if (!image.alt) image.alt = 'Imagem da notícia';
  });

  container.querySelectorAll('.se-image-container, figure').forEach((element) => {
    element.style.setProperty('display', 'block', 'important');
    element.style.setProperty('width', '100%', 'important');
    element.style.setProperty('max-width', '100%', 'important');
    element.style.setProperty('margin', '0 auto 18px', 'important');
  });

  container.querySelectorAll('figcaption').forEach((caption) => {
    caption.style.setProperty('max-width', '760px', 'important');
    caption.style.setProperty('margin', '0 auto', 'important');
    caption.style.setProperty('font-size', '13px', 'important');
    caption.style.setProperty('color', '#6b7280', 'important');
  });

  return container.innerHTML;
};

const NoticiaShow = ({ record, property }) => {
  const content = sanitizeHtml(record.params[property.path]);

  return (
    <Box marginBottom="xxl">
      <Label>Conteúdo da notícia</Label>
      <Box
        backgroundColor="white"
        border="default"
        borderRadius="default"
        padding="xl"
        style={{ width: '100%', maxWidth: '1040px', overflowWrap: 'anywhere' }}
      >
        <div className="cdc-news-content" dangerouslySetInnerHTML={{ __html: content }} />
      </Box>
    </Box>
  );
};

export default NoticiaShow;
