document.addEventListener("DOMContentLoaded", () => {
  const askBtn = document.getElementById("askBtn");
  const clearBtn = document.getElementById("clearBtn");
  const userQuestionInput = document.getElementById("userQuestion");
  const chatContainer = document.getElementById("chatContainer");

  chrome.storage.local.get(["currentVideoUrl", "currentVideoTitle", "chatHistory"], (data) => {
    const videoUrl = data.currentVideoUrl;
    const videoTitle = data.currentVideoTitle || "";
    let chatHistory = data.chatHistory || [];

    // Invalid page check
    if (!videoUrl || !videoUrl.includes("youtube.com/watch?v=")) {
      chatContainer.innerHTML = `<div class="bubble ai"> This extension only works on YouTube video pages.</div>`;
      askBtn.disabled = true;
      clearBtn.disabled = true;
      userQuestionInput.disabled = true;
      return;
    }

    renderChat(chatHistory);

    //  Ask button
    askBtn.addEventListener("click", async () => {
      const question = userQuestionInput.value.trim();
      if (!question) return;

      appendMessage("user", question);
      userQuestionInput.value = "";

      // Get real-time video time from content script
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { type: "GET_CURRENT_TIME" }, (response) => {
          const videoTime = response?.currentTime || 0;

          // Get user's API key
          chrome.storage.sync.get(["openaiApiKey", "useDefaultKey"], async (apiData) => {
            const user_api_key = apiData.useDefaultKey ? "" : (apiData.openaiApiKey || "");

            try {
              const res = await fetch("http://localhost:3001/ask", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  url: videoUrl,
                  title: videoTitle,
                  question,
                  time: videoTime,
                  user_api_key
                })
              });

              const result = await res.json();
              const answer = result.answer || result.error || "No answer returned.";
              chatHistory.push({ q: question, a: answer });
              chrome.storage.local.set({ chatHistory });
              appendMessage("ai", answer);
            } catch (err) {
              appendMessage("ai", "❌ Error: Could not reach the server.");
            }
          });
        });
      });
    });

    // Clear chat history
    clearBtn.addEventListener("click", () => {
      chrome.storage.local.remove("chatHistory", () => {
        chatContainer.innerHTML = "";
      });
    });

    // Add a message to the chat container
    function appendMessage(sender, text) {
      const msg = document.createElement("div");
      msg.className = `bubble ${sender}`;
      msg.textContent = text;
      chatContainer.appendChild(msg);
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    // Render saved chat history
    function renderChat(history) {
      chatContainer.innerHTML = "";
      history.forEach(entry => {
        appendMessage("user", entry.q);
        appendMessage("ai", entry.a);
      });
    }
  });
});
