import { useRef, useState } from "react";
import classes from "./AddEmployeeForm.module.css";

function AddEmployeeForm() {
  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  const [isLoading, setLoading] = useState(false);

  const submitHandler = (e) => {
    e.preventDefault();

    const currentEmail = emailInputRef.current.value;
    const currentPassword = passwordInputRef.current.value;

    let url =
      "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=";

    const apiKey = process.env.REACT_APP_FIREBASE_PROJECTKEY;
  };

  return (
    <section className={classes.auth}>
      <h1>ADD NEW EMPLOYEE</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input type="email" id="email" required ref={emailInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input
            type="password"
            id="password"
            required
            ref={passwordInputRef}
          />
        </div>
        <div className={classes.actions}>
          {!isLoading && <button>Add</button>}
          {isLoading && <p> Loading.... </p>}
        </div>
      </form>
    </section>
  );
}

export default AddEmployeeForm;
