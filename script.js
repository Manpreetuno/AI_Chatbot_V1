// ── Get references to HTML elements ──
const messagesArea = document.getElementById('messages');
const userInput    = document.getElementById('userInput');


// ── FUNCTION 1: Add a message to screen ──
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
  // ↑ This adds message at the BOTTOM
  // All previous messages naturally move UP!

  // Step E: Auto scroll to bottom
  autoScroll();
}


// ── FUNCTION 2: Auto Scroll ──
function autoScroll() {
  messagesArea.scrollTop = messagesArea.scrollHeight;
  // scrollHeight = total height of all messages
  // scrollTop    = current scroll position
  // Setting scrollTop = scrollHeight → jumps to bottom ✅
}


// ── FUNCTION 3: Send Message ──
async function sendMessage() {

  // Step A: Get text from input
  const text = userInput.value.trim();
  if (!text) return;  // don't send empty message

  // Step B: Show user message on screen
  addMessage(text, 'user');

  // Step C: Clear input box
  userInput.value = '';

  // Step D: Show typing indicator
  showTyping();

  // Step E: Send to backend & get response
  const response = await getBotResponse(text);

  // Step F: Remove typing indicator
  hideTyping();

  // Step G: Show bot response
  addMessage(response, 'bot');
}


// ── FUNCTION 4: Typing Indicator ──
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


// ── FUNCTION 5: Call Backend API ──
async function getBotResponse(userMessage) {
  try {
    // Send request to Python backend
    const response = await fetch('http://localhost:5000/chat', {
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


// ── BONUS: Send on Enter key ──
userInput.addEventListener('keypress', function(e) {
  if (e.key === 'Enter') sendMessage();
});
