import { hexAddAlpha } from './hexAddAlpha';

const blue500 = '#3B82F6';
const blue600 = '#2563EB';
const blue700 = '#1D4ED8';

const zinc50 = '#FAFAFA';
const zinc700 = '#3F3F46';

export const colors = {
  textPrimary: zinc50,
  inputBorder: zinc700,
  red500: '#EF4444',
  red900: '#7F1D1D',
  NEW_background: '#0D0E15',
  NEW_borderMiddleDarkArea: '#0B0C17',
  NEW_grayBorderTopLeft: '#3B3C46',
  NEW_darkPurpleGradient: `linear-gradient(117deg, #8023C3 -23.54%, #1D323A 223.49%)`,
  NEW_darkPurpleGradientHover: `linear-gradient(117deg, #9448CAFF -23.54%, #1D323A 223.49%)`,
  NEW_darkPurpleGradientActive: `linear-gradient(117deg, #A060D1FF -23.54%, #1D323A 223.49%)`,
  NEW_blueGradient: `linear-gradient(117deg, ${blue500} -23.54%, #1D283A 223.49%)`,
  NEW_blueGradientHover: `linear-gradient(117deg, ${blue700} -23.54%, #1D283A 223.49%)`,
  NEW_blueGradientActive: `linear-gradient(117deg, ${blue600} -23.54%, #1D283A 223.49%)`
} as const;

export { hexAddAlpha };
