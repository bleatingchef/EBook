import multer from "multer";

const upload = multer({
    // Set storage options, file size limits, etc.
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
  });
  
  export default (upload);