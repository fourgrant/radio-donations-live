/** @type {import('tailwindcss').Config} */

const round = (num) =>
  num
    .toFixed(7)
    .replace(/(\.[0-9]+?)0+$/, '$1')
    .replace(/\.0$/, '')
const rem = (px) => `${round(px / 16)}rem`
const em = (px, base) => `${round(px / base)}em`
const hexToRgb = (hex) => {
  hex = hex.replace('#', '')
  hex = hex.length === 3 ? hex.replace(/./g, '$&$&') : hex
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  return `${r} ${g} ${b}`
}


export default {
  darkMode: 'class',
  content: ["../app/javascript/packs/transactions.jsx"],
  theme: {
    extend: {
      maxWidth: {
        'xxs': '200px',
      },
      colors: {
        'bg-screen': '#ffffff9c',
        'black': '#363537',
        'white': '#ffffff',
        'type': '#ffffff',
        brown: {
          100: '#efe5ce',
          200: '#e0cb9c',
          300: '#d0b26b',
          400: '#c19839',
          500: '#b17e08',
          600: '#8e6506',
          700: '#6a4c05',
          800: '#473203',
          900: '#231902',
        },
        rust: {
          50: '#f4ddd7',
          100: '#f4ddd7',
          200: '#e8bbb0',
          300: '#dd9888',
          400: '#d17661',
          500: '#c65439',
          600: '#9e432e',
          700: '#773222',
          800: '#4f2217',
          900: '#28110b',
          950: '#28110b',
        },
        beige: {
          100: '#f8f7f4',
          200: '#f0efe8',
          300: '#e9e8dd',
          400: '#e1e0d1',
          500: '#dad8c6',
          600: '#aead9e',
          700: '#838277',
          800: '#57564f',
          900: '#2c2b28',
        },
        darkslate: {
          100: '#ced7d9',
          200: '#9eaeb3',
          300: '#6d868d',
          400: '#3d5d67',
          500: '#0c3541',
          600: '#0a2a34',
          700: '#072027',
          800: '#05151a',
          900: '#020b0d',
        },
        yellow: {
          100: '#fdf2da',
          200: '#fae4b5',
          300: '#f8d791',
          400: '#f5c96c',
          500: '#f3bc47',
          600: '#c29639',
          700: '#92712b',
          800: '#614b1c',
          900: '#31260e',
        },
        brightyellow: {
          100: '#fff6d6',
          200: '#ffecac',
          300: '#ffe383',
          400: '#ffd959',
          500: '#ffd030',
          600: '#cca626',
          700: '#997d1d',
          800: '#665313',
          900: '#332a0a',
        },
        nude: {
          100: '#fdf2f1',
          200: '#fae5e2',
          300: '#f8d7d4',
          400: '#f5cac5',
          500: '#f3bdb7',
          600: '#c29792',
          700: '#92716e',
          800: '#614c49',
          900: '#312625',
        },
        darkgray: {
          50: '#959495',
          100: '#7F7F80',
          200: '#555455',
          300: '#403F41',
          400: '#353436',
          500: '#2A292B',
          600: '#262527',
          700: '#222122',
          800: '#1D1D1E',
          900: '#19191A',
          950: '#151415',
        },
        deepblue: {
          50: '#D2D9E5',
          100: '#C6D0DE',
          200: '#8FA1BE',
          300: '#5F7DA3',
          400: '#315789',
          500: '#18447B',
          600: '#133762',
          700: '#0F2949',
          800: '#0A1B32',
          900: '#091425',
          950: '#07111F',
        },
        lightblue: {
          50: '#D5E7F3',
          100: '#CAE1F1',
          200: '#AAD0E8',
          300: '#7DB8DC',
          400: '#4EA0CF',
          500: '#0788C3',
          600: '#096D9C',
          700: '#0C5275',
          800: '#09364E',
          900: '#082231',
          950: '#071B27',
        },
        lightgray: {
          50: '#F4F4F4',
          100: '#EAEAEA',
          200: '#D5D5D5',
          300: '#C0C0C0',
          400: '#AAAAAA',
          500: '#959595',
          600: '#808080',
          700: '#6B6B6B',
          800: '#555555',
          900: '#414141',
          950: '#363636',
        },
        purple: {
          50: '#e8e0ea',
          100: '#dbd4dd',
          200: '#b7a8bb',
          300: '#947d9a',
          400: '#705178',
          500: '#4c2656',
          600: '#3d1e45',
          700: '#2e1734',
          800: '#1e0f22',
          900: '#190C1C',
          950: '#0f0811',
        },
        cyan: {
          50: '#d4f5f9',
          100: '#ceeef1',
          200: '#9ddde3',
          300: '#6bccd6',
          400: '#3abbc8',
          500: '#09aaba',
          600: '#078895',
          700: '#056670',
          800: '#04444a',
          900: '#03363A',
          950: '#05272A',
        },
        sand: {
          50: '#fcf7ed',
          100: '#fcf7ed',
          200: '#f9f0dc',
          300: '#f5e8ca',
          400: '#f2e1b9',
          500: '#efd9a7',
          600: '#bfae86',
          700: '#8f8264',
          800: '#605743',
          900: '#302b21',
          950: '#221E17',
        },
        pink: {
          50: '#fcdce3',
          100: '#fcdce3',
          200: '#f9b9c8',
          300: '#f697ac',
          400: '#f37491',
          500: '#f05175',
          600: '#c0415e',
          700: '#903146',
          800: '#60202f',
          900: '#301017',
          950: '#230C11',
        },
        legacybase: {
          50: '#fdfdfc',
          100: '#f8f7f4',
          200: '#f0efe8',
          300: '#e9e8dd',
          400: '#e1e0d1',
          500: '#dad8c6',
          600: '#aead9e',
          700: '#838277',
          800: '#57564f',
          900: '#2c2b28',
          950: '#212121',
        },
      },
      typography: (theme) => ({

        DEFAULT: {
          css:
            {
              '--tw-prose-body': theme('colors.legacybase[800]'),
              '--tw-prose-headings': theme('colors.rust[500]'),
              '--tw-prose-lead': theme('colors.legacybase[700]'),
              '--tw-prose-links': theme('colors.legacybase[900]'),
              '--tw-prose-bold': theme('colors.legacybase[900]'),
              '--tw-prose-counters': theme('colors.legacybase[600]'),
              '--tw-prose-bullets': theme('colors.legacybase[400]'),
              '--tw-prose-hr': theme('colors.legacybase[300]'),
              '--tw-prose-quotes': theme('colors.legacybase[900]'),
              '--tw-prose-quote-borders': theme('colors.legacybase[300]'),
              '--tw-prose-captions': theme('colors.legacybase[700]'),
              '--tw-prose-code': theme('colors.legacybase[900]'),
              '--tw-prose-pre-code': theme('colors.legacybase[100]'),
              '--tw-prose-pre-bg': theme('colors.legacybase[900]'),
              '--tw-prose-th-borders': theme('colors.legacybase[300]'),
              '--tw-prose-td-borders': theme('colors.legacybase[200]'),

              '--tw-prose-invert-body': theme('colors.legacybase[200]'),
              '--tw-prose-invert-headings': theme('colors.pink[500]'),
              '--tw-prose-invert-lead': theme('colors.legacybase[300]'),
              '--tw-prose-invert-links': theme('colors.white'),
              '--tw-prose-invert-bold': theme('colors.white'),
              '--tw-prose-invert-counters': theme('colors.legacybase[400]'),
              '--tw-prose-invert-bullets': theme('colors.legacybase[600]'),
              '--tw-prose-invert-hr': theme('colors.legacybase[700]'),
              '--tw-prose-invert-quotes': theme('colors.legacybase[100]'),
              '--tw-prose-invert-quote-borders': theme('colors.legacybase[700]'),
              '--tw-prose-invert-captions': theme('colors.legacybase[400]'),
              '--tw-prose-invert-code': theme('colors.white'),
              '--tw-prose-invert-pre-code': theme('colors.legacybase[300]'),
              '--tw-prose-invert-pre-bg': 'rgba(0, 0, 0, 50%)',
              '--tw-prose-invert-th-borders': theme('colors.legacybase[600]'),
              '--tw-prose-invert-td-borders': theme('colors.legacybase[700]'),

              color: 'var(--tw-prose-body)',
              maxWidth: '65ch',



              fontSize: rem(18),
              lineHeight: round(32 / 18),
              p: {
                marginTop: em(24, 18),
                marginBottom: em(24, 18),
              },
              '[class~="lead"]': {
                fontSize: em(22, 18),
                lineHeight: round(32 / 22),
                marginTop: em(24, 22),
                marginBottom: em(24, 22),
              },
              blockquote: {
                marginTop: em(40, 24),
                marginBottom: em(40, 24),
                paddingLeft: em(24, 24),
              },
              h1: {
                fontSize: em(48, 18),
                marginTop: '0',
                marginBottom: em(40, 48),
                lineHeight: round(48 / 48),
              },
              h2: {
                fontSize: em(30, 18),
                marginTop: em(56, 30),
                marginBottom: em(32, 30),
                lineHeight: round(40 / 30),
              },
              h3: {
                fontSize: em(24, 18),
                marginTop: em(40, 24),
                marginBottom: em(16, 24),
                lineHeight: round(36 / 24),
              },
              h4: {
                marginTop: em(32, 18),
                marginBottom: em(8, 18),
                lineHeight: round(28 / 18),
              },
              img: {
                marginTop: 0,
                marginBottom: em(32, 18),
              },
              picture: {
                marginTop: em(32, 18),
                marginBottom: em(32, 18),
              },
              'picture > img': {
                marginTop: '0',
                marginBottom: '0',
              },
              video: {
                marginTop: em(32, 18),
                marginBottom: em(32, 18),
              },
              kbd: {
                fontSize: em(16, 18),
                borderRadius: rem(5),
                paddingTop: em(4, 18),
                paddingRight: em(8, 18),
                paddingBottom: em(4, 18),
                paddingLeft: em(8, 18),
              },
              code: {
                fontSize: em(16, 18),
              },
              'h2 code': {
                fontSize: em(26, 30),
              },
              'h3 code': {
                fontSize: em(21, 24),
              },
              pre: {
                fontSize: em(16, 18),
                lineHeight: round(28 / 16),
                marginTop: em(32, 16),
                marginBottom: em(32, 16),
                borderRadius: rem(6),
                paddingTop: em(16, 16),
                paddingRight: em(24, 16),
                paddingBottom: em(16, 16),
                paddingLeft: em(24, 16),
              },
              ol: {
                marginTop: em(24, 18),
                marginBottom: em(24, 18),
                paddingLeft: em(28, 18),
              },
              ul: {
                marginTop: em(24, 18),
                marginBottom: em(24, 18),
                paddingLeft: em(28, 18),
              },
              li: {
                marginTop: em(12, 18),
                marginBottom: em(12, 18),
              },
              'ol > li': {
                paddingLeft: em(8, 18),
              },
              'ul > li': {
                paddingLeft: em(8, 18),
              },
              '> ul > li p': {
                marginTop: em(16, 18),
                marginBottom: em(16, 18),
              },
              '> ul > li > *:first-child': {
                marginTop: em(24, 18),
              },
              '> ul > li > *:last-child': {
                marginBottom: em(24, 18),
              },
              '> ol > li > *:first-child': {
                marginTop: em(24, 18),
              },
              '> ol > li > *:last-child': {
                marginBottom: em(24, 18),
              },
              'ul ul, ul ol, ol ul, ol ol': {
                marginTop: em(16, 18),
                marginBottom: em(16, 18),
              },
              dl: {
                marginTop: em(24, 18),
                marginBottom: em(24, 18),
              },
              dt: {
                marginTop: em(24, 18),
              },
              dd: {
                marginTop: em(12, 18),
                paddingLeft: em(28, 18),
              },
              hr: {
                marginTop: em(56, 18),
                marginBottom: em(56, 18),
              },
              'hr + *': {
                marginTop: '0',
              },
              'h2 + *': {
                marginTop: '0',
              },
              'h3 + *': {
                marginTop: '0',
              },
              'h4 + *': {
                marginTop: '0',
              },
              table: {
                fontSize: em(16, 18),
                lineHeight: round(24 / 16),
              },
              'thead th': {
                paddingRight: em(12, 16),
                paddingBottom: em(12, 16),
                paddingLeft: em(12, 16),
              },
              'thead th:first-child': {
                paddingLeft: '0',
              },
              'thead th:last-child': {
                paddingRight: '0',
              },
              'tbody td, tfoot td': {
                paddingTop: em(12, 16),
                paddingRight: em(12, 16),
                paddingBottom: em(12, 16),
                paddingLeft: em(12, 16),
              },
              'tbody td:first-child, tfoot td:first-child': {
                paddingLeft: '0',
              },
              'tbody td:last-child, tfoot td:last-child': {
                paddingRight: '0',
              },
              figure: {
                marginTop: em(32, 18),
                marginBottom: em(32, 18),
              },
              'figure > *': {
                marginTop: '0',
                marginBottom: '0',
              },
              figcaption: {
                fontSize: em(16, 18),
                lineHeight: round(24 / 16),
                marginTop: em(16, 16),
              },


            },
          },
      }),
    },
  },
}

