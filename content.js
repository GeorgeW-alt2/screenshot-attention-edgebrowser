// content.js

// Find the first image on the page
const images = document.getElementsByTagName('img');
if (images.length > 0) {
  const img = images[0]; // Get the first image
  const src = img.src;
  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === "getImageSrc") {
      sendResponse({ imageSrc: src });
    }
  });
}
