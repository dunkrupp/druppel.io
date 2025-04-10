/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './_site/**/*.html', // For production builds
    './*.html', // Your HTML files
    './_layouts/*.html', // Your layouts
    './_includes/*.html', // Your includes
    './_posts/*.md', // Your posts (if you have any)
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}