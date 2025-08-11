// rollup.config.js
export default {
  input: 'src/index.js',
  output: {
    file: 'dist/bundle.js',
    format: 'iife', // Change format to 'iife' for browser compatibility
    name: 'initImageMarker' // Expose the function globally as 'initImageMarker'
  }
};