const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const os = require('os');

const processPdf = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }

    const pdfPath = req.file.path;
    const message = req.body.message || '';

    // Create form data for PDF.co API
    const formData = new FormData();
    formData.append('file', fs.createReadStream(pdfPath));
    formData.append('api_key', process.env.PDF_CO_API_KEY);

    // Upload PDF to PDF.co
    const uploadResponse = await axios.post('https://api.pdf.co/v1/file/upload', formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    if (!uploadResponse.data.url) {
      throw new Error('Failed to upload PDF to PDF.co');
    }

    const pdfUrl = uploadResponse.data.url;

    // Extract text from PDF
    const extractResponse = await axios.post('https://api.pdf.co/v1/pdf/convert/to/text', {
      url: pdfUrl,
      api_key: process.env.PDF_CO_API_KEY,
    });

    if (!extractResponse.data.url) {
      throw new Error('Failed to extract text from PDF');
    }

    // Download the extracted text
    const textResponse = await axios.get(extractResponse.data.url);
    const extractedText = textResponse.data;

    // Clean up temporary file
    fs.unlinkSync(pdfPath);

    // Process the extracted text with your existing chat logic
    // TODO: Integrate with your chat processing logic

    res.json({
      message: `I've processed your PDF. Here's what I found: ${extractedText.substring(0, 200)}...`,
      extractedText,
    });
  } catch (error) {
    console.error('Error processing PDF:', error);
    res.status(500).json({ error: 'Failed to process PDF' });
  }
};

module.exports = {
  processPdf,
}; 