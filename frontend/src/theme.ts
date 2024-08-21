import { createTheme, ThemeOptions } from '@mui/material/styles';

// Define your color palette
const palette = {
  primary: {
    main: '#1976d2',
    light: '#42a5f5',
    dark: '#1565c0',
  },
  secondary: {
    main: '#9c27b0',
    light: '#ba68c8',
    dark: '#7b1fa2',
  },
  // Add more colors as needed
};

// Define your typography
const typography = {
  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  h1: {
    fontSize: '2.5rem',
    fontWeight: 500,
  },
  h2: {
    fontSize: '2rem',
    fontWeight: 500,
  },
  // Add more typography styles as needed
};

// Create the base theme options
const themeOptions: ThemeOptions = {
  palette,
  typography,
  // Add more theme options as needed
};

// Create and export the theme
const theme = createTheme(themeOptions);

export default theme;

// If you need a function to get design tokens, you can add it like this:
export const getDesignTokens = (mode: 'light' | 'dark') => {
  return {
    palette: {
      mode,
      ...(mode === 'light'
        ? {
            // Light mode palette
            primary: palette.primary,
            secondary: palette.secondary,
            background: {
              default: '#f5f5f5',
              paper: '#ffffff',
            },
          }
        : {
            // Dark mode palette
            primary: {
              main: '#90caf9',
              light: '#e3f2fd',
              dark: '#42a5f5',
            },
            secondary: {
              main: '#ce93d8',
              light: '#f3e5f5',
              dark: '#ab47bc',
            },
            background: {
              default: '#303030',
              paper: '#424242',
            },
          }),
    },
    typography,
  };
};