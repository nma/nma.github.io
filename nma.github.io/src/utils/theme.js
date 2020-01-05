export default {
  breakpoints: ['32em', '48em', '64em'],
  space: [0, 4, 8, 16, 32, 64, 128, 256, 512],
  // space: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
  fontSizes: [12, 14, 16, 20, 24, 32, 42],
  fontWeights: [1, 10, 100, 200, 300, 400, 500, 600, 700, 800, 900],
  lineHeights: {
    solid: 1,
    title: 1.25,
    copy: 1.5,
  },
  letterSpacings: {
    normal: 'normal',
    tracked: '0.1em',
    tight: '-0.05em',
    mega: '0.25em',
  },
  fonts: {
    serif: 'athelas, georgia, times, serif',
    sansSerif:
      '"Montserrat", "avenir next", avenir, "helvetica neue", helvetica, ubuntu, noto, "segoe ui", arial, sans-serif',
    sansSerifSecondary:
      '"Quicksand", roboto, "avenir next", avenir, "helvetica neue", helvetica, ubuntu, noto, "segoe ui", arial, sans-serif',
  },
  borders: [
    0,
    '1px solid',
    '2px solid',
    '4px solid',
    '8px solid',
    '16px solid',
    '32px solid',
  ],
  radii: [0, 2, 4, 16, 9999, '100%'],
  sizes: [16, 32, 48, 64, 128, 256, 512, 1024, 1200, '100%'],
  colors: {
    black: '#000e1a',
    white: '#fff',

    'greyscale-black': '#1F2041',
    'greyscale-darker': '#575870',
    'greyscale-dark': '#8F8FA0',
    'greyscale-medium': '#C7C7CF',
    'greyscale-light': '#F4F4F5',

    'brand-secondary': '#BC9CFF',
    'brand-secondary-offset': '#8BA4F9',
    'brand-primary': '#6FCF97',
    'brand-primary-offset': '#66D2EA',
  },
}
