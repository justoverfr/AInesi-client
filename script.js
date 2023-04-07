document.getElementById("send-button").addEventListener("click", sendMessage);

function addMessageToChatHistory(message, isUser = false) {
  const chatHistory = document.getElementById("chat-history");
  const messageContainer = document.createElement("div");
  messageContainer.classList.add(isUser ? "user-message" : "bot-message");
  messageContainer.textContent = message;
  chatHistory.appendChild(messageContainer);
  chatHistory.scrollTop = chatHistory.scrollHeight;
}

function sendMessage() {
  const userInput = document.getElementById("user-input");
  const message = userInput.value.trim();
  if (message.length > 0) {
    addMessageToChatHistory(message, true);
    userInput.value = "";
    fetch("http://localhost:5000/dialogflow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        queryResult: {
          intent: {
            displayName: "CustomIntent", // Vous pouvez définir ici le nom de l'intention souhaitée.
          },
          queryText: message,
        },
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur du serveur");
        }
        return response.json();
      })
      .then((data) => {
        addMessageToChatHistory(data.fulfillmentText);
      })
      .catch((error) => {
        console.error("Erreur lors de l'appel de l'API :", error);
      });
  }
}

// Permet d'envoyer un message en appuyant sur la touche "Entrée"
document
  .getElementById("user-input")
  .addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      sendMessage();
    }
  });
