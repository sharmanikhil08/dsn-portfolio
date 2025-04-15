document.addEventListener('DOMContentLoaded', function () {
  const blogCards = document.querySelectorAll('.collection-item[data-w-id^="c5bcecb6-"]'); // Be more specific

  blogCards.forEach(card => {
    const imageContainer = card.querySelector('.blog-image-container[data-w-id^="c5bcecb6-"]'); // Be more specific
    const titleContainer = card.querySelector('.blog-post-title-container[data-w-id^="c5bcecb6-"]'); // Find the title container
    const overlay = card.querySelector('.blog-image-overlay');
    const readCircle = card.querySelector('.blog-read-circle.shadow-01');

    if (!imageContainer || !overlay || !readCircle) {
      // console.warn('Skipping card, missing required elements.', card);
      return;
    }

    // *** Prevent ALL Webflow JS conflicts for this specific card interaction ***
    card.removeAttribute('data-w-id');                 // Remove trigger from collection item
    imageContainer.removeAttribute('data-w-id');        // Remove trigger from image container
    if (readCircle) { // Check if readCircle exists before removing its attribute
        readCircle.removeAttribute('data-w-id');       // Remove trigger from read circle 
    }
    if (titleContainer) { // Check if title container exists and remove its ID
        titleContainer.removeAttribute('data-w-id');
    }
    // Also remove any inline transform/opacity styles Webflow might have set initially
    if(readCircle) readCircle.style.transform = ''; 
    if(readCircle) readCircle.style.opacity = '';
    if(overlay) overlay.style.opacity = '';


    // --- Initial Styles --- 
    // We set these directly to ensure consistency, potentially overriding Webflow's inline styles.
    // This helps prevent conflicts where Webflow might set display:none initially.
    Object.assign(overlay.style, {
        opacity: '0',
        display: 'block', // Keep in layout but invisible
        transition: 'opacity 0.2s ease-in-out', // Add transition here
        pointerEvents: 'none'
    });
    Object.assign(readCircle.style, {
        opacity: '0',
        display: 'flex', // Keep in layout but invisible
        position: 'absolute',
        top: '0px', // Position absolutely from top-left
        left: '0px',
        pointerEvents: 'none',
        willChange: 'transform, opacity',
        transition: 'opacity 0.2s ease-in-out, transform 0.05s linear', // Smooth opacity, quick transform
        // Set initial transform to center the circle (relative to its own size)
        transform: 'translate(-50%, -50%)' 
    });
    // Ensure container has relative positioning for absolute children
    if (window.getComputedStyle(imageContainer).position === 'static') {
        imageContainer.style.position = 'relative';
    }

    // --- Event Listeners --- 
    imageContainer.addEventListener('mouseenter', () => {
      overlay.style.opacity = '1';
      readCircle.style.opacity = '1';
    });

    imageContainer.addEventListener('mouseleave', () => {
      overlay.style.opacity = '0';
      readCircle.style.opacity = '0';
      // No need to reset transform, opacity 0 hides it
    });

    imageContainer.addEventListener('mousemove', (e) => {
      if (readCircle.style.opacity === '0') return; // Don't move if hidden

      const containerRect = imageContainer.getBoundingClientRect();
      const circleRect = readCircle.getBoundingClientRect(); // Get size dynamically 
      const circleWidth = circleRect.width;
      const circleHeight = circleRect.height;

      // Calculate mouse position relative to the image container's top-left corner
      let x = e.clientX - containerRect.left;
      let y = e.clientY - containerRect.top;

      // Clamp coordinates: Ensure the CENTER of the circle stays within the bounds
      x = Math.max(circleWidth / 2, Math.min(x, containerRect.width - circleWidth / 2));
      y = Math.max(circleHeight / 2, Math.min(y, containerRect.height - circleHeight / 2));

      // Update position: Move top-left corner to (x,y) then translate back by 50% of size
      // Update position using translate. The (x,y) is the desired center point.
      readCircle.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`; 
    });
  });
}); 