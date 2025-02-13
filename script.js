document.addEventListener("DOMContentLoaded", function () {
    const inputField = document.querySelector(".input-field");
    const sendButton = document.querySelector(".send-btn");
    const messagesContainer = document.querySelector(".messages-container");
    const newChatButton = document.querySelector(".menu-item");
    let chatHistory = [];
    let currentChatIndex = -1;

    function showThinkingMessage() {
        const thinkingMessage = document.createElement("div");
        thinkingMessage.classList.add("message", "ai-message", "thinking-message"); // ✅ Extra class added
        thinkingMessage.innerText = "DysonASI is thinking...";
        messagesContainer.appendChild(thinkingMessage);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        return thinkingMessage;
    }
    

    async function sendMessage() {
        const message = inputField.value.trim();
        if (!message) return;

        if (currentChatIndex === -1) {
            startNewChat();
        }

        chatHistory[currentChatIndex].push({ text: message, isUser: true });

        addMessage(message, true);
        inputField.value = "";

        // Show "thinking" effect
        const thinkingMessage = showThinkingMessage();
        inputField.disabled = true;
        sendButton.disabled = true;

        try {
            const response = await fetch("http://localhost:5000/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message }),
            });

            const data = await response.json();
            const formattedResponse = formatResponse(data.response || "Sorry, I couldn't understand that.");

            chatHistory[currentChatIndex].push({ text: formattedResponse, isUser: false });

            // Remove "thinking" message and add actual response
            setTimeout(() => {
                thinkingMessage.remove();
                addMessage(formattedResponse, false);
            }, 500);
        } catch (error) {
            console.error("Error:", error);
            thinkingMessage.innerText = "Error connecting to DysonASI server.";
        } finally {
            inputField.disabled = false;
            sendButton.disabled = false;
        }
    }

    function formatResponse(responseText) {
        responseText = responseText.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
        responseText = responseText.replace(/\*(.*?)\*/g, "<i>$1</i>");

        let lines = responseText.split("\n").map(line => line.trim()).filter(line => line);
        let formattedText = "";
        let inList = false;
        let inCodeBlock = false;

        lines.forEach(line => {
            if (line.startsWith("```")) {
                formattedText += inCodeBlock ? "</code></pre>" : "<pre><code>";
                inCodeBlock = !inCodeBlock;
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
        settingsMenu.style.display = settingsMenu.style.display === "none" ? "flex" : "none";
    });

    // Delete All Chats
    document.querySelector(".delete-chats").addEventListener("click", function () {
        if (confirm("Are you sure you want to delete all chats?")) {
            document.querySelector(".messages-container").innerHTML = "";
        }
    });

    // Contact Us
    // document.querySelector(".contact-us").addEventListener("click", function () {
    //     alert("Contact us at: support@dysonasi.com");
    // });
        document.querySelector(".contact-us").addEventListener("click", function () {
            window.open("https://linktr.ee/DysonASI", "_blank");
        });
    
    
    // Login
    document.querySelector(".login").addEventListener("click", function () {
        window.location.href = "/login"; // Redirect to login page
    });
});
// document.querySelector(".contact-us").addEventListener("click", function () {
//     window.open("https://linktr.ee/DysonASI", "_blank");
// });

// Function to create a new chat session
function newChat() {
    const chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
    const currentChat = document.getElementById('chatBox').innerHTML;
    
    if (currentChat.trim() !== "") {
        chatHistory.push(currentChat);
        localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
    }
    
    document.getElementById('chatBox').innerHTML = "";
    alert("New chat started! Previous chat is saved.");
}

document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    
    // Check local storage for saved theme preference
    if (localStorage.getItem("theme") === "light") {
        body.classList.add("light-mode");
    }

    document.querySelector(".toggle-theme").addEventListener("click", function () {
        body.classList.toggle("light-mode");

        if (body.classList.contains("light-mode")) {
            localStorage.setItem("theme", "light");
        } else {
            localStorage.setItem("theme", "dark");
        }
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const elementsToToggle = [
        body,
        document.querySelector(".container"),
        document.querySelector(".main-content"),
        document.querySelector(".messages-container"),
        document.querySelector(".input-container"),
        document.querySelector(".top-bar"),
        document.querySelector(".sidebar"),
    ];

    // Apply saved theme from local storage
    if (localStorage.getItem("theme") === "light") {
        elementsToToggle.forEach(el => el?.classList.add("light-mode"));
    }

    document.querySelector(".toggle-theme").addEventListener("click", function () {
        elementsToToggle.forEach(el => el?.classList.toggle("light-mode"));

        if (body.classList.contains("light-mode")) {
            localStorage.setItem("theme", "light");
        } else {
            localStorage.setItem("theme", "dark");
        }
    });
});
document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    
    // Check local storage for saved theme preference
    if (localStorage.getItem("theme") === "light") {
        body.classList.add("light-mode");
    }

    document.querySelector(".toggle-theme").addEventListener("click", function () {
        body.classList.toggle("light-mode");

        if (body.classList.contains("light-mode")) {
            localStorage.setItem("theme", "light");
            body.style.background = "#f8f9fa"; // Light mode background
        } else {
            localStorage.setItem("theme", "dark");
            body.style.background = "#0A0A0A"; // Dark mode background
        }
    });

    // Apply background color on load
    if (localStorage.getItem("theme") === "light") {
        body.style.background = "#f8f9fa";
    } else {
        body.style.background = "#0A0A0A";
    }
});


