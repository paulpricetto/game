// Common layout elements
const commonElements = {
  affiliateBanner: `
    <div class="affiliate-banner">
      <p>To support our work, we may earn a commission from links in our content.</p>
    </div>
  `,
  footer: `
    <footer>
      <p>&copy; ${new Date().getFullYear()} Pricetto. All rights reserved.</p>
    </footer>
  `
};

// Function to inject common elements
function injectCommonElements() {
  // Add affiliate banner at the start of body
  document.body.insertAdjacentHTML('afterbegin', commonElements.affiliateBanner);
  
  // Add footer before the closing body tag
  document.body.insertAdjacentHTML('beforeend', commonElements.footer);
}

// Initialize layout when DOM is ready
document.addEventListener('DOMContentLoaded', injectCommonElements); 