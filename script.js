const input = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const messages = document.getElementById("messages");

// Load saved chat
window.onload = () => {
  const savedChat = localStorage.getItem("novaChat");

  if (savedChat) {
    messages.innerHTML = savedChat;
    messages.scrollTop = messages.scrollHeight;
  }
};

// Save chat
function saveChat() {
  localStorage.setItem("novaChat", messages.innerHTML);
}

async function sendMessage() {

  const text = input.value.trim();

  if (!text) return;

  messages.innerHTML += `
<div class="user-message">
${text}
</div>
`;

  input.value = "";

  saveChat();

  messages.scrollTop = messages.scrollHeight;

  messages.innerHTML += `
<div class="bot-message" id="typing">
🤖 Nova AI is thinking...
</div>
`;

  messages.scrollTop = messages.scrollHeight;

  try {

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: text
      })
    });

    const data = await response.json();

    document.getElementById("typing").remove();

    messages.innerHTML += `
<div class="bot-message">
${(data.reply || data.error).replace(/\n/g,"<br>")}
</div>
`;

    saveChat();

    messages.scrollTop = messages.scrollHeight;

  } catch (error) {

    document.getElementById("typing").remove();

    messages.innerHTML += `
<div class="bot-message">
❌ Error connecting to Nova AI.
</div>
`;

    saveChat();
  }

}

sendBtn.addEventListener("click", sendMessage);

input.addEventListener("keypress", (e) => {

  if (e.key === "Enter") {

    sendMessage();

  }

});
