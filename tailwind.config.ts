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
  				'"Noto Sans Grantha"',
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
  			'rta-text': 'var(--rta-text)',
  			'rta-text-secondary': 'var(--rta-text-secondary)',
  			'rta-text-light': 'var(--rta-text-muted)',
  			'rta-text-muted': 'var(--rta-text-muted)',
  			'rta-bg-light': 'var(--main-bg-light)',
  			'rta-bg-blue': 'var(--main-bg-blue)',
  			'rta-footer': 'var(--rta-black)',
  			'rta-border': 'var(--rta-border)',
  			'rta-blue': 'var(--rta-blue)',
  			'rta-blue-hover': 'var(--rta-blue-hover)',
  			'rta-gold': 'var(--rta-gold)',
  			'rta-gold-hover': 'var(--rta-gold-hover)',
  			'rta-gold-cta': 'var(--rta-gold-cta)',
  			'rta-gold-cta-hover': 'var(--rta-gold-cta-hover)',
  			'rta-card-bg': 'var(--rta-card-bg)',
  			'rta-red': 'var(--rta-red)',
  			'rta-red-hover': 'var(--rta-red-hover)',
  			'rta-black': 'var(--rta-black)',
  			'rta-tier-grey': 'var(--rta-tier-bg)',
  			'rta-tier-light': 'var(--rta-tier-bg-light)'
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
			button: '0 2px 4px rgba(0, 0, 0, 0.1)',
			'neu-flat': '-8px -8px 16px rgba(255, 255, 255, 0.03), 8px 8px 16px rgba(0, 0, 0, 0.4)',
			'neu-pressed': 'inset -6px -6px 12px rgba(255, 255, 255, 0.03), inset 6px 6px 12px rgba(0, 0, 0, 0.4)',
			'neu-glow': '0 0 0 1px rgba(63, 243, 201, 0.35), 0 0 14px rgba(63, 243, 201, 0.32)'
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

