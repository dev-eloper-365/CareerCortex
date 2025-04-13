# Career Cortex Backend

This is the backend server for the Career Cortex application, handling PDF and image processing functionality.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with the following variables:
```
PORT=5000
```

3. Create an `uploads` directory in the root folder:
```bash
mkdir uploads
```

## Running the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### PDF Processing
- `POST /api/pdf/process-pdf`
  - Accepts PDF files
  - Returns processed PDF data

### Image Processing
- `POST /api/pdf/process-image`
  - Accepts image files (jpeg, jpg, png, gif)
  - Returns processed image data

## File Uploads
- Files are temporarily stored in the `uploads` directory
- Supported file types:
  - PDF files
  - Images (jpeg, jpg, png, gif)
- Maximum file size: 10MB

## Error Handling
The server includes error handling middleware that will:
- Log errors to the console
- Return appropriate error responses to the client
- Handle file upload errors and unsupported file types 