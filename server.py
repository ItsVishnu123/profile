from flask import Flask, request, jsonify
from flask_cors import CORS
import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Allow frontend requests

@app.route("/")
def home():
    return "Flask Email API is running!"

@app.route("/send-email", methods=["POST"])
def send_email():
    print(f"Request method: {request.method}")  # ✅ Log the request method
    print(f"Request content type: {request.content_type}")  # ✅ Log the content type
    print(f"Request data: {request.data}")  # ✅ Log the raw request data

    data = request.get_json()  # Ensure JSON data is received
    if not data:
        return jsonify({"status": "error", "message": "Invalid JSON format"}), 400

    name = data.get("name")
    email = data.get("email")
    message = data.get("message")

    if not name or not email or not message:
        return jsonify({"status": "error", "message": "All fields are required!"}), 400

    try:
        # Email Configuration
        SMTP_SERVER = "smtp.gmail.com"
        SMTP_PORT = 587
        EMAIL_USER = os.getenv("EMAIL_USER")  # Use your Gmail
        EMAIL_PASS = os.getenv("EMAIL_PASS")  # Use your App Password

        # Create email
        msg = MIMEMultipart()
        msg["From"] = EMAIL_USER
        msg["To"] = EMAIL_USER  # Send to yourself
        msg["Subject"] = f"New Contact Form Submission from {name}"
        body = f"Name: {name}\nEmail: {email}\nMessage: {message}"
        msg.attach(MIMEText(body, "plain"))

        # Send Email
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(EMAIL_USER, EMAIL_PASS)
        server.sendmail(EMAIL_USER, EMAIL_USER, msg.as_string())
        server.quit()

        return jsonify({"status": "success", "message": "Message sent successfully!"}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": "Failed to send message", "error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
