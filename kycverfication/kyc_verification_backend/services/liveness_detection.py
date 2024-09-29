# services/liveness_detection.py

import cv2  # OpenCV library for video capture

def capture_live_image():
    """
    Capture a live image using the webcam and save it.
    Returns the path to the saved image and a success message.
    """
    cap = cv2.VideoCapture(0)  # Open the default camera (0 indicates the first camera)
    ret, frame = cap.read()    # Capture a single frame
    cap.release()              # Release the camera resource

    if not ret:
        return None, "Failed to capture image."

    # Save the captured frame as an image file in the uploads directory
    image_path = 'uploads/live_image.jpg'
    cv2.imwrite(image_path, frame)
    return image_path, "Image captured successfully."
