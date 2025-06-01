// Function to load and inject the Calendly widget
function loadCalendlyWidget() {
    // Get the current path relative to the root
    const currentPath = window.location.pathname;
    const isInSubfolder = currentPath.split('/').length > 2;
    
    // Adjust the path for the Calendly widget component based on current location
    const widgetPath = isInSubfolder ? '../components/calendly-widget.html' : 'components/calendly-widget.html';
    
    // Fetch the widget content
    fetch(widgetPath)
        .then(response => response.text())
        .then(data => {
            // Create a temporary container
            const temp = document.createElement('div');
            temp.innerHTML = data;
            
            // Extract and inject styles
            const styles = temp.querySelector('style');
            if (styles) {
                document.head.appendChild(styles);
            }
            
            // Extract and inject link tags
            const links = temp.querySelectorAll('link');
            links.forEach(link => {
                if (!document.querySelector(`link[href="${link.getAttribute('href')}"]`)) {
                    document.head.appendChild(link);
                }
            });
            
            // Extract and inject scripts
            const scripts = temp.querySelectorAll('script');
            scripts.forEach(script => {
                const newScript = document.createElement('script');
                
                // Copy all attributes
                Array.from(script.attributes).forEach(attr => {
                    newScript.setAttribute(attr.name, attr.value);
                });
                
                // Copy inline script content
                if (!script.src) {
                    newScript.textContent = script.textContent;
                }
                
                document.body.appendChild(newScript);
            });
        })
        .catch(error => {
            console.error('Error loading Calendly widget:', error);
        });
}

// Load the Calendly widget when the DOM is ready
document.addEventListener('DOMContentLoaded', loadCalendlyWidget); 