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
  },
  
  // Cartridge Text Positions (relative to the cartridge image on Projects page)
  // Edit these values to move the title, summary, subheading, and tags around the image.
  cartridgeLayout: {
    title: {
      top: '10%',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '80%'
    },
    subheading: {
      top: '25%',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '80%'
    },
    summary: {
      top: '40%',
      left: '25%',
      width: '50%'
    },
    tags: {
      bottom: '10%',
      left: '10%',
      width: '80%'
    }
  },
  
  // General Library of Pokémon Sprites
  // You can use these URLs in your HTML content.
  pokemonLibrary: {
    bellsprout: "https://img.pokemondb.net/sprites/black-white/anim/normal/bellsprout.gif"
  }
};
