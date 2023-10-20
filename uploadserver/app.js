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
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  filename: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("User", userSchema);

const isValidFile = (file) => {
  const allowedTypes = ["image/jpeg", "image/png"];
  const maxFileSize = 1024 * 1024; // 1MB

  return allowedTypes.includes(file.type) && file.size <= maxFileSize;
};

app.post("/upload", upload.single("file"), (req, res) => {
  if (req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  if (!isValidFile(req.file)) {
    return res.status(400).json({ error: "Invalid file type or size." });
  }

  const { filename, path } = req.file;
  const username = req.body.username;

  const newFile = new User({
    username,
    filename,
    path,
  });

  newFile
    .save()
    .then((result) => {
      return res.status(200).json("Uploaded successfully " + result);
    })
    .catch((error) => {
      return res.status(400).json("Uploading failed " + error);
    });
});

app.listen(port, () => {
  console.log("Server running at port " + port);
});
