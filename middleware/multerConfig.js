const multer = require('multer');

// Configure multer to save files to the 'uploads' directory
const storage = multer.diskStorage({
destination: (req, file, cb) => {
cb(null, 'uploads/');
},
filename: (req, file, cb) => {
cb(null, Date.now() + '-' + file.originalname);
}
});

const upload = multer({ storage });

module.exports = upload;