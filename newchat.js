document.addEventListener("DOMContentLoaded", function () {
    const inputField = document.querySelector(".input-field");
    const sendButton = document.querySelector(".send-btn");
    const messagesContainer = document.querySelector(".messages-container");
    const newChatButton = document.querySelector(".new-chat");
    const chatListContainer = document.querySelector(".chat-list");

    let chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
    let currentChatIndex = -1;

    function loadChatHistory() {
        chatListContainer.innerHTML = "";
        chatHistory.forEach((chat, index) => {
            const chatItem = document.createElement("div");
            chatItem.classList.add("chat-item");
            chatItem.innerText = `Chat ${index + 1}`;
            chatItem.addEventListener("click", () => loadChat(index));
            chatListContainer.appendChild(chatItem);
        });
    }

    function startNewChat() {
        if (currentChatIndex !== -1 && messagesContainer.innerHTML.trim() !== "") {
            chatHistory[currentChatIndex] = messagesContainer.innerHTML;
            localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
        }

        currentChatIndex = chatHistory.length;
        chatHistory.push("");
        messagesContainer.innerHTML = "";
        localStorage.setItem("chatHistory", JSON.stringify(chatHistory));

        loadChatHistory();
    }

    function loadChat(index) {
        currentChatIndex = index;
        messagesContainer.innerHTML = chatHistory[index] || "";
    }

    sendButton.addEventListener("click", sendMessage);
    newChatButton.addEventListener("click", startNewChat);
    
    loadChatHistory(); // Chat history ko load karo jab page load ho
});
