import { createTheme } from '@mui/material/styles';

export type ThemeMode = 'light' | 'dark';

/**
 * Create MUI theme for the given mode. Form inputs, buttons, tables,
 * and text use theme tokens so they adapt automatically.
 */
export function createAppTheme(mode: ThemeMode) {
  return createTheme({
    palette: {
      mode,
      ...(mode === 'light'
        ? {
            background: {
              default: '#f5f5f5',
              paper: '#ffffff',
            },
          }
        : {
            background: {
              default: '#121212',
              paper: '#1e1e1e',
            },
          }),
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
    },
  });
}
