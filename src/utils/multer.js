import multer from "multer";
import path from "path";

// const upload = multer({ dest: "./public/data/uploads/" });
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname.replace("src", ""), "../public/data/uploads"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + file.originalname);
  },
});

const upload = multer({ storage: storage });

export default upload;
