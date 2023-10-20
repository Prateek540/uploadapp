import "./App.css";
import React, { useState } from "react";
import axios from "axios";

function App() {
  const [username, setUsername] = useState("");
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
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

    if (!isValidFile(file)) {
      alert("Invalid file try again");
      return;
    }

    const data = { username, file };

    axios
      .post("upload", data, {
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
        <label htmlFor="file">File </label>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload}>Submit</button>
      </form>
    </>
  );
}

export default App;
