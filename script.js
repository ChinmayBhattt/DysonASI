document.addEventListener("DOMContentLoaded", function () {
    const inputField = document.querySelector(".input-field");
    const sendButton = document.querySelector(".send-btn");
    const messagesContainer = document.querySelector(".messages-container");

    async function sendMessage() {
        const message = inputField.value.trim();
        if (!message) return;

        // Display user message
        addMessage(message, true);
        inputField.value = "";

        try {
            // Send request to backend
            const response = await fetch("http://localhost:5000/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message }),
            });

            const data = await response.json();

            // Display AI response
            addMessage(data.response || "Sorry, I couldn't understand that.", false);
        } catch (error) {
            console.error("Error:", error);
            addMessage("Error connecting to DysonASI server.", false);
        }
    }

    function addMessage(text, isUser) {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("message", isUser ? "user-message" : "ai-message");
        messageDiv.textContent = text;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function handleKeyPress(event) {
        if (event.key === "Enter") sendMessage();
    }

    sendButton.addEventListener("click", sendMessage);
    inputField.addEventListener("keypress", handleKeyPress);
});
