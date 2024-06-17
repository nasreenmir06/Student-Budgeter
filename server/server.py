from flask import Flask, request, jsonify, send_from_directory
import openai
from flask_cors import CORS
import os

app = Flask(__name__, static_folder='../build')
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

#ENTER YOUR KEY BELOW
openai.api_key = ''

@app.route('/api/suggestions', methods=['POST', 'OPTIONS'])
def get_suggestions():
    if request.method == 'OPTIONS':
        response = app.make_default_options_response()
        headers = response.headers

        headers['Access-Control-Allow-Origin'] = 'http://localhost:3000'
        headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
        headers['Access-Control-Allow-Headers'] = 'Content-Type'

        return response

    data = request.json
    prompt = data['prompt']

    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
        {"role": "system", "content": "You are a financial advisor for university students."},
        {"role": "user", "content": prompt}
        ]
        ,
        max_tokens=500,
        temperature=0.3
    )
    suggestion = response['choices'][0]['message']['content'].strip()
    response = jsonify({'suggestion': suggestion})
    response.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000'
    return response

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react_app(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

@app.after_request
def after_request(response):
    response.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
    response.headers['Access-Control-Allow-Methods'] = 'GET,PUT,POST,DELETE,OPTIONS'
    return response

if __name__ == '__main__':
    app.run(debug=True)
