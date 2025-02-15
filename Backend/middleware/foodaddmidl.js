import multer from "multer";
import path from "path";

// Use Render's persistent disk or any other location for uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '/mnt/data/uploads'); // Change this to Render's persistent disk location
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`); // Ensure unique filenames
  }
});

const upload = multer({ storage: storage });
export default upload;
