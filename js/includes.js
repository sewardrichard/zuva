/* ==========================================================================
   HTML Includes Loader
   Loads HTML component files into placeholder elements
   ========================================================================== */

async function loadComponent(elementId, componentPath) {
    try {
        const response = await fetch(componentPath);
        if (!response.ok) throw new Error(`Failed to load ${componentPath}`);
        const html = await response.text();
        document.getElementById(elementId).innerHTML = html;
    } catch (error) {
        console.error(`Error loading component: ${error.message}`);
    }
}

async function loadAllComponents() {
    const components = [
        { id: 'nav-placeholder', path: 'components/nav.html' },
        { id: 'hero-placeholder', path: 'components/hero.html' },
        { id: 'about-placeholder', path: 'components/about.html' },
        { id: 'services-placeholder', path: 'components/services.html' },
        { id: 'transitions-placeholder', path: 'components/transitions.html' },
        { id: 'testimonials-placeholder', path: 'components/testimonials.html' },
        { id: 'cta-placeholder', path: 'components/cta.html' },
        { id: 'footer-placeholder', path: 'components/footer.html' }
    ];

    // Load all components in parallel
    await Promise.all(components.map(c => loadComponent(c.id, c.path)));
    
    // After all components are loaded, initialize the main JS
    if (typeof initAll === 'function') {
        initAll();
    }
}

// Load components when DOM is ready
document.addEventListener('DOMContentLoaded', loadAllComponents);
