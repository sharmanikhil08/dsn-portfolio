// Function to load and inject the Calendly widget
async function loadCalendlyWidget() {
    try {
        // Get the current path relative to the root
        const currentPath = window.location.pathname;
        const isInSubfolder = currentPath.split('/').length > 2;
        
        // Adjust the path for the Calendly widget component based on current location
        const widgetPath = isInSubfolder ? '../components/calendly-widget.html' : 'components/calendly-widget.html';
        
        // Fetch the widget content
        const response = await fetch(widgetPath);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.text();
        
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
                document.head.appendChild(link.cloneNode(true));
            }
        });
        
        // Load scripts sequentially to maintain order
        const scripts = Array.from(temp.querySelectorAll('script'));
        for (const script of scripts) {
            await new Promise((resolve, reject) => {
                const newScript = document.createElement('script');
                
                // Copy all attributes
                Array.from(script.attributes).forEach(attr => {
                    newScript.setAttribute(attr.name, attr.value);
                });
                
                // Handle script loading
                if (script.src) {
                    newScript.onload = resolve;
                    newScript.onerror = reject;
                } else {
                    newScript.textContent = script.textContent;
                }
                
                document.body.appendChild(newScript);
                
                // Resolve immediately for inline scripts
                if (!script.src) {
                    resolve();
                }
            }).catch(error => {
                console.error('Error loading script:', error);
            });
        }
    } catch (error) {
        console.error('Error loading Calendly widget:', error);
    }
}

// Load the Calendly widget after a short delay to prioritize main content
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(loadCalendlyWidget, 100));
} else {
    setTimeout(loadCalendlyWidget, 100);
} 