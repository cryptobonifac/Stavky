import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0f172a',
      contrastText: '#f8fafc',
    },
    secondary: {
      main: '#14b8a6',
    },
    background: {
      default: '#f4f6fb',
      paper: '#ffffff',
    },
    text: {
      primary: '#0b1220',
      secondary: '#475569',
    },
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
    h1: {
      fontSize: '2.75rem',
      fontWeight: 600,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: '2.25rem',
      fontWeight: 600,
      letterSpacing: '-0.02em',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
    },
    subtitle1: {
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.7,
    },
    body2: {
      fontSize: '0.95rem',
      lineHeight: 1.6,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 20,
        },
      },
    },
    MuiContainer: {
      defaultProps: {
        maxWidth: 'lg',
      },
    },
  },
})

export default theme


