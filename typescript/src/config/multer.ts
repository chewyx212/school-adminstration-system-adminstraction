import fs from 'fs';
import multer from 'multer';

const UPLOAD_DIR = '/tmp/school-administration-system-uploads';
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const diskStorage = multer.diskStorage({
  destination: UPLOAD_DIR,
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
});

const upload = multer({
  storage: diskStorage,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

export default upload;
