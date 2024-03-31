from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle


app = Flask(__name__)
CORS(app)
# Load your trained machine learning model
with open("scaler.pkl", "rb") as model_file:
    scaler = pickle.load(model_file)

with open("best_mlp.pkl", "rb") as model_file:
    best_mlp = pickle.load(model_file)


# Define a route for receiving input and making predictions
@app.route("/input", methods=["POST"])
def input():
    # Extract data from the request
    print("HELLO WORLD")
    data = request.get_json()
    print(type(data))
    converted_data = [
        [
            int(data[0]["age"]),
            float(data[0]["sleepDuration"]),
            int(data[0]["awakenings"]),
            float(data[0]["caffeine"]),  
            float(data[0]["alcohol"]),
            float(data[0]["smoking"]),
            float(data[0]["exercise"]),
        ]
    ]

    print(converted_data)
    # Preprocess the data as necessary
    # For example, convert it into a format suitable for your model

    # Make predictions using your machine learning model
    new_data = scaler.transform(converted_data)
    print(new_data)
    predictions = best_mlp.predict(new_data)

    print(predictions)
    # Return the predictions as JSON
    return jsonify(predictions.tolist())


if __name__ == "__main__":
    app.run(debug=True)
