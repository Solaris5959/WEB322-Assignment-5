/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [`./views/*.ejs`, './view/partials/*.ejs'],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
  daisyui: {
    themes: ['cupcake'],
  },
}