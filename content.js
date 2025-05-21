// Function to extract extension ID from URL
function getExtensionId() {
  const url = window.location.href;
  // Extract the ID from the end of the URL (after the last slash)
  const match = url.match(/\/([^\/]+)$/);
  return match ? match[1] : null;
}

// Function to extract extension title
function getExtensionTitle() {
  // The title is typically in the h1 element on the Chrome Web Store page
  const titleElement = document.querySelector('h1');
  return titleElement ? titleElement.textContent.trim() : 'Unknown Extension';
}

// Function to create Nix expression
function createNixExpression(id, title) {
  return `{ id = "${id}"; } # ${title}`;
}

// Function to create and add the copy button
function addCopyButton() {
  // Check if button already exists
  if (document.getElementById('nix-copy-button')) {
    return;
  }

  const button = document.createElement('button');
  button.id = 'nix-copy-button';
  button.textContent = 'Copy as Nix Expression';
  button.style.position = 'fixed';
  button.style.bottom = '20px';
  button.style.right = '20px';
  button.style.zIndex = '9999';
  button.style.padding = '10px';
  button.style.backgroundColor = '#4285f4';
  button.style.color = 'white';
  button.style.border = 'none';
  button.style.borderRadius = '4px';
  button.style.cursor = 'pointer';
  button.style.fontWeight = 'bold';

  button.addEventListener('click', () => {
    const id = getExtensionId();
    const title = getExtensionTitle();

    if (id) {
      const nixExpression = createNixExpression(id, title);

      // Send message to background script to copy to clipboard
      chrome.runtime.sendMessage({ action: 'copyToClipboard', text: nixExpression }, (response) => {
        if (response && response.success) {
          // Show success message
          button.textContent = 'Copied!';
          button.style.backgroundColor = '#34a853';

          // Reset button after 2 seconds
          setTimeout(() => {
            button.textContent = 'Copy as Nix Expression';
            button.style.backgroundColor = '#4285f4';
          }, 2000);
        } else {
          // Show error message
          button.textContent = 'Failed to copy';
          button.style.backgroundColor = '#ea4335';

          // Reset button after 2 seconds
          setTimeout(() => {
            button.textContent = 'Copy as Nix Expression';
            button.style.backgroundColor = '#4285f4';
          }, 2000);
        }
      });
    } else {
      button.textContent = 'Extension ID not found';
      button.style.backgroundColor = '#ea4335';

      // Reset button after 2 seconds
      setTimeout(() => {
        button.textContent = 'Copy as Nix Expression';
        button.style.backgroundColor = '#4285f4';
      }, 2000);
    }
  });

  document.body.appendChild(button);
}

// Run when the page is fully loaded
window.addEventListener('load', () => {
  // Check if we're on a Chrome Web Store detail page
  if (window.location.href.includes('chromewebstore.google.com/detail/')) {
    // Add the copy button
    addCopyButton();
  }
});

// Also run when DOM content is loaded (in case window.load already fired)
document.addEventListener('DOMContentLoaded', () => {
  // Check if we're on a Chrome Web Store detail page
  if (window.location.href.includes('chromewebstore.google.com/detail/')) {
    // Add the copy button
    addCopyButton();
  }
});
