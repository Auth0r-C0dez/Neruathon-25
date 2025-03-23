from flask import Flask, request, jsonify, send_file
import requests
from PIL import Image
from io import BytesIO
from flask_cors import CORS

# Initialize Flask app
app = Flask(__name__)
# Enable CORS for all routes
CORS(app)

# External API URL
NGROK_URL = "https://c7f5-34-16-192-78.ngrok-free.app/"

# Endpoint to generate image
@app.route("/generate", methods=["POST"])
def generate_image():
    try:
        # Get the prompt from the request
        data = request.json
        user_prompt = data.get("prompt")
        if not user_prompt:
            return jsonify({"error": "Prompt is required"}), 400

        # Send a POST request to the external API to generate the image
        response = requests.post(
            f"{NGROK_URL}/generate", 
            json={"prompt": user_prompt}, 
            headers={"Content-Type": "application/json"},
            stream=True  # Stream the response
        )

        # Check if the request was successful
        if response.status_code == 200:
            # Check content type to handle response appropriately
            content_type = response.headers.get('Content-Type', '')
            
            if 'image' in content_type:
                # If we received an image directly
                img_byte_arr = BytesIO(response.content)
            else:
                # If the API returns JSON with an image URL
                try:
                    json_response = response.json()
                    image_url = json_response.get('image_url')
                    if image_url:
                        # Download the image from the URL
                        img_response = requests.get(image_url)
                        img_byte_arr = BytesIO(img_response.content)
                    else:
                        return jsonify({"error": "No image URL in response"}), 500
                except:
                    # Assume we received an image directly
                    img_byte_arr = BytesIO(response.content)
            
            # Return the image directly in the response
            img_byte_arr.seek(0)
            return send_file(
                img_byte_arr,
                mimetype="image/png",
                as_attachment=False,
                download_name="generated_image.png"
            )
        else:
            error_message = f"Failed to generate image: {response.status_code}"
            try:
                error_message += f" - {response.json()}"
            except:
                pass
            print(error_message)
            return jsonify({"error": error_message}), 500

    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": str(e)}), 500

# Route to test if the server is running
@app.route("/ping", methods=["GET"])
def ping():
    return jsonify({"message": "Flask server is running"}), 200

# Run the Flask app
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)