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
  // Add affiliate banner before the container
  const container = document.querySelector('.container');
  container.insertAdjacentHTML('beforebegin', commonElements.affiliateBanner);
  
  // Add footer after the main content but inside the container
  container.insertAdjacentHTML('beforeend', commonElements.footer);
}

// Initialize layout when DOM is ready
document.addEventListener('DOMContentLoaded', injectCommonElements); 