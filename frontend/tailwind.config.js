/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Lato', 'sans-serif'],
            },
            colors: {
                primary: {
                    50: '#f0fbfc',
                    100: '#dcf6fa',
                    200: '#beeff8',
                    300: '#8fe4f4',
                    400: '#58d3ee',
                    500: '#00bdf2', // Alegra Brand Color
                    600: '#0099c9',
                    700: '#007ba3',
                    800: '#006685',
                    900: '#06546e',
                },
                secondary: {
                    50: '#fff7ed',
                    100: '#ffedd5',
                    500: '#f97316',
                    600: '#ea580c',
                },
                success: '#2ecc71', // Soft Green
                warning: '#f1c40f', // Soft Yellow
                danger: '#e74c3c', // Soft Red
                dark: '#2c3e50', // Midnight Blue text
            },
            boxShadow: {
                'card': '0 2px 5px 0 rgba(0,0,0,0.05)',
                'card-hover': '0 8px 15px 0 rgba(0,0,0,0.1)',
            }
        },
    },
    plugins: [],
}
