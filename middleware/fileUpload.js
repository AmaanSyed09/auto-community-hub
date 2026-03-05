const path = require("path");
const multer = require("multer");

//storage engine for multer to store files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images"); //path to store images
  },

  //update file name to store in the destination folder
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname) //file name
    );
  },
});

//file filter to check if the file is an image(jpg, jpeg, png, gif)
const fileFilter = (req, file, cb) => {
  const mimeTypes = ["image/jpeg", "image/png", "image/gif"];

  if (mimeTypes.includes(file.mimetype)) {
    return cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only jpeg, jpg, png and gif image files are allowed."
      )
    );
  }
};

//multer upload function to upload a single image
const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, //50MB file size limit
  fileFilter: fileFilter,
}).single("image"); //name of the single input field

//middleware function to upload file with error handling
exports.fileUpload = (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      err.status = 400; //adding status 400 to the error object as multer error does not have predefined error status
      next(err);
    } else {
      next(); //if no error, move to the next middleware in app.js file line 20-24
    }
  });
};
