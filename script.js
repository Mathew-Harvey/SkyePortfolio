document.addEventListener('DOMContentLoaded', function() {

    // --- Preloader ---
    window.addEventListener('load', () => {
        document.body.classList.remove('preload');
    });

    // --- Sticky Header ---
    const header = document.querySelector('.site-header');
    const scrollThreshold = 50; // Pixels to scroll before header becomes sticky

    const handleScrollHeader = () => {
        if (window.scrollY > scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    // --- Back to Top Button ---
    const backToTopButton = document.getElementById('back-to-top');
    const backToTopThreshold = 300; // Pixels to scroll before button appears

    const handleScrollBackToTop = () => {
         if (window.scrollY > backToTopThreshold) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    };

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });


    // --- Scroll Reveal Animations ---
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Set delay from data-delay attribute or default
                const delay = entry.target.dataset.delay ? parseInt(entry.target.dataset.delay) : 0;
                entry.target.style.transitionDelay = `${delay}ms`;

                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Optional: Animate only once
            }
            // Optional: Add else block to remove 'visible' if you want elements to hide again when scrolling out
            // else {
            //     entry.target.classList.remove('visible');
            // }
        });
    }, {
        threshold: 0.1, // Trigger when 10% of the element is visible
        // rootMargin: "0px 0px -50px 0px" // Optional: Adjust trigger point
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });


    // --- Combined Scroll Handler ---
    window.addEventListener('scroll', () => {
        handleScrollHeader();
        handleScrollBackToTop();
    }, { passive: true }); // Improve scroll performance

    // --- Mobile Navigation Toggle (Basic Example) ---
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    // const mobileNavPanel = document.querySelector('.mobile-nav-panel'); // Assuming you create this panel

    if (mobileNavToggle) {
        mobileNavToggle.addEventListener('click', () => {
            const isExpanded = mobileNavToggle.getAttribute('aria-expanded') === 'true';
            mobileNavToggle.setAttribute('aria-expanded', !isExpanded);
            // Add logic to show/hide your mobile navigation panel here
            // e.g., document.body.classList.toggle('mobile-nav-open');
            //      mobileNavPanel.classList.toggle('is-open');
            mobileNavToggle.classList.toggle('is-active'); // For animating the burger icon
            console.log('Mobile nav toggled (implement panel logic)');
        });
    }

    // --- Set current year in footer ---
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

});