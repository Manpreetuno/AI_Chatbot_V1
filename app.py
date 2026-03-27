from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import openai

app = Flask(__name__)
CORS(app)

# ── Home route add karo — YEH MISSING HAI! ──
@app.route('/')
def home():
    return render_template('index.html')  # ← yeh line zaroori hai!

@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    user_message = data['message']
    print(f"User said: {user_message}")
    bot_reply = get_ai_response(user_message)
    return jsonify({'reply': bot_reply})

def get_ai_response(message):
    client = openai.OpenAI(api_key="sk-")
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": message}
        ]
    )
    return response.choices[0].message.content

if __name__ == '__main__':
    app.run(debug=True, port=5000)
