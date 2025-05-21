// DOM elements
const extensionIdElement = document.getElementById('extension-id');
const extensionTitleElement = document.getElementById('extension-title');
const nixExpressionElement = document.getElementById('nix-expression');
const copyButton = document.getElementById('copy-button');
const messageElement = document.getElementById('message');
const extensionInfoElement = document.getElementById('extension-info');
const notExtensionPageElement = document.getElementById('not-extension-page');

// Variables to store extension data
let extensionId = '';
let extensionTitle = '';
let nixExpression = '';

// Function to create Nix expression
function createNixExpression(id, title) {
  return `{ id = "${id}"; } # ${title}`;
}

// Function to extract extension ID from Chrome Web Store URL
function getExtensionIdFromWebStoreUrl(url) {
  // Extract the ID from the end of the URL (after the last slash)
  const match = url.match(/\/([^\/]+)$/);
  return match ? match[1] : null;
}

// Function to extract extension ID from chrome://extensions URL
function getExtensionIdFromExtensionsPage(doc) {
  // This is a simplified approach - in reality, we'd need to check which extension card is selected
  // or implement a more sophisticated way to get the ID from the extensions page
  const extensionCards = doc.querySelectorAll('.extension-card');
  if (extensionCards.length > 0) {
    // Try to find the ID in the data attributes or other elements
    for (const card of extensionCards) {
      const idElement = card.querySelector('[data-extension-id]');
      if (idElement) {
        return idElement.getAttribute('data-extension-id');
      }
    }
  }
  return null;
}

// Function to show a message
function showMessage(text, isSuccess = true) {
  messageElement.textContent = text;
  copyButton.classList.remove('success', 'error');

  if (isSuccess) {
    copyButton.classList.add('success');
    copyButton.textContent = 'Copied!';
  } else {
    copyButton.classList.add('error');
    copyButton.textContent = 'Failed to copy';
  }

  // Reset after 2 seconds
  setTimeout(() => {
    messageElement.textContent = '';
    copyButton.classList.remove('success', 'error');
    copyButton.textContent = 'Copy Nix Expression';
  }, 2000);
}

// Function to copy text to clipboard
function copyToClipboard(text) {
  navigator.clipboard.writeText(text)
    .then(() => {
      showMessage('Copied to clipboard!', true);
    })
    .catch((error) => {
      console.error('Failed to copy text: ', error);
      showMessage('Failed to copy to clipboard', false);
    });
}

// Function to update the UI with extension data
function updateUI(id, title) {
  if (id && title) {
    extensionId = id;
    extensionTitle = title;
    nixExpression = createNixExpression(id, title);

    extensionIdElement.textContent = id;
    extensionTitleElement.textContent = title;
    nixExpressionElement.textContent = nixExpression;

    extensionInfoElement.style.display = 'block';
    notExtensionPageElement.style.display = 'none';
  } else {
    extensionInfoElement.style.display = 'none';
    notExtensionPageElement.style.display = 'block';
  }
}

// Function to handle Chrome Web Store pages
function handleWebStorePage(tab) {
  const url = tab.url;
  const id = getExtensionIdFromWebStoreUrl(url);

  // Use the tab title as the extension title
  const title = tab.title.replace(' - Chrome Web Store', '').trim();

  updateUI(id, title);
}

// Function to handle chrome://extensions page
function handleExtensionsPage(tab) {
  // We can't directly access chrome:// URLs due to security restrictions
  // This is a simplified approach - in a real extension, we might need to use
  // chrome.scripting.executeScript to extract the information

  // For now, we'll just show a message asking the user to use the extension on the Web Store
  extensionInfoElement.style.display = 'none';
  notExtensionPageElement.style.display = 'block';
  notExtensionPageElement.innerHTML = 'Chrome extensions page detected.<br>Due to security restrictions, this extension works best on the Chrome Web Store.<br>Please visit the extension\'s page on the Web Store.';
}

// Function to check if the current page is a Chrome extension page
function isExtensionPage(url) {
  return url.includes('chromewebstore.google.com/detail/') ||
    url.includes('chrome://extensions');
}

// Initialize the popup
document.addEventListener('DOMContentLoaded', () => {
  // Get the active tab
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length === 0) {
      updateUI(null, null);
      return;
    }

    const tab = tabs[0];
    const url = tab.url;

    if (url.includes('chromewebstore.google.com/detail/')) {
      handleWebStorePage(tab);
    } else if (url.includes('chrome://extensions')) {
      handleExtensionsPage(tab);
    } else {
      updateUI(null, null);
    }
  });

  // Add event listener for the copy button
  copyButton.addEventListener('click', () => {
    if (nixExpression) {
      copyToClipboard(nixExpression);
    }
  });
});
