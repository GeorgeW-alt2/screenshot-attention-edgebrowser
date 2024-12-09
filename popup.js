document.getElementById("imageUpload").addEventListener("change", handleImageUpload);

// Handle image upload
function handleImageUpload(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const img = new Image();
      img.onload = function () {
        processImage(img);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}

// Fetch image from the currently active tab
chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  chrome.tabs.sendMessage(tabs[0].id, { action: "getImageSrc" }, function (response) {
    if (response && response.imageSrc) {
      const img = new Image();
      img.onload = function () {
        processImage(img);
      };
      img.src = response.imageSrc;
    }
  });
});

function processImage(img) {
  const canvas = document.getElementById("outputCanvas");
  const ctx = canvas.getContext("2d");

  // Set canvas size to match image size
  canvas.width = img.width;
  canvas.height = img.height;

  // Draw the image onto the canvas
  ctx.drawImage(img, 0, 0);

  // Detect odd features by applying basic edge detection
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  // A simple edge detection filter (Sobel, for instance) could be applied here.
  // For simplicity, let's identify high-contrast pixels (bright edges).
  for (let i = 0; i < data.length; i += 4) {
    // Using the brightness formula to detect bright pixels (edges).
    const brightness = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
    if (brightness > 200) {
      // Mark this pixel as part of an "odd feature"
      data[i] = 255;   // Red
      data[i + 1] = 0; // Green
      data[i + 2] = 0; // Blue
    }
  }

  // Apply the updated image data to the canvas
  ctx.putImageData(imageData, 0, 0);

  // Draw a red circle on the detected feature (just as an example)
  const x = Math.floor(canvas.width / 2);
  const y = Math.floor(canvas.height / 2);
  const radius = 50;

  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
  ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
  ctx.fill();
}
