from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle

# Load the trained model
with open('./Adaboost_model.pkl', 'rb') as file:
    model = pickle.load(file)

with open('scaler.pkl', 'rb') as scaler_file:
    scaler = pickle.load(scaler_file)

app = Flask(__name__)
CORS(app)

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers',
                         'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods',
                         'GET,PUT,POST,DELETE,OPTIONS')
    return response

@app.route('/getdata', methods=['GET'])
def getdata():
    return jsonify({'Hi': 'data'})

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get data from request
        data = request.get_json()

        # Check if 'features' key exists in the request data
        if 'features' not in data:
            return jsonify({'error': 'Missing "features" in request'}), 400

        features = data['features']

        # Check if the number of features matches the model's expected input
        if len(features) != len(scaler.mean_):  # Assuming the scaler was fitted with the same number of features
            return jsonify({'error': 'Incorrect number of features'}), 400

        # Scale the input features
        random_input_scaled = scaler.transform([features])

        # Predict the probability of conversion (class 1)
        probability = model.predict_proba(random_input_scaled)[0][1]  # Class 1 is the conversion class

        # Make the final prediction
        prediction = model.predict([features])[0]

        # Return both the predicted class and the probability
        return jsonify({
            'prediction': prediction,
            'probability': probability  # Probability as percentage
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)