// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Check if the message is a request to copy text to clipboard
  if (message.action === 'copyToClipboard' && message.text) {
    // Use the Clipboard API to copy the text
    navigator.clipboard.writeText(message.text)
      .then(() => {
        // Success - send response back to content script
        sendResponse({ success: true });
      })
      .catch((error) => {
        // Error - send response back to content script
        console.error('Failed to copy text: ', error);
        sendResponse({ success: false, error: error.message });
      });

    // Return true to indicate that we will send a response asynchronously
    return true;
  }
});
