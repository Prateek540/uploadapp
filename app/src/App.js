import "./App.css";
import React, { useState } from "react";
import axios from "axios";

function App() {
  const [username, setUsername] = useState("");
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);

  const handleFileChange1 = (e) => {
    setFile1(e.target.files[0]);
  };

  const handleFileChange2 = (e) => {
    setFile2(e.target.files[0]);
  };

  const handleusernameChange = (e) => {
    setUsername(e.target.value);
  };

  const isValidFile = (file) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    const maxFileSize = 1024 * 1024; // 1MB

    return allowedTypes.includes(file.type) && file.size <= maxFileSize;
  };

  const handleUpload = (e) => {
    e.preventDefault();

    if (!isValidFile(file1) && !isValidFile(file2)) {
      alert("Invalid file try again");
      return;
    }

    const formData = new FormData();
    formData.append("username", username);
    formData.append("file1", file1);
    formData.append("file2", file2);

    axios
      .post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        alert(response);
      })
      .catch((error) => {
        alert(error);
      });
  };

  return (
    <>
      <form className="form">
        <label htmlFor="username">Username </label>
        <input type="text" onChange={handleusernameChange} />
        <br />
        <br />
        <label htmlFor="file">File 1</label>
        <input type="file" name="file1" onChange={handleFileChange1} />
        <label htmlFor="file">File 2</label>
        <input type="file" name="file2" onChange={handleFileChange2} />
        <button onClick={handleUpload}>Submit</button>
      </form>
    </>
  );
}

export default App;
