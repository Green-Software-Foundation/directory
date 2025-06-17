/** @type {import('tailwindcss').Config} */

import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  darkMode: ["class"],
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    container: {
      center: "true",
    },
    extend: {
      fontFamily: {
        sans: ["Nunito Sans", ...fontFamily.sans],
      },
      colors: {
        primary: {
          DEFAULT: "var(--primary)",
          dark: "var(--primary-dark)",
          darker: "var(--primary-darker)",
          darkest: "var(--primary-darkest)",
          "darkest-2": "var(--primary-darkest-2)",
          light: "var(--primary-light)",
          lighter: "var(--primary-lighter)",
          "lightest-1": "var(--primary-lightest-1)",
          "lightest-2": "var(--primary-lightest-2)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          dark: "var(--accent-dark)",
          darker: "var(--accent-darker)",
          light: "var(--accent-light)",
          lighter: "var(--accent-lighter)",
          "lightest-1": "var(--accent-lightest-1)",
          "lightest-2": "var(--accent-lightest-2)",
        },
        gray: {
          DEFAULT: "var(--gray)",
          darker: "var(--gray-darker)",
          dark: "var(--gray-dark)",
          light: "var(--gray-light)",
          lighter: "var(--gray-lighter)",
          "lightest-1": "var(--gray-lightest-1)",
          "lightest-2": "var(--gray-lightest-2)",
        },
        background: "var(--background)",
        foreground: "var(--black)",
        black: "var(--black)",
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      typography: {
        DEFAULT: {
          css: {
            '--tw-prose-body': 'var(--gray-darker)',
            '--tw-prose-headings': 'var(--primary-dark)',
            '--tw-prose-links': 'var(--primary-dark)',
            '--tw-prose-bold': 'var(--primary-darker)',
            '--tw-prose-counters': 'var(--primary)',
            '--tw-prose-bullets': 'var(--primary)',
            '--tw-prose-hr': 'var(--gray-dark)',
            '--tw-prose-quotes': 'var(--primary-darker)',
            '--tw-prose-quote-borders': 'var(--primary)',
            '--tw-prose-captions': 'var(--gray-dark)',
            '--tw-prose-code': 'var(--primary-darker)',
            '--tw-prose-pre-code': 'var(--gray-darker)',
            '--tw-prose-pre-bg': 'var(--gray-lightest-2)',
            '--tw-prose-th-borders': 'var(--gray)',
            '--tw-prose-td-borders': 'var(--gray-light)',
            'h1': { 
              fontSize: '1.5rem',
              marginTop: '1.25em',
              marginBottom: '0.5em'
            },
            'h2': { 
              fontSize: '1.25rem',
              marginTop: '1.25em',
              marginBottom: '0.5em'
            },
            'h3': { 
              fontSize: '1rem',
              marginTop: '1em',
              marginBottom: '0.5em'
            },
            'h4': { fontSize: '0.875rem' },
            'h5': { fontSize: '0.75rem' },
            'h6': { fontSize: '0.675rem' },
            'p': {
              marginTop: '1.5em',
              marginBottom: '1.5em'
            },
            'ul': {
              marginTop: '1.5em',
              marginBottom: '1.5em'
            },
            'li': {
              marginTop: '0.5em',
              marginBottom: '0.5em'
            }
          }
        }
      }
    },
  },
  plugins: [require("tailwindcss-animate"), require('@tailwindcss/typography')],
};
