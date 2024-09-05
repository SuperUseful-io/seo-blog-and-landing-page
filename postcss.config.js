const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

module.exports = {
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
    require('cssnano')({
      preset: 'default',
    }),
    require('postcss-import'),
  ],
};