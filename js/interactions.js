// js/interactions.js

document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Setup Retro Press Interaction
  // Handles the tactile button press feel for touch devices where :active can be flaky
  const pressElements = document.querySelectorAll('.retro-press');
  
  pressElements.forEach(el => {
    el.addEventListener('touchstart', () => {
      el.classList.add('is-pressed');
    }, {passive: true});
    
    el.addEventListener('touchend', () => {
      el.classList.remove('is-pressed');
    }, {passive: true});
    
    el.addEventListener('touchcancel', () => {
      el.classList.remove('is-pressed');
    }, {passive: true});
  });

  // 2. Highlight Active Nav Tab
  // Checks the current URL and adds the 'active' class to the corresponding nav link
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-links a');
  
  navLinks.forEach(link => {
    // get the filename from the link href
    const linkPath = new URL(link.href).pathname;
    
    // Check if the current path ends with the link path, or if we are at root and link is index.html
    if (currentPath.endsWith(linkPath) || 
       (currentPath.endsWith('/') && linkPath.endsWith('index.html')) ||
       (currentPath.includes('project.html') && linkPath.endsWith('projects.html'))) {
      link.classList.add('active');
    }
  });

});

// Helper function to render line numbers for code blocks
function renderLineNumbers() {
  const codeBlocks = document.querySelectorAll('.about-code-block');
  codeBlocks.forEach(block => {
    const textContent = block.querySelector('.code-content').textContent;
    const linesCount = textContent.split('\n').length;
    
    let numbersHTML = '';
    for (let i = 1; i <= linesCount; i++) {
      numbersHTML += `<span>${i}</span>`;
    }
    
    let lineNumbersContainer = block.querySelector('.line-numbers');
    if (!lineNumbersContainer) {
      lineNumbersContainer = document.createElement('div');
      lineNumbersContainer.className = 'line-numbers';
      block.insertBefore(lineNumbersContainer, block.firstChild);
    }
    lineNumbersContainer.innerHTML = numbersHTML;
  });
}
