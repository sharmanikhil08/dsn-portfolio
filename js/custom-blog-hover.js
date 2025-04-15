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
    // Clear potentially conflicting inline styles immediately
    if(readCircle) readCircle.style.cssText = ''; 
    if(overlay) overlay.style.cssText = '';

    // --- Initial Styles (Set using setProperty for !important) --- 
    overlay.style.setProperty('opacity', '0', 'important');
    overlay.style.setProperty('display', 'block', 'important'); // Keep in layout but invisible
    overlay.style.setProperty('transition', 'opacity 0.2s ease-in-out');
    overlay.style.setProperty('pointer-events', 'none');
    
    readCircle.style.setProperty('opacity', '0', 'important');
    readCircle.style.setProperty('display', 'flex', 'important'); // Keep in layout but invisible
    readCircle.style.setProperty('position', 'absolute');
    readCircle.style.setProperty('top', '0px'); 
    readCircle.style.setProperty('left', '0px');
    readCircle.style.setProperty('pointer-events', 'none');
    readCircle.style.setProperty('will-change', 'transform, opacity');
    readCircle.style.setProperty('transition', 'opacity 0.2s ease-in-out, transform 0.05s linear');
    readCircle.style.setProperty('transform', 'translate(-50%, -50%)'); 
    
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