import { format, parseISO } from "date-fns";
import { useRef, useState } from "react";
import Factory from "../../facade/Factory";
import NumberInput from "../input/NumberInput";
import PasswordGenerator from "../../facade/PasswordGenerator";
import classes from "./AddForm.module.css";
import SelectInput from "../input/SelectInput";
import { roleOptions } from "../../model/Employee";

function AddEmployeeForm() {
  let newEmployeeID = "";
  const nameInputRef = useRef();
  const emailInputRef = useRef();
  const dobInputRef = useRef();
  const addressInputRef = useRef();
  const maleGenderRef = useRef();
  const femaleGenderRef = useRef();
  const salaryInputRef = useRef();
  const phoneInputRef = useRef();

  const roles = roleOptions;

  const apiKey = process.env.REACT_APP_FIREBASE_PROJECTKEY;
  const [isLoading, setIsLoading] = useState(false);
  const [userChoice, setUserChoice] = useState("");

  function getEmployeeId(refreshToken) {
    const url = "https://securetoken.googleapis.com/v1/token?key=";
    fetch(`${url}${apiKey}`, {
      method: "POST",
      body: JSON.stringify({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json().then((data) => {
            newEmployeeID = data.user_id;
          });
        }
      })
      .then(() => {
        createEmployeeHandler();
      });
  }

  function createEmployeeHandler() {
    const currentEmail = emailInputRef.current.value;
    const currentName = nameInputRef.current.value;
    const currentDOB = dobInputRef.current.value;
    const formattedDOB = format(parseISO(currentDOB), "dd/MM/yyyy");
    const currentAddress = addressInputRef.current.value;
    const currentGender = maleGenderRef.current.checked
      ? maleGenderRef.current.value
      : femaleGenderRef.current.value;
    const currentSalary = salaryInputRef.current.value;
    const currentPhone = phoneInputRef.current.value;

    const newEmployee = Factory.getInstance().createEmployee(
      newEmployeeID,
      currentName,
      userChoice,
      currentGender,
      formattedDOB,
      currentEmail,
      currentAddress,
      currentSalary,
      currentPhone
    );

    let baseURL = process.env.REACT_APP_FIREBASE_BASEURL;

    fetch(`${baseURL}employees/${newEmployeeID}.json`, {
      method: "PUT",
      body: newEmployee,
      headers: {
        "Content-Type": "application/JSON",
      },
    }).then((res) => {
      fetch(`${baseURL}working-time/${newEmployeeID}.json`, {
        method: "PUT",
        body: JSON.stringify({
          monday: "Shift 1",
          tuesday: "Shift 1",
          wednesday: "Shift 1",
          thursday: "Shift 1",
          friday: "Shift 1",
        }),
        headers: {
          "Content-Type": "application/JSON",
        },
      }).then((res) => {
        setIsLoading(false);
        if (res.ok) {
          alert("Successfully Added New Employee");
        }
      });
    });
  }

  const submitHandler = (e) => {
    e.preventDefault();

    const currentEmail = emailInputRef.current.value;
    const currentDOB = dobInputRef.current.value;
    const formattedDate = format(parseISO(currentDOB), "ddMMyyyy");
    const currentPassword =
      PasswordGenerator.getInstance().passwordGen(formattedDate);

    let url = "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=";

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
        if (res.ok) {
          return res.json().then((data) => {
            getEmployeeId(data.refreshToken);
          });
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
        setIsLoading(false);
        alert(err.message);
      });
  };

  return (
    <section className={classes.auth}>
      <h1>Add New Employee</h1>
      <form onSubmit={submitHandler}>
        <SelectInput
          label="Department"
          setchoice={setUserChoice}
          roleOptions={roles}
        />

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
        <NumberInput
          cname={classes.control}
          inputRef={phoneInputRef}
          label="Phone Number"
        />

        <div className={classes.actions}>
          {!isLoading && <button>Add</button>}
          {isLoading && <p> Loading.... </p>}
        </div>
      </form>
    </section>
  );
}

export default AddEmployeeForm;
