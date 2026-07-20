import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#bfa15c',
            contrastText: '#1b223c',
        },
        error: {
            main: '#be434a',
            contrastText: '#fefffe',
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '10px',
                    textTransform: 'none',
                    fontWeight: 500,
                    fontSize: '16px',
                    padding: '10px 20px',
                    lineHeight: 1.2,
                },
                containedPrimary: {
                    '&:hover': {
                        backgroundColor: '#a88a3e',
                    },
                    '&.Mui-disabled': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        color: 'rgba(255, 255, 255, 0.35)',
                    },
                },
                containedError: {
                    '&:hover': {
                        backgroundColor: '#a83339',
                    },
                    '&.Mui-disabled': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        color: 'rgba(255, 255, 255, 0.35)',
                    },
                },
                outlinedPrimary: {
                    borderColor: '#bfa15c',
                    color: '#bfa15c',
                    '&:hover': {
                        backgroundColor: 'rgba(191, 161, 92, 0.08)',
                        borderColor: '#bfa15c',
                    },
                    '&.Mui-disabled': {
                        borderColor: 'rgba(255, 255, 255, 0.35)',
                        color: 'rgba(255, 255, 255, 0.35)',
                    },
                },
                text: {
                    '&:hover': {
                        backgroundColor: 'rgba(191, 161, 92, 0.08)',
                    },
                },
            },
        },
    },
});

export default theme;
