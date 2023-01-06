import { extendTheme } from '@chakra-ui/react';

export const chakraTheme = extendTheme({
  breakpoints: {
    // fit container-width and tailwind notation
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
});
