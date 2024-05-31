import multer from "multer";
import fs from "fs";
import path from "path";

const multerStorage = (destination) => {
  // Create the destination directory if it doesn't exist
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, { recursive: true });
  }

  // Configure Multer
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, destination);
    },

    filename: function (req, file, cb) {
      const imageFile = file.originalname.split(".");
      const extName = imageFile.pop();
      const fileName = imageFile.join(".");

      cb(null, `${fileName}-${Date.now()}.${extName}`);
    },
  });
  const upload = multer({
    storage: storage,
    limits: { fileSize: 512_000_000 },
  });
  return upload;
};

export const deletePic = (picName) => {
  const picPath = path.join(process.cwd(), `public/images/profiles/` + picName);

  fs.unlink(picPath, (err) => {
    if (err) {
      console.log("خط در حذف فایل", err);
      return;
    }
  });
};

export default multerStorage;
