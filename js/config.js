// js/config.js
// Centralized configuration for the personal website.

const siteConfig = {
  // Pokemon Sprite Positions and Sizes (relative to the splash container on Home page)
  // 'top', 'left', 'bottom', 'right', and 'width' accept CSS units (%, px, etc).
  // Using % for width ensures they scale proportionally when the splash image resizes.
  sprites: {
    purrloin: {
      width: '18%',
      top: '20%',
      left: '54%',
      transform: 'translateX(-50%)'
    },
    meowth: {
      width: '23%',
      bottom: '17%',
      left: '14%',
      transform: 'none'
    },
    skitty: {
      width: '20%',
      bottom: '4%',
      right: '6%',
      transform: 'none'
    }
  }
};
