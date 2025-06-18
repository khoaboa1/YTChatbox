(function () {
  // Save current YouTube URL and video title
  function saveVideoInfo() {
    const url = window.location.href;
    if (url.includes("watch?v=")) {
      const title = document.title.replace(" - YouTube", "");

      chrome.storage.local.set({
        currentVideoUrl: url,
        currentVideoTitle: title
      });
    }
  }

  // Save current playback time to storage (optional background logic)
  function saveCurrentTime() {
    const video = document.querySelector("video");
    if (!video) return;

    chrome.storage.local.set({
      currentTime: video.currentTime
    });
  }

  // Respond to popup.js requests for the live video time
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "GET_CURRENT_TIME") {
      const video = document.querySelector("video");
      sendResponse({ currentTime: video?.currentTime || 0 });
    }
  });

  // Initial run
  saveVideoInfo();

  // Watch for URL changes (YouTube SPA navigation)
  let lastUrl = location.href;
  new MutationObserver(() => {
    const currentUrl = location.href;
    if (currentUrl !== lastUrl) {
      lastUrl = currentUrl;
      saveVideoInfo();
    }
  }).observe(document, { subtree: true, childList: true });

  // Optional: Save video time to storage every 5s (can help with resume functionality)
  setInterval(saveCurrentTime, 5000);
})();
