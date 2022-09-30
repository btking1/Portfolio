/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	darkMode: 'class',
	theme: {
		extend: {
			fontFamily: {
				mplus: ['M PLUS Rounded 1c', 'sans-serif'],
				architects: ['Architects Daughter', 'cursive'],
				kosugi: ['Kosugi Maru', 'sans-serif'],
				jetbrains: ['JetBrains Mono', 'monospace'],
			},
		},
	},
	plugins: [],
}
