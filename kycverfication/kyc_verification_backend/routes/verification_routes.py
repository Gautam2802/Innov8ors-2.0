# routes/verification_routes.py
# Ensure this line is at the top of your script
import os
from collections import deque
import cv2
from flask import Blueprint, request, jsonify
from pymongo import MongoClient
from werkzeug.utils import secure_filename
import os
import cloudinary
import time
import numpy as np
import cloudinary.uploader
from cloudinary.utils import cloudinary_url
from services.liveness_detection import capture_live_image
from services.image_verification import verify_images
from bson.objectid import ObjectId
from skimage.metrics import structural_similarity as ssim

# Setup MongoDB connection
client = MongoClient('mongodb://localhost:27017/')
db = client['kyc_verification']
users_collection = db['users']

# Define the blueprint for verification-related routes
verification_blueprint = Blueprint('verification', __name__)

cloudinary.config( 
    cloud_name = "dngeaztbd", 
    api_key = "756332936681698", 
    api_secret = "PGSTb9754gK11krtf0fsUwF7-oY", # Click 'View API Keys' above to copy your API secret
    secure=True
)
# Directory to save uploaded images temporarily
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@verification_blueprint.route('/login', methods=['POST'])
def save_user():
    """
    Route to save user details (name and mobile number) to MongoDB.
    """
    data = request.json
    name = data.get('name')
    mobile = data.get('mobile')

    if not name or not mobile:
        return jsonify({'error': 'Name and mobile number are required'}), 400
    
    if users_collection.find_one({'mobile': mobile}):
        return jsonify({'error': 'Mobile number already exists. Please use a different number.'}), 400

    # Save user data to MongoDB
    user_id = users_collection.insert_one({'name': name, 'mobile': mobile}).inserted_id
    return jsonify({'status': 'User saved successfully', 'userId': str(user_id)})

@verification_blueprint.route('/get_images', methods=['POST'])
def get_images():
    # data = request.get_json()
    # user_id = data.get('userId')
    # return jsonify({
    #         'result' : "request responded !!",
    #         user_id: user_id
    # })
    # Get userId from request body
        data = request.get_json()
        user_id = data.get('userId')

        if not user_id:
            return jsonify({'error': 'User ID is required.'}), 400

        # Find the user in the database
        user = users_collection.find_one({'_id': ObjectId(user_id)})  # Ensure userId is stored in the database

        if not user:
            return jsonify({'error': 'User not found.'}), 404

        # Extract URLs from the user's record
        id_image_url = user.get('id_document_url')
        captured_image_url = user.get('live_image_url')

        if not id_image_url or not captured_image_url:
            return jsonify({'error': 'Image URLs not found for the user.'}), 404

        # Return the URLs to the frontend
        return jsonify({
            'id_image_url': id_image_url,
            'captured_image_url': captured_image_url
        })
    
    
    
    
    
    
    
    
    
    
    
    
    # try:
        # # Get userId from request body
        # data = request.get_json()
        # user_id = data.get('userId')

        # if not user_id:
        #     return jsonify({'error': 'User ID is required.'}), 400

        # # Find the user in the database
        # user = users_collection.find_one({'userId': user_id})  # Ensure userId is stored in the database

        # if not user:
        #     return jsonify({'error': 'User not found.'}), 404

        # # Extract URLs from the user's record
        # id_image_url = user.get('id_document')
        # captured_image_url = user.get('Live_image_url')

        # if not id_image_url or not captured_image_url:
        #     return jsonify({'error': 'Image URLs not found for the user.'}), 404

        # # Return the URLs to the frontend
        # return jsonify({
        #     'id_image_url': id_image_url,
        #     'captured_image_url': captured_image_url
        # })

    # except Exception as e:
    #     return jsonify({'error': str(e)}), 500


@verification_blueprint.route('/capture', methods=['GET'])
def capture_image():
    """
    Route to capture a live image from the user's webcam.
    Uses the liveness detection service to save the image locally.
    """
    image_path, message = capture_live_image()
    if not image_path:
        return jsonify({'error': message}), 500
    return jsonify({'status': message, 'image_path': image_path})


