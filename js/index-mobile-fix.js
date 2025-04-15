document.addEventListener('DOMContentLoaded', function () {
    // Run only on mobile (matches max-width: 991px)
    if (window.innerWidth <= 991) {
        // Use setTimeout to ensure this runs slightly after other scripts like webflow.js might initialize
        setTimeout(() => {
            // Target the specific cards using their link's href attribute
            const problemCardHrefs = [
                'blog/automate-social-media-carousels.html',
                'blog/ai-linkedin-marketing-linkroo.html'
            ];

            problemCardHrefs.forEach(href => {
                // Find any link with this href, then go up to the parent collection item
                const linkElement = document.querySelector(`a[href="${href}"]`);
                if (linkElement) {
                    const card = linkElement.closest('.collection-item');
                    if (card) {
                        const overlay = card.querySelector('.blog-image-overlay');
                        const readCircle = card.querySelector('.blog-read-circle.shadow-01');

                        // Force hide using inline styles with !important via setProperty
                        if (overlay) {
                            overlay.style.setProperty('opacity', '0', 'important');
                            overlay.style.setProperty('display', 'none', 'important');
                        }
                        if (readCircle) {
                            readCircle.style.setProperty('opacity', '0', 'important');
                            readCircle.style.setProperty('display', 'none', 'important');
                        }
                        // console.log(`Forced hide on mobile for card: ${href}`);
                    }
                }
            });
        }, 50); // Delay slightly (50ms) to increase chance of running after Webflow JS
    }
}); 