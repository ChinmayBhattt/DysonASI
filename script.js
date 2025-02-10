document.addEventListener("DOMContentLoaded", function () {
    const inputField = document.querySelector(".input-field");
    const sendButton = document.querySelector(".send-btn");
    const messagesContainer = document.querySelector(".messages-container");
    const newChatButton = document.querySelector(".menu-item");
    let chatHistory = [];
    let currentChatIndex = -1;

    async function sendMessage() {
        const message = inputField.value.trim();
        if (!message) return;

        if (currentChatIndex === -1) {
            startNewChat();
        }

        chatHistory[currentChatIndex].push({ text: message, isUser: true });

        addMessage(message, true);
        inputField.value = "";

        try {
            const response = await fetch("http://localhost:5000/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message }),
            });

            const data = await response.json();
            const formattedResponse = formatResponse(data.response || "Sorry, I couldn't understand that.");

            chatHistory[currentChatIndex].push({ text: formattedResponse, isUser: false });

            addMessage(formattedResponse, false);
        } catch (error) {
            console.error("Error:", error);
            addMessage("Error connecting to DysonASI server.", false);
        }
    }

    function formatResponse(responseText) {
        responseText = responseText.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>"); // Bold text
        responseText = responseText.replace(/\*(.*?)\*/g, "<i>$1</i>"); // Italic text

        let lines = responseText.split("\n").map(line => line.trim()).filter(line => line);
        let formattedText = "";
        let inList = false;
        let inCodeBlock = false;

        lines.forEach(line => {
            if (line.startsWith("```")) {
                if (!inCodeBlock) {
                    formattedText += "<pre><code>";
                    inCodeBlock = true;
                } else {
                    formattedText += "</code></pre>";
                    inCodeBlock = false;
                }
            } else if (inCodeBlock) {
                formattedText += line + "\n";
            } else if (line.startsWith("• ")) {
                if (!inList) {
                    formattedText += "<ul>";
                    inList = true;
                }
                formattedText += `<li>${line.substring(2)}</li>`;
            } else if (/^\d+\)/.test(line)) {
                if (!inList) {
                    formattedText += "<ol>";
                    inList = true;
                }
                formattedText += `<li>${line}</li>`;
            } else {
                if (inList) {
                    formattedText += inList ? "</ul>" : "</ol>";
                    inList = false;
                }
                formattedText += `<p>${line}</p><br>`;
            }
        });

        if (inList) {
            formattedText += inList ? "</ul>" : "</ol>";
        }

        return formattedText;
    }

    function addMessage(text, isUser) {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("message", isUser ? "user-message" : "ai-message");
        messageDiv.innerHTML = text;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function handleKeyPress(event) {
        if (event.key === "Enter") sendMessage();
    }

    function startNewChat() {
        if (currentChatIndex !== -1) {
            chatHistory.push([]);
        } else {
            chatHistory = [[]];
        }
        currentChatIndex = chatHistory.length - 1;

        messagesContainer.innerHTML = "";

        const welcomeMessage = document.createElement("div");
        welcomeMessage.classList.add("message", "ai-message");
        welcomeMessage.innerHTML = "<p><b>Hi, I'm DysonASI!</b> How can I assist you today?</p><br>";
        messagesContainer.appendChild(welcomeMessage);
    }

    newChatButton.addEventListener("click", startNewChat);
    sendButton.addEventListener("click", sendMessage);
    inputField.addEventListener("keypress", handleKeyPress);

    startNewChat();
});
document.addEventListener("DOMContentLoaded", function () {
    const settingsBtn = document.querySelector(".settings-btn");
    const settingsMenu = document.querySelector(".settings-menu");

    // Toggle Settings Menu
    settingsBtn.addEventListener("click", function () {
        settingsMenu.style.display = settingsMenu.style.display === "flex" ? "none" : "flex";
    });

    // Delete All Chats
    document.querySelector(".delete-chats").addEventListener("click", function () {
        if (confirm("Are you sure you want to delete all chats?")) {
            document.querySelector(".messages-container").innerHTML = "";
        }
    });

    // Contact Us
    document.querySelector(".contact-us").addEventListener("click", function () {
        alert("Contact us at: support@dysonasi.com");
    });

    // Login
    document.querySelector(".login").addEventListener("click", function () {
        window.location.href = "/login"; // Redirect to login page
    });
});
document.querySelector(".contact-us").addEventListener("click", function () {
    window.open("https://linktr.ee/DysonASI?fbclid=PAZXh0bgNhZW0CMTEAAaac0oAhOBzhcAykmU8tHgJH3197MU72-X23uy8R-EgtxubqGzJhm2WZj3o_aem_rtsPjaZxqqgG2R3Ai8JSZQ", "_blank");
});
