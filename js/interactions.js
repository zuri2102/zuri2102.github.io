// js/interactions.js

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-versioned-src]').forEach(asset => {
    asset.src = window.versionedAssetUrl(asset.dataset.versionedSrc);
  });

  document.querySelectorAll('[data-versioned-href]').forEach(asset => {
    asset.href = window.versionedAssetUrl(asset.dataset.versionedHref);
  });

  // Persistent light/dark theme toggle
  const themeToggle = document.createElement('button');
  themeToggle.type = 'button';
  themeToggle.className = 'theme-toggle retro-press';
  themeToggle.innerHTML = `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M11 1h2v3h-2V1Zm0 19h2v3h-2v-3ZM1 11h3v2H1v-2Zm19 0h3v2h-3v-2ZM4.22 5.64l1.42-1.42 2.12 2.12-1.42 1.42-2.12-2.12Zm12.02 12.02 1.42-1.42 2.12 2.12-1.42 1.42-2.12-2.12ZM4.22 18.36l2.12-2.12 1.42 1.42-2.12 2.12-1.42-1.42ZM16.24 6.34l2.12-2.12 1.42 1.42-2.12 2.12-1.42-1.42ZM12 6a6 6 0 1 0 0 12 6 6 0 0 0 0-12Z"/>
    </svg>
  `;
  document.body.appendChild(themeToggle);

  const updateThemeLabel = () => {
    const isDark = document.documentElement.dataset.theme === 'dark';
    themeToggle.setAttribute('aria-label', `Switch to ${isDark ? 'light' : 'dark'} mode`);
  };

  updateThemeLabel();
  themeToggle.addEventListener('click', () => {
    const isDark = document.documentElement.dataset.theme === 'dark';
    if (isDark) {
      delete document.documentElement.dataset.theme;
    } else {
      document.documentElement.dataset.theme = 'dark';
    }

    try {
      localStorage.setItem('theme', isDark ? 'light' : 'dark');
    } catch {
      // The theme still works when storage is unavailable.
    }
    updateThemeLabel();
  });
  
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

  // Fade out before navigating between local pages.
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href]');
    if (!link) return;

    const destination = new URL(link.href, window.location.href);
    const isLocalPage = destination.origin === window.location.origin;
    const isHtmlPage = destination.pathname.endsWith('.html') ||
      destination.pathname.endsWith('/');
    const opensHere = !link.target || link.target === '_self';

    if (!isLocalPage || !isHtmlPage || link.hasAttribute('download')) return;

    const currentTheme = document.documentElement.dataset.theme === 'dark'
      ? 'dark'
      : 'light';
    destination.searchParams.set('theme', currentTheme);
    link.href = destination.href;

    if (!opensHere || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) {
      return;
    }

    event.preventDefault();
    document.body.classList.add('page-fade-out');

    const duration = getComputedStyle(document.documentElement)
      .getPropertyValue('--page-fade-duration').trim();
    const durationMs = duration.endsWith('ms')
      ? parseFloat(duration)
      : parseFloat(duration) * 1000;

    window.setTimeout(() => {
      window.location.href = destination.href;
    }, durationMs);
  });

});

window.addEventListener('pageshow', () => {
  document.body.classList.remove('page-fade-out');
});

window.addEventListener('storage', event => {
  if (event.key !== 'theme') return;

  const isDark = event.newValue === 'dark';
  if (isDark) {
    document.documentElement.dataset.theme = 'dark';
  } else {
    delete document.documentElement.dataset.theme;
  }

  const themeToggle = document.querySelector('.theme-toggle');
  themeToggle?.setAttribute('aria-label', `Switch to ${isDark ? 'light' : 'dark'} mode`);
});

// Give locally hosted images injected from data files the current deploy URL.
// External images are intentionally left untouched.
function versionLocalAssets(container) {
  if (!window.SITE_REVISION) return;

  container.querySelectorAll('[src]').forEach(asset => {
    const assetUrl = new URL(asset.getAttribute('src'), window.location.href);
    if (assetUrl.origin !== window.location.origin) return;

    assetUrl.searchParams.set('v', window.SITE_REVISION);
    asset.src = assetUrl.href;
  });
}

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
