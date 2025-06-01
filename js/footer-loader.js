// Function to load and inject the footer
function loadFooter() {
    // Get the current path relative to the root
    const currentPath = window.location.pathname;
    const isInSubfolder = currentPath.split('/').length > 2;
    
    // Adjust the path for the footer component based on current location
    const footerPath = isInSubfolder ? '../components/footer.html' : 'components/footer.html';
    
    // Fetch the footer content
    fetch(footerPath)
        .then(response => response.text())
        .then(data => {
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
            
            // Re-initialize any Webflow interactions if needed
            if (window.Webflow && window.Webflow.destroy) {
                window.Webflow.destroy();
            }
            if (window.Webflow && window.Webflow.ready) {
                window.Webflow.ready();
            }
        })
        .catch(error => {
            console.error('Error loading footer:', error);
        });
}

// Load the footer when the DOM is ready
document.addEventListener('DOMContentLoaded', loadFooter); 