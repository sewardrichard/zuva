/* ==========================================================================
   Zuva Mental Health & Wellness - Main JavaScript
   ========================================================================== */

// Note: When using includes.js, components are loaded dynamically
// and init functions are called after components load.
// When NOT using includes (standalone index.html), use DOMContentLoaded below.

function initAll() {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    initMobileMenu();
    initScrollAnimations();
    initNavbarScroll();
    initTestimonialSlider();
    runSunIntro();
}

// For standalone usage (when not using includes.js)
document.addEventListener('DOMContentLoaded', function() {
    // Only init if components are already in the DOM (not using includes)
    if (!document.getElementById('nav-placeholder')) {
        initAll();
    }
});

/* ==========================================================================
   Mobile Menu
   ========================================================================== */
function initMobileMenu() {
    const btn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');

    if (btn && menu) {
        btn.addEventListener('click', () => {
            menu.classList.toggle('hidden');
        });
    }
}

/* ==========================================================================
   Scroll Animations (Intersection Observer)
   ========================================================================== */
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('scroll-visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    document.querySelectorAll('.scroll-hidden').forEach((el) => {
        observer.observe(el);
    });
}

/* ==========================================================================
   Navbar Glass Effect on Scroll
   ========================================================================== */
function initNavbarScroll() {
    window.addEventListener('scroll', () => {
        const nav = document.getElementById('navbar');
        if (nav) {
            if (window.scrollY > 50) {
                nav.classList.add('bg-white/80');
                nav.classList.add('shadow-sm');
            } else {
                nav.classList.remove('bg-white/80');
                nav.classList.remove('shadow-sm');
            }
        }
    });
}

/* ==========================================================================
   Testimonial Slider
   ========================================================================== */
const testimonials = [
    {
        quote: "Zuva didn't just help me cope; it taught me how to bloom. I finally feel at home in my own life.",
        name: "Sarah M.",
        role: "Creative Director, 29",
        img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop"
    },
    {
        quote: "The holistic approach changed everything. I stopped treating symptoms and started healing my soul.",
        name: "Elena R.",
        role: "Architect, 34",
        img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop"
    },
    {
        quote: "A safe haven in a chaotic world. The 'New Beginnings' program gave me the closure I didn't know I needed.",
        name: "Maya T.",
        role: "Graduate Student, 24",
        img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop"
    }
];

let currentSlide = 0;

function initTestimonialSlider() {
    renderSlide(0);
}

function renderSlide(index) {
    const container = document.getElementById('testimonial-container');
    if (!container) return;

    // Fade out
    const current = container.querySelector('.testimonial-slide');
    if (current) current.classList.remove('opacity-100');
    
    setTimeout(() => {
        const t = testimonials[index];
        container.innerHTML = `
            <div class="testimonial-slide opacity-0 transition-opacity duration-500 absolute inset-0 flex flex-col items-center justify-center">
                 <h3 class="font-serif text-2xl md:text-3xl text-zuva-taupe italic mb-8 leading-normal max-w-2xl">
                    "${t.quote}"
                </h3>
                <div class="flex items-center gap-4">
                    <img src="${t.img}" alt="${t.name}" class="w-12 h-12 rounded-full object-cover border-2 border-zuva-peach/30">
                    <div class="text-left">
                        <p class="font-sans font-semibold text-zuva-taupe text-sm">${t.name}</p>
                        <p class="font-sans text-xs text-zuva-taupe/60">${t.role}</p>
                    </div>
                </div>
            </div>
        `;
        // Trigger reflow
        setTimeout(() => {
            const slide = container.querySelector('.testimonial-slide');
            if (slide) slide.classList.add('opacity-100');
        }, 50);
    }, 300); // Wait for fade out
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % testimonials.length;
    renderSlide(currentSlide);
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + testimonials.length) % testimonials.length;
    renderSlide(currentSlide);
}

// Expose to global scope for onclick handlers
window.nextSlide = nextSlide;
window.prevSlide = prevSlide;

/* ==========================================================================
   Sun Animation
   ========================================================================== */
let currentSunPosition = 0;
let targetSunPosition = 0;
let sunAnimationId = null;
let isIntroRunning = true;
const SUN_ANIMATION_SPEED = 0.008; // Consistent speed (position units per frame)

// Intro Animation (Sun Rises on Load)
function runSunIntro() {
    targetSunPosition = 0.85;
    animateSunToTarget();
    
    // Mark intro as done after animation completes
    setTimeout(() => {
        isIntroRunning = false;
    }, 2500);
}

// Animate sun smoothly to target position at consistent speed
function animateSunToTarget() {
    // Cancel any existing animation
    if (sunAnimationId) {
        cancelAnimationFrame(sunAnimationId);
    }

    function step() {
        const diff = targetSunPosition - currentSunPosition;
        
        // If close enough, snap to target
        if (Math.abs(diff) < 0.005) {
            currentSunPosition = targetSunPosition;
            updateSunCSS();
            sunAnimationId = null;
            return;
        }
        
        // Move at consistent speed toward target
        const direction = diff > 0 ? 1 : -1;
        currentSunPosition += direction * SUN_ANIMATION_SPEED;
        
        // Clamp to not overshoot
        if (direction > 0 && currentSunPosition > targetSunPosition) {
            currentSunPosition = targetSunPosition;
        } else if (direction < 0 && currentSunPosition < targetSunPosition) {
            currentSunPosition = targetSunPosition;
        }
        
        updateSunCSS();
        sunAnimationId = requestAnimationFrame(step);
    }
    
    sunAnimationId = requestAnimationFrame(step);
}

// Scroll Handler - Updates target, animation handles the rest
window.addEventListener('scroll', () => {
    isIntroRunning = false;

    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const scrollRatio = Math.min(scrollY / windowHeight, 1);

    // Calculate new target: At scroll 0 = 0.85 (high), at scroll 100vh = 0 (horizon)
    targetSunPosition = 0.85 - (scrollRatio * 0.85);
    if (targetSunPosition < 0) targetSunPosition = 0;

    // Start animation toward new target (will cancel existing if direction changed)
    animateSunToTarget();
});

function updateSunCSS() {
    document.documentElement.style.setProperty('--sun-y', currentSunPosition);
}
