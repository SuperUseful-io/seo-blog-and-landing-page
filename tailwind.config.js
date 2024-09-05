module.exports = {
  content: ['./views/**/*.{md,liquid,html}'],
  plugins: [
    require('daisyui'), 
    require('@tailwindcss/typography')
  ],
  daisyui: {
    themes: ["fantasy"],
  },
};
