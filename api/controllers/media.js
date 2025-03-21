const fs = require('fs');
const path = require('path');

exports.upload = (req, res) => {
  const urls = req.files.map((file) => {
    const extension = path.extname(file.originalname); // Get file extension
    const newPath = `${file.path}${extension}`; // Append extension to the file path
    fs.renameSync(file.path, newPath); // Synchronously rename the file
    return `/public/uploads/${path.basename(newPath)}`; // Return the correct URL
  });
  res.status(200).json({ urls }); // Send the URLs as a JSON response
};