const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            colors: {
                'black-lighten': '#161616',
                primary: '#5179ff',
                'gray-lighten': '#989898',
                'gray-darken': '#3a3939',
                dark: '#1C1C1E',
                'dark-darken': '#19191b',
                'dark-lighten': '#333335',
                'dark-lighten-2': '#49494b',
            },
            gridTemplateColumns: {
                sm: 'repeat(auto-fill, minmax(130px, 1fr))',
                lg: 'repeat(auto-fill, minmax(160px, 1fr))',
            },
        },
    },
}
