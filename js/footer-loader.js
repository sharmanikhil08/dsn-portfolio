// Function to load and inject the footer
async function loadFooter() {
    try {
        // Get the current path relative to the root
        const currentPath = window.location.pathname;
        const isInSubfolder = currentPath.split('/').length > 2;
        
        // Adjust the path for the footer component based on current location
        const footerPath = isInSubfolder ? '../components/footer.html' : 'components/footer.html';
        
        // Fetch the footer content
        const response = await fetch(footerPath);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.text();
        
        // Create a temporary container
        const temp = document.createElement('div');
        temp.innerHTML = data;
        
        // Adjust image and link paths if we're in a subfolder
        if (isInSubfolder) {
            temp.querySelectorAll('img').forEach(img => {
                if (img.src.includes('images/')) {
                    img.src = '../' + img.src.split('images/')[1];
                }
                if (img.srcset) {
                    img.srcset = img.srcset.split(',').map(src => {
                        if (src.includes('images/')) {
                            return '../' + src.trim().split('images/')[1];
                        }
                        return src;
                    }).join(',');
                }
            });
            
            // Adjust links
            temp.querySelectorAll('a').forEach(link => {
                if (!link.href.startsWith('http') && !link.href.startsWith('mailto:') && !link.href.startsWith('tel:')) {
                    link.href = '../' + link.getAttribute('href');
                }
            });
        }
        
        // Insert the footer before the closing body tag
        document.body.insertBefore(temp.querySelector('footer'), document.body.lastElementChild);
        
        // Initialize Webflow only if needed and not already initialized
        if (window.Webflow) {
            // Wait for next frame to ensure DOM is ready
            requestAnimationFrame(() => {
                if (window.Webflow.ready) {
                    window.Webflow.ready();
                }
            });
        }
    } catch (error) {
        console.error('Error loading footer:', error);
    }
}

// Load the footer when the DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadFooter);
} else {
    loadFooter();
} 