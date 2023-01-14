import { useContext, useRef, useState } from "react";
import Modal from "../ui/Modal";
import Backdrop from "../ui/Backdrop";
import classes from "./AddForm.module.css";
import AuthContext from "../../store/auth-context";
import { format } from "date-fns";

function AddFundRequestForm() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const authCtx = useContext(AuthContext);

  const reasonInputRef = useRef();
  const amountInputRef = useRef();

  function showModalHandler(e) {
    e.preventDefault();
    setModalIsOpen(true);
  }

  function closeModalHandler() {
    setModalIsOpen(false);
  }

  function submitHandler() {
    setIsLoading(true);

    const issuedDate = format(new Date(), "dd/MM/yyyy").toString();

    const reasonGiven = reasonInputRef.current.value;
    const amountRequested = amountInputRef.current.value;

    const baseURL = process.env.REACT_APP_FIREBASE_BASEURL;

    fetch(`${baseURL}fund-request/${authCtx.user}.json`, {
      method: "POST",
      body: JSON.stringify({
        issuedate: issuedDate,
        amount: amountRequested,
        reason: reasonGiven,
        status: "Pending",
      }),
      headers: {
        "Content-Type": "application/JSON",
      },
    }).then((res) => {
      setIsLoading(false);
      closeModalHandler();
      if (res.ok) {
        alert("Sucessfully added");
      } else {
        alert("Error occured");
      }
      reasonInputRef.current.value = "";
      amountInputRef.current.value = 0;
    });
  }

  return (
    <section>
      <h1>Create Leave Request</h1>
      <form onSubmit={showModalHandler}>
        <div className={classes.control}>
          <label htmlFor="dob" style={{ color: "black" }}>
            Input Amount of Fund
          </label>
          <input type="number" id="amount" required ref={amountInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor="name" style={{ color: "black" }}>
            Reason
          </label>
          <textarea id="name" required ref={reasonInputRef} />
        </div>
        <div className={classes.actions}>
          <button>Add</button>
        </div>
        {modalIsOpen && !isLoading && (
          <Modal onCancel={closeModalHandler} onConfirm={submitHandler} />
        )}

        {modalIsOpen && isLoading && (
          <h1 style={{ color: "black", textAlign: "center" }}>LOADING...</h1>
        )}
        {modalIsOpen && <Backdrop />}
      </form>
    </section>
  );
}

export default AddFundRequestForm;
