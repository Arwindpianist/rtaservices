import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		fontFamily: {
  			sans: [
  				'Helvetica',
  				'"Helvetica Neue"',
  				'Arial',
  				'sans-serif'
  			]
  		},
  		fontSize: {
  			hero: [
  				'64px',
  				{
  					lineHeight: '1.2',
  					fontWeight: '700'
  				}
  			],
  			'hero-md': [
  				'48px',
  				{
  					lineHeight: '1.2',
  					fontWeight: '700'
  				}
  			],
  			'hero-sm': [
  				'36px',
  				{
  					lineHeight: '1.2',
  					fontWeight: '700'
  				}
  			],
  			h1: [
  				'48px',
  				{
  					lineHeight: '1.2',
  					fontWeight: '700'
  				}
  			],
  			'h1-md': [
  				'36px',
  				{
  					lineHeight: '1.2',
  					fontWeight: '700'
  				}
  			],
  			h2: [
  				'36px',
  				{
  					lineHeight: '1.2',
  					fontWeight: '700'
  				}
  			],
  			'h2-md': [
  				'28px',
  				{
  					lineHeight: '1.2',
  					fontWeight: '700'
  				}
  			],
  			h3: [
  				'24px',
  				{
  					lineHeight: '1.3',
  					fontWeight: '700'
  				}
  			],
  			'body-lg': [
  				'18px',
  				{
  					lineHeight: '1.6',
  					fontWeight: '400'
  				}
  			],
  			body: [
  				'16px',
  				{
  					lineHeight: '1.6',
  					fontWeight: '400'
  				}
  			],
  			'body-sm': [
  				'14px',
  				{
  					lineHeight: '1.5',
  					fontWeight: '400'
  				}
  			]
  		},
  		colors: {
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			primary: {
  				'50': '#fffbf0',
  				'100': '#fff7e0',
  				'200': '#ffefc2',
  				'300': '#ffe699',
  				'400': '#ffdd66',
  				'500': '#FFBF23',
  				'600': '#E6A91F',
  				'700': '#B8860B',
  				'800': '#9A7209',
  				'900': '#7A5A07',
  				DEFAULT: '#B8860B',
  				foreground: '#FFFFFF'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			'rta-text': '#1A1A1A',
  			'rta-text-secondary': '#424242',
  			'rta-text-light': '#6B6B6B',
  			'rta-text-muted': '#6B6B6B',
  			'rta-bg-light': '#F9F9F9',
  			'rta-bg-blue': '#E8EFF9',
  			'rta-footer': '#1A1A1A',
  			'rta-border': '#D1D1D1',
  			'rta-blue': '#1A3D6E',
  			'rta-blue-hover': '#132d55',
  			'rta-gold': '#FFBF23',
  			'rta-gold-hover': '#E6A91F',
  			'rta-gold-cta': '#B8860B',
  			'rta-gold-cta-hover': '#9A7209',
  			'rta-card-bg': '#F9F9F9',
  			'rta-red': '#E0292D',
  			'rta-red-hover': '#C41E22',
  			'rta-black': '#1A1A1A',
  			'rta-tier-grey': '#6B6B6B',
  			'rta-tier-light': '#8C8C8C'
  		},
  		spacing: {
  			section: '100px',
  			'section-md': '80px',
  			'section-sm': '60px',
  			container: '40px',
  			'container-sm': '20px'
  		},
  		maxWidth: {
  			container: '1400px',
  			content: '1200px'
  		},
  		borderRadius: {
  			lg: '8px',
  			md: '6px',
  			sm: '4px'
  		},
  		boxShadow: {
  			card: '0 2px 8px rgba(0, 0, 0, 0.1)',
  			'card-hover': '0 4px 12px rgba(0, 0, 0, 0.15)',
  			button: '0 2px 4px rgba(0, 0, 0, 0.1)'
  		},
  		transitionDuration: {
  			'250': '250ms',
  			'300': '300ms'
  		},
  		transitionTimingFunction: {
  			'smooth': 'cubic-bezier(0.22, 1, 0.36, 1)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;

