//  html elements
const messagesArea = document.getElementById('messages');
const userInput    = document.getElementById('userInput');


// adding a message to screen 
function addMessage(text, sender) {

  // Step A: Create a new div element
  const messageDiv = document.createElement('div');

  // Step B: Add CSS classes
  messageDiv.classList.add('message', sender);
  // sender = 'user' or 'bot'

  // Step C: Put text inside it
  messageDiv.textContent = text;

  // Step D: Add to messages area
  messagesArea.appendChild(messageDiv);
  // This adds message at the BOTTOM
  // All previous messages naturally move up

  // Step E: Auto scroll to bottom
  autoScroll();
}


//This function is to Auto Scroll 
function autoScroll() {
  messagesArea.scrollTop = messagesArea.scrollHeight;
  // scrollHeight = total height of all messages
  // scrollTop    = current scroll position
  // Setting scrollTop = scrollHeight jumps to bottom 
}


// This function is to Send Message
async function sendMessage() {

  // First Get text from input
  const text = userInput.value.trim();
  if (!text) return;  // don't send empty message

  // then Show user message on screen
  addMessage(text, 'user');

  // then Clear input box
  userInput.value = '';

  // then Show typing indicator
  showTyping();

  // then Send to backend & get response
  const response = await getBotResponse(text);

  // then Remove typing indicator
  hideTyping();

  // then Show bot response
  addMessage(response, 'bot');
}


// This function is for typing indicator 
function showTyping() {
  const typing = document.createElement('div');
  typing.classList.add('message', 'bot', 'typing');
  typing.id = 'typing-indicator';
  typing.textContent = '● ● ●';
  messagesArea.appendChild(typing);
  autoScroll();
}

function hideTyping() {
  const typing = document.getElementById('typing-indicator');
  if (typing) typing.remove();
}


// This function will Call Backend the API 
async function getBotResponse(userMessage) {
  try {
    // Send request to Python backend
    const response =  await fetch('/chat',  {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMessage })
    });

    const data = await response.json();
    return data.reply;   // get bot reply from JSON

  } catch (error) {
    return "Sorry, something went wrong!";
  }
}


// This is to Send on Enter key 
userInput.addEventListener('keypress', function(e) {
  if (e.key === 'Enter') sendMessage();
});
