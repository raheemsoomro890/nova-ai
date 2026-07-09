// ===================================
// NOVA AI v2
// PART 1
// ===================================

const messages = document.getElementById("messages");
const input = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

const newChatBtn = document.getElementById("newChatBtn");
const chatHistory = document.getElementById("chatHistory");

let chats = JSON.parse(localStorage.getItem("novaChats")) || [];

let currentChat = localStorage.getItem("currentChat") || null;

// ===========================
// SAVE
// ===========================

function saveChats(){

localStorage.setItem(
"novaChats",
JSON.stringify(chats)
);

localStorage.setItem(
"currentChat",
currentChat
);

}

// ===========================
// RENDER HISTORY
// ===========================

function renderHistory(){

chatHistory.innerHTML="";

chats.forEach(chat=>{

const item=document.createElement("div");

item.className="history-item";

item.innerHTML=chat.title;

item.onclick=()=>{

loadChat(chat.id);

};

chatHistory.appendChild(item);

});

}

// ===========================
// LOAD CHAT
// ===========================

function loadChat(id){

currentChat=id;

const chat=chats.find(c=>c.id===id);

messages.innerHTML=chat.messages;

saveChats();

}

// ===========================
// NEW CHAT
// ===========================

newChatBtn.addEventListener("click",()=>{

const id=Date.now().toString();

const newChat={

id:id,

title:"New Chat",

messages:`
<div class="bot-message">

👋 Welcome to <b>Nova AI</b><br><br>

How can I help you today?

</div>
`

};

chats.unshift(newChat);

currentChat=id;

renderHistory();

loadChat(id);

saveChats();

});

// ===========================
// SAVE CURRENT CHAT
// ===========================

function saveCurrentChat(){

const chat=chats.find(c=>c.id===currentChat);

if(!chat) return;

chat.messages=messages.innerHTML;

if(chat.title==="New Chat"){

const firstUser=messages.querySelector(".user-message");

if(firstUser){

chat.title=firstUser.innerText.substring(0,30);

}

}

saveChats();

renderHistory();

}

// ===========================
// FIRST LOAD
// ===========================

if(chats.length===0){

newChatBtn.click();

}else{

renderHistory();

loadChat(currentChat||chats[0].id);

  }


// ===========================
// SEND MESSAGE
// ===========================

async function sendMessage(){

const text=input.value.trim();

if(!text) return;

// User Message

messages.innerHTML+=`
<div class="user-message">
${text}
</div>
`;

input.value="";

saveCurrentChat();

messages.scrollTop=messages.scrollHeight;

// Typing

messages.innerHTML+=`
<div class="bot-message" id="typing">
🤖 Nova AI is thinking...
</div>
`;

messages.scrollTop=messages.scrollHeight;

try{

const response=await fetch("/api/chat",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
message:text
})

});

const data=await response.json();

document.getElementById("typing")?.remove();

messages.innerHTML+=`
<div class="bot-message">
${(data.reply||data.error).replace(/\n/g,"<br>")}
</div>
`;

saveCurrentChat();

messages.scrollTop=messages.scrollHeight;

}catch(error){

document.getElementById("typing")?.remove();

messages.inner