@verification_blueprint.route('/upload', methods=['POST'])
def upload_files():
    """
    Route to handle the upload of ID document and second image for verification.
    Verifies the uploaded images against the live captured image.
    """
    # Retrieve the files from the request
    id_document = request.files.get('id_document')
    second_image = request.files.get('second_image')

    # Check if both images are provided
    if not id_document or not second_image:
        return jsonify({'error': 'Both images are required'}), 400

    # Securely save the uploaded images to the uploads directory
    id_path = os.path.join(UPLOAD_FOLDER, secure_filename(id_document.filename))
    second_image_path = os.path.join(UPLOAD_FOLDER, secure_filename(second_image.filename))
    id_document.save(id_path)
    second_image.save(second_image_path)

    # Perform verification between the live captured image and ID document
    live_image_path = os.path.join(UPLOAD_FOLDER, 'live_image.jpg')  # Path of the captured live image
    if not os.path.exists(live_image_path):
        return jsonify({'error': 'Live image not found. Please capture a live image first.'}), 400

    # Call the verification service to compare images
    success, message = verify_images(live_image_path, id_path)
    if not success:
        return jsonify({'error': message}), 400

    return jsonify({'status': message, 'id_path': id_path, 'second_image_path': second_image_path})


@verification_blueprint.route('/upload-documents', methods=['POST'])
def upload_documents():
    """
    Route to upload ID document and second image to Cloudinary and save their URLs in MongoDB.
    """
    user_id = request.form.get('userId')
    id_document = request.files.get('id_document')
    second_image = request.files.get('second_image')

    if not id_document or not second_image or not user_id:
        return jsonify({'error': 'All fields are required'}), 400

    # Upload files to Cloudinary
    id_upload = cloudinary.uploader.upload(id_document)
    second_upload = cloudinary.uploader.upload(second_image)
    

    # Save Cloudinary URLs to MongoDB
    users_collection.update_one(
        {'_id': ObjectId(user_id)},
        {'$set': {
            'id_document_url': id_upload['secure_url'],
            'second_image_url': second_upload['secure_url']
        }}
    )

    return jsonify({'status': 'Documents uploaded successfully'})


# @verification_blueprint.route('/capture-live-image', methods=['POST'])
# def upload_live_image():
#     data = request.json
#     user_id = data.get('userId')

#     if not user_id:
#         return jsonify({'error': 'User ID is required'}), 400

#     image_path, message = capture_live_image()
#     if not image_path:
#         return jsonify({'error': message}), 500

#     live_upload = cloudinary.uploader.upload(image_path)

#     users_collection.update_one(
#         {'_id': ObjectId(user_id)},
#         {'$set': {'live_image_url': live_upload['secure_url']}}
#     )

#     return jsonify({'status': 'Live image captured successfully', 'live_image_url': live_upload['secure_url']})

