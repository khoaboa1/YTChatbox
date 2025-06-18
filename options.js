document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("apiKeyInput");
    const status = document.getElementById("statusMessage");
    const saveBtn = document.getElementById("saveBtn");
    const clearBtn = document.getElementById("clearBtn");
    const useDefaultBtn = document.getElementById("useDefaultBtn");
  
    // Load saved key or fallback flag
    chrome.storage.sync.get(["openaiApiKey", "useDefaultKey"], (data) => {
      if (data.useDefaultKey) {
        status.textContent = "Using default ChatGPT key.";
        status.style.color = "blue";
      } else if (data.openaiApiKey) {
        input.value = data.openaiApiKey;
        status.textContent = " API key loaded.";
      }
    });
  
    saveBtn.addEventListener("click", async () => {
        const key = input.value.trim();
      
        if (!key.startsWith("sk-")) {
          status.textContent = " Invalid key format.";
          status.style.color = "red";
          return;
        }
      
        status.textContent = " Validating key...";
        status.style.color = "gray";
        saveBtn.disabled = true;
        try {
          const response = await fetch("https://api.openai.com/v1/models", {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${key}`
            }
          });
      
          if (response.ok) {
            chrome.storage.sync.set({ openaiApiKey: key, useDefaultKey: false }, () => {
              status.textContent = " API key validated and saved!";
              status.style.color = "green";
            });
          } else {
            const error = await response.json();
            status.textContent = `OpenAI Error: ${error.error.message}`;
            status.style.color = "red";
          }
        } catch (err) {
          status.textContent = " Network error while validating key.";
          status.style.color = "red";
        }
        saveBtn.disabled = false;
      });
  
    clearBtn.addEventListener("click", () => {
      chrome.storage.sync.remove(["openaiApiKey", "useDefaultKey"], () => {
        input.value = "";
        status.textContent = " API key cleared.";
        status.style.color = "orange";
      });
    });
  
    useDefaultBtn.addEventListener("click", () => {
      chrome.tabs.create({
        url: "https://platform.openai.com/account/api-keys"
      });
    });
  });
  