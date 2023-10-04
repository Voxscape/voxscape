import pixelBorderScss from './pixelBorders.module.scss';
import pixelFontScss from './pixelFonts.module.scss';

export const pixelBorders = {
  box: {
    light: pixelBorderScss.pixelBoxLight,
  },
} as const;

export const pixelFonts = {
  base: pixelFontScss.base,
} as const;
