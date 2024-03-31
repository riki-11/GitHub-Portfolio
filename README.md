# SereniGuide Web Application
SereniGuide is an AI-powered sleep companion web application meant that helps rate the quality of your sleep based on factors such as age, hours of sleep, caffeine and alcohol intake, and nicotine use.

This application was built in partial fulfillment of the EMPATHY (Empathic Computing) course.

## Project setup

### Node.js and npm
Please install Node.js if you do not have it installed in your device then run the following commands
```
npm install
```

### Python Flask Server setup
Please install Python if you do not have it installed in your device then run the following commands
```
pip install flask
pip install scikit-learn
pip install flask_cors
```

### Running the Machine Learning Server
Please change your directory to flask_server by running:
```
cd flask_server
```

Then, run the ML server by typing the following command in the terminal:
```
python machine_learning.py
```

### Running the LocalHost Server
Please go back to previous directory by running the following command:
```
cd ..
```

Then, run the web application server by executing the command below:
```
npm run serve
```

### Access the web application by entering the following in the URL
```
localhost:8080
```
