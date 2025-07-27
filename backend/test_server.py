from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/test', methods=['GET'])
def test():
    return jsonify({"message": "Backend is working!"})

@app.route('/api/auth/profile', methods=['GET'])
def profile():
    return jsonify({"message": "Profile endpoint working", "user": None})

if __name__ == '__main__':
    print("Starting test server...")
    app.run(host='0.0.0.0', port=5000, debug=True)