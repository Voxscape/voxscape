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
  colors: {
    primary: {
      // generated from https://smart-swatch.netlify.app/#2a4778
      50: '#e6f7ff',
      100: '#c4dbef',
      200: '#a0bfdf',
      300: '#7ba4d1',
      400: '#5685c3',
      500: '#3d69a9',
      600: '#2e4e84',
      700: '#203c5f',
      800: '#10283c',
      900: '#02101a',
    },
  },
});
