import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        3: 'repeat(3, minmax(440px, 1fr))',
      },
      colors: {
        primary: '#1d1c1c',
        secondary: '#d6ae33' 
      },
    },
  },
  plugins: [],
};
export default config;
