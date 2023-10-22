const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cors());
app.use(express.static(__dirname));

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log(error);
  });

const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, "public/images/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  filename1: {
    type: String,
    required: true,
  },
  path1: {
    type: String,
    required: true,
  },
  filename2: {
    type: String,
    required: true,
  },
  path2: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("User", userSchema);

const isValidFile = (file) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  const maxFileSize = 1024 * 1024; // 1MB

  return allowedTypes.includes(file.mimetype) && file.size <= maxFileSize;
};

app.post(
  "/upload",
  upload.fields([{ name: "file1" }, { name: "file2" }]),
  (req, res) => {
    const file1 = req.files["file1"][0];
    const file2 = req.files["file2"][0];
    const username = req.body.username;

    if (!file1 && !file2) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    if (!isValidFile(file1) && !isValidFile(file2)) {
      return res.status(400).json({ error: "Invalid file type or size." });
    }

    const { filename: filename1, path: path1 } = file1;
    const { filename: filename2, path: path2 } = file2;

    const newFile = new User({
      username,
      filename1,
      path1,
      filename2,
      path2,
    });

    newFile
      .save()
      .then((result) => {
        return res.status(200).json("Uploaded successfully " + result);
      })
      .catch((error) => {
        return res.status(400).json("Uploading failed " + error);
      });
  }
);

app.listen(port, () => {
  console.log("Server running at port " + port);
});
