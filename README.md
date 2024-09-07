"# Account-Management" 
# Face Recognition Service

This service implements **face recognition** using Flask and the `face_recognition` library, a powerful Python tool for face recognition. The service allows for image uploads, facial recognition against a known set of images, and dynamic addition of new faces to the recognition database.

## Key Features

- **Face Recognition API**: Identifies faces from an uploaded image and compares them against a known set of faces.
- **Dynamic Image Upload**: Upload custom images to expand the face database.
- **Advanced Image Processing**: Utilizes `face_recognition`, OpenCV, and PIL libraries.
- **CORS Support**: Manages cross-origin requests for client-side integration.

## Technologies Used

- **Flask**: A lightweight framework for building web APIs.
- **OpenCV**: A library for image processing.
- **face_recognition**: A library for face recognition using deep learning.
- **PIL**: Python Imaging Library for image conversion.
- **Flask-CORS**: Enables Cross-Origin Resource Sharing.

## Installation and Local Running

1. **Clone the Repository**:
    ```bash
    git clone https://github.com/yourusername/face-recognition-service.git
    cd face-recognition-service
    ```

2. **Install Dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

3. **Run the Service**:
    ```bash
    python app.py
    ```

4. **Test the Service**:
    - The service will run at `http://localhost:5000`. Use cURL or Postman to test the endpoints.

## API Endpoints

### 1. Face Recognition Upload (`/upload`)

- **Method**: `POST`
- **Description**: Upload an image and perform recognition against known faces.
- **Request**: Form-data with the file under key `image`.
- **Response**:
    - `{"match": true, "person": "Miri.jpg"}` if a match is found.
    - `{"match": false, "person": null}` if no match is found.

#### Example Request:
```bash
curl -X POST -F "image=@unknown.jpg" http://localhost:5000/upload
```

נ