def capture_frames_and_check(user_id):
    try:
        cap = cv2.VideoCapture(0)  # Open webcam
        if not cap.isOpened():
            print("Error: Could not open webcam.")
            return 'fake'

        # Initialize the Haar Cascade for face detection inside the function to avoid scoping issues
        face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

        frames = deque(maxlen=10)  # Use deque to maintain the latest 10 frames
        similarity_threshold = 0.75  # Set the similarity threshold lower to allow for slight variations
        matching_count = 0  # Counter for consecutive matching frames
        max_processing_time = 30  # Maximum time (in seconds) to allow for processing before timing out
        start_time = time.time()  # Start time to track the duration

        print("Webcam opened. Starting to capture and compare frames...")

        # Start capturing frames continuously
        while True:
            ret, frame = cap.read()
            if not ret:
                print("Error: Could not read frame from webcam.")
                break

            # Check for timeout
            elapsed_time = time.time() - start_time
            if elapsed_time > max_processing_time:
                print("Processing timed out. Marking as 'fake'.")
                cap.release()
                cv2.destroyAllWindows()
                return 'fake'

            # Add the latest frame to the deque
            frames.append(frame)

            # Initialize label to avoid uninitialized variable error
            label = "Fake"

            # Draw bounding boxes around faces and check the number of faces
            frame_with_faces, face_count = detect_and_draw_faces(frame, face_cascade, label="")

            # Skip processing if no face or multiple faces are detected
            if face_count != 1:
                print(f"Detected {face_count} faces. Marking as 'fake'.")
                matching_count = 0  # Reset the count because conditions are not met
            else:
                # Check if we have at least 2 frames to compare
                if len(frames) >= 2:
                    # Compare the latest two frames in the deque
                    similarity = compare_frames(frames[-2], frames[-1])
                    print(f"Similarity between Frame {len(frames) - 2} and Frame {len(frames) - 1}: {similarity}")

                    # Check if the similarity meets the threshold
                    if similarity >= similarity_threshold:
                        matching_count += 1
                        label = "Real"
                    else:
                        matching_count = 0  # Reset count if frames do not match

                    # If 10 consecutive frames match, mark as 'real'
                    if matching_count >= 10:
                        print("10 consecutive frames are similar; marking as 'real'.")
                        last_frame = frames[-1]
                        success, encoded_image = cv2.imencode('.jpg', last_frame)
                        if success:
                            live_response = cloudinary.uploader.upload(encoded_image.tobytes(), folder="live_images/")
                            live_image_url = live_response['secure_url']
                            print("Live image uploaded to Cloudinary:", live_image_url)

                            users_collection.update_one(
                                {'_id': ObjectId(user_id)},
                                {'$set': {'live_image_url': live_image_url}}
                            )
                            print(f"Database updated with live image URL for user ID: {user_id}")

                        else:
                            print("Error: Failed to encode the image.")
                            break

                        cap.release()
                        cv2.destroyAllWindows()
                        return 'real'
            # Update the bounding box color based on the label
            frame_with_faces, _ = detect_and_draw_faces(frame, face_cascade, label=label)
            
            # Check frame validity before displaying
            if frame_with_faces is not None and isinstance(frame_with_faces, np.ndarray):
                cv2.imshow('Capturing', frame_with_faces)
            else:
                print("Invalid frame, skipping display.")

            # Wait for 0.2 seconds before capturing the next frame
            time.sleep(0.2)

            # Exit on pressing 'q'
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

        cap.release()
        cv2.destroyAllWindows()

    except Exception as e:
        print(f"Error during frame capture and check: {e}")
        cap.release()
        cv2.destroyAllWindows()
        return 'fake'


def compare_frames(frame1, frame2):
    """
    Compare two frames using Structural Similarity Index (SSIM).
    Returns a similarity score between 0 and 1.
    """
    gray1 = cv2.cvtColor(frame1, cv2.COLOR_BGR2GRAY)
    gray2 = cv2.cvtColor(frame2, cv2.COLOR_BGR2GRAY)

    # Calculate SSIM using skimage
    similarity, _ = ssim(gray1, gray2, full=True)

    return similarity


def detect_and_draw_faces(frame, face_cascade, label=""):
    """
    Detect faces in a frame, draw bounding boxes around them, and display a label.
    Returns the processed frame and the count of detected faces.
    """
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

    # Draw rectangles around detected faces and count the number of faces
    face_count = len(faces)
    for (x, y, w, h) in faces:
        # Draw a green rectangle if label is "Real", red otherwise
        color = (0, 255, 0) if label == "Real" else (0, 0, 255)
        cv2.rectangle(frame, (x, y), (x + w, y + h), color, 2)

        # Display the label ("Real" or "Fake") above the bounding box
        cv2.putText(frame, label, (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, color, 2)

    return frame, face_count

@verification_blueprint.route('/upload_live', methods=['POST'])
def upload_live():
    try:
        data = request.json
        user_id = data.get('userId')
        label_name = capture_frames_and_check(user_id)
        if label_name == 'real':
            return jsonify({'result': 'real'}), 200
        else:
            return jsonify({'result': 'fake'}), 200
    except Exception as e:
        # Log detailed error information
        print(f"Error occurred in /upload_live endpoint: {e}")
        return jsonify({'error': str(e)}), 500
    

    
 