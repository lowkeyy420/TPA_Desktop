import { format, parseISO } from "date-fns";
import { useRef, useState } from "react";
import NumberInput from "../NumberInput";
import classes from "./AddEmployeeForm.module.css";

function AddEmployeeForm() {
  const nameInputRef = useRef();
  const emailInputRef = useRef();
  const dobInputRef = useRef();
  const addressInputRef = useRef();
  const maleGenderRef = useRef();
  const femaleGenderRef = useRef();
  const salaryInputRef = useRef();
  const passwordInputRef = useRef();

  const initialStatus = "Active";
  const startWorkingDate = format(new Date(), "dd/MM/yyyy");

  const [isLoading, setIsLoading] = useState(false);

  const submitHandler = (e) => {
    e.preventDefault();

    const currentEmail = emailInputRef.current.value;
    const currentPassword = passwordInputRef.current.value;

    let url = "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=";

    const apiKey = process.env.REACT_APP_FIREBASE_PROJECTKEY;

    setIsLoading(true);

    fetch(`${url}${apiKey}`, {
      method: "POST",
      body: JSON.stringify({
        email: currentEmail,
        password: currentPassword,
        returnSecureToken: true,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        setIsLoading(false);
        if (res.ok) {
          return res.json();
        } else {
          return res.json().then((data) => {
            let errorMessage = "Authentication Failed";

            if (data && data.error && data.error.message) {
              errorMessage = data.error.message;
            }
            throw new Error(errorMessage);
          });
        }
      })
      .catch((err) => {
        alert(err.message);
      });
  };
  function submitHandler2(e) {
    e.preventDefault();
    const currentEmail = emailInputRef.current.value;
    const currentPassword = passwordInputRef.current.value;
    const currentName = nameInputRef.current.value;
    const currentDOB = dobInputRef.current.value;
    const currentAddress = addressInputRef.current.value;
    const currentGender = maleGenderRef.current.checked
      ? maleGenderRef.current.value
      : femaleGenderRef.current.value;
    const currentSalary = salaryInputRef.current.value;

    console.log(currentName);
    console.log(currentDOB);
    console.log(currentEmail);
    console.log(currentAddress);
    console.log(currentGender);
    console.log(currentSalary);
    console.log(currentPassword);
    console.log(initialStatus);
    const testDate = format(parseISO(currentDOB), "dd/MM/yyyy");
    console.log(testDate.toString());
  }

  return (
    <section className={classes.auth}>
      <h1>ADD NEW EMPLOYEE</h1>
      <form onSubmit={submitHandler2}>
        <div className={classes.control}>
          <label htmlFor="name">Name</label>
          <input type="text" id="name" required ref={nameInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor="dob">DOB</label>
          <input type="date" id="dob" required ref={dobInputRef} />
        </div>

        <div className={classes.control}>
          <label htmlFor="email">Email</label>
          <input type="email" id="email" required ref={emailInputRef} />
        </div>

        <div className={classes.control}>
          <label htmlFor="address">Address</label>
          <input type="address" id="address" required ref={addressInputRef} />
        </div>

        <div className="test">
          <label htmlFor="male">male</label>
          <input
            type="radio"
            id="male"
            name="gender"
            defaultChecked
            value="Male"
            ref={maleGenderRef}
          />
          <label htmlFor="female">female</label>
          <input
            type="radio"
            id="female"
            name="gender"
            value="Female"
            ref={femaleGenderRef}
          />
        </div>

        <NumberInput
          cname={classes.control}
          inputRef={salaryInputRef}
          label="Salary"
        />

        <div className={classes.control}>
          <label htmlFor="password">Password</label>
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
