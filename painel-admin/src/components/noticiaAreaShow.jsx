import { Box, Label } from '@adminjs/design-system';
import AreaListDisplay from './areaListDisplay.jsx';

const NoticiaAreaShow = (props) => (
  <Box marginBottom="xxl">
    <Label>Área de atuação</Label>
    <AreaListDisplay {...props} />
  </Box>
);

export default NoticiaAreaShow;