document.addEventListener("DOMContentLoaded", function () {
    const settingsBtn = document.querySelector(".settings-btn");
    const settingsMenu = document.querySelector(".settings-menu");

    // Toggle Settings Menu when clicking the button
    settingsBtn.addEventListener("click", function (event) {
        event.stopPropagation(); // ✅ Stops event from propagating to document
        settingsMenu.style.display = (settingsMenu.style.display === "none" || settingsMenu.style.display === "") ? "flex" : "none";
    });

    // Close settings menu when clicking anywhere else on the page
    document.addEventListener("click", function (event) {
        if (!settingsMenu.contains(event.target) && !settingsBtn.contains(event.target)) {
            settingsMenu.style.display = "none";
        }
    });
});


document.addEventListener("DOMContentLoaded", function () {
    const settingsBtn = document.querySelector(".settings-btn");
    const settingsMenu = document.querySelector(".settings-menu");

    // Toggle Settings Menu when clicking the button
    settingsBtn.addEventListener("click", function (event) {
        event.stopPropagation(); // ✅ Prevents event from bubbling
        if (settingsMenu.style.display === "none" || settingsMenu.style.display === "") {
            settingsMenu.style.display = "flex"; // ✅ Open menu
        } else {
            settingsMenu.style.display = "none"; // ✅ Close menu
        }
    });

    // Close settings menu when clicking anywhere else on the page
    document.addEventListener("click", function (event) {
        if (settingsMenu.style.display === "flex" && !settingsBtn.contains(event.target) && !settingsMenu.contains(event.target)) {
            settingsMenu.style.display = "none";
        }
    });
});

const newChatButton = document.querySelector(".new-chat"); // ✅ Use specific class for "New Chat" button
newChatButton.addEventListener("click", startNewChat);

document.addEventListener("DOMContentLoaded", function () {
    const thoughtBtn = document.querySelector(".thought-icon");

    thoughtBtn.addEventListener("click", function () {
        this.classList.toggle("active");
    });
});
function toggleSearch(element) {
    element.classList.toggle("active");
    // Yahan AI search logic add kar sakte ho
}

function toggleEffect(element) {
    element.classList.toggle("active");

    // Sparkle Effect
    for (let i = 0; i < 5; i++) {  // Creating multiple sparkles
        let sparkle = document.createElement("div");
        sparkle.classList.add("sparkle");
        
        let x = Math.random() * element.clientWidth;
        let y = Math.random() * element.clientHeight;
        
        sparkle.style.left = `${x}px`;
        sparkle.style.top = `${y}px`;

        element.appendChild(sparkle);

        // Remove sparkle after animation
        setTimeout(() => sparkle.remove(), 600);
    }
}
