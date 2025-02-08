from flask import Flask, request, jsonify
from flask_cors import CORS
import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

EMAIL_USER = os.getenv("EMAIL_USER")  # Your Gmail
EMAIL_PASS = os.getenv("EMAIL_PASS")  # Your App Password

@app.route("/", methods=["GET"])
def home():
    return "Flask server is running!"

@app.route("/send-email", methods=["POST"])
def send_email():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"status": "error", "message": "Invalid JSON data"}), 400

        name = data.get("name")
        email = data.get("email")
        message = data.get("message")

        if not name or not email or not message:
            return jsonify({"status": "error", "message": "All fields are required"}), 400

        msg = MIMEMultipart()
        msg["From"] = EMAIL_USER
        msg["To"] = EMAIL_USER  # Send to yourself
        msg["Subject"] = f"New Contact Form Message from {name}"

        body = f"Name: {name}\nEmail: {email}\nMessage:\n{message}"
        msg.attach(MIMEText(body, "plain"))

        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(EMAIL_USER, EMAIL_PASS)
            server.sendmail(EMAIL_USER, EMAIL_USER, msg.as_string())

        return jsonify({"status": "success", "message": "Email sent successfully!"})

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000, debug=True)

