import { format } from "date-fns";
import { useContext, useRef, useState } from "react";
import AuthContext from "../../store/auth-context";
import classes from "./AddForm.module.css";

function UploadResignationForm(props) {
  const [file, setFile] = useState();
  const [fileIsSelected, setFileIsSelected] = useState(false);
  const fileName = useRef();
  const authCtx = useContext(AuthContext);

  const storageURL = process.env.REACT_APP_FIREBASE_STORAGEURL;

  function changeHandler(e) {
    setFile(e.target.files[0]);
    setFileIsSelected(true);
    if (!e.target.files[0]) {
      setFileIsSelected(false);
    }
  }

  function getFileName(str) {
    const lastDot = str.lastIndexOf(".");
    const fileName = str.substring(0, lastDot);
    return fileName;
  }

  function createResignationLetter() {
    const issuedDate = format(new Date(), "dd/MM/yyyy").toString();
    const userId = authCtx.user;

    const baseURL = process.env.REACT_APP_FIREBASE_BASEURL;

    const letterURL = `${storageURL}resignation-letter%2F${userId}%2F${fileName.current}?alt=media`;
    fetch(`${baseURL}resignation-request/${userId}.json`, {
      method: "POST",
      body: JSON.stringify({
        issuedate: issuedDate,
        letter: letterURL,
        status: "Pending",
      }),
      headers: {
        "Content-Type": "application/JSON",
      },
    }).then((res) => {
      if (res.ok) {
        alert("Successfully added new resignation letter");
        props.refresher(".");
      } else {
        alert("Error occured");
      }
    });
  }

  function uploadHandler() {
    const formData = new FormData();
    fileName.current = getFileName(file.name);
    const userId = authCtx.user;
    formData.append("File", file);

    fetch(
      `${storageURL}resignation-letter%2F${userId}%2F${fileName.current}?alt=media`,
      {
        method: "POST",
        body: formData,
      }
    ).then((res) => {
      if (res.ok) {
        createResignationLetter();
      } else {
        alert("Failed uploading file! try again later");
      }
    });
  }

  return (
    <div>
      <h2 style={{ textAlign: "center" }}>Upload Resignation Letter</h2>
      <div className={classes.fileinput}>
        <input type="file" name="file" onChange={changeHandler} />
      </div>
      <div>
        {!fileIsSelected && (
          <p style={{ textAlign: "center" }}> Choose File to Upload..</p>
        )}
        {fileIsSelected && (
          <div className={classes.actions}>
            <button onClick={uploadHandler}>Upload</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default UploadResignationForm;
