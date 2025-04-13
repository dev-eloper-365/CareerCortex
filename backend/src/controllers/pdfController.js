const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

const processPdf = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No PDF file uploaded' });
    }

    // Step 1: Upload the file to PDF.co
    const formData = new FormData();
    formData.append('file', fs.createReadStream(req.file.path));

    const uploadRes = await axios.post(
      'https://api.pdf.co/v1/file/upload',
      formData,
      {
        headers: {
          'x-api-key': process.env.PDF_CO_API_KEY,
          ...formData.getHeaders()
        }
      }
    );

    if (!uploadRes.data.url) {
      throw new Error('Failed to upload file to PDF.co');
    }

    const fileUrl = uploadRes.data.url;

    // Step 2: Convert PDF to text
    const convertRes = await axios.post(
      'https://api.pdf.co/v1/pdf/convert/to/text',
      {
        url: fileUrl,
        inline: true
      },
      {
        headers: { 'x-api-key': process.env.PDF_CO_API_KEY }
      }
    );

    // Clean up uploaded file
    fs.unlinkSync(req.file.path);

    // Return the extracted text
    res.json({
      success: true,
      text: convertRes.data.body
    });

  } catch (error) {
    console.error('Error processing PDF:', error);
    
    // Clean up uploaded file in case of error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      message: error.response?.data?.message || 'Failed to process PDF'
    });
  }
};

const processImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file uploaded' });
    }

    // Step 1: Upload the file to PDF.co
    const formData = new FormData();
    formData.append('file', fs.createReadStream(req.file.path));

    const uploadRes = await axios.post(
      'https://api.pdf.co/v1/file/upload',
      formData,
      {
        headers: {
          'x-api-key': process.env.PDF_CO_API_KEY,
          ...formData.getHeaders()
        }
      }
    );

    if (!uploadRes.data.url) {
      throw new Error('Failed to upload file to PDF.co');
    }

    const fileUrl = uploadRes.data.url;

    // Step 2: Extract text from image using OCR
    const convertRes = await axios.post(
      'https://api.pdf.co/v1/ocr/recognize',
      {
        url: fileUrl,
        inline: true,
        language: 'eng'
      },
      {
        headers: { 'x-api-key': process.env.PDF_CO_API_KEY }
      }
    );

    // Clean up uploaded file
    fs.unlinkSync(req.file.path);

    // Return the extracted text
    res.json({
      success: true,
      text: convertRes.data.body
    });

  } catch (error) {
    console.error('Error processing image:', error);
    
    // Clean up uploaded file in case of error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      message: error.response?.data?.message || 'Failed to process image'
    });
  }
};

module.exports = {
  processPdf,
  processImage
}; 