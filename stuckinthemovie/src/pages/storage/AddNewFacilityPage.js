import { format } from "date-fns";
import { useRef, useState } from "react";
import SelectInput from "../../components/input/SelectInput";
import { roleOptions } from "../../model/Employee";
import classes from "../../components/employee/AddForm.module.css";

function AddNewFacilityPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [userChoice, setUserChoice] = useState("");
  const nameInputRef = useRef();

  const roles = roleOptions;

  function submitHandler(e) {
    e.preventDefault();
    setIsLoading(true);
    const baseURL = process.env.REACT_APP_FIREBASE_BASEURL;
    const newFacilityName = nameInputRef.current.value;
    const department = userChoice;
    const status = "Working";
    const adddate = format(new Date(), "dd/MM/yyyy").toString();

    fetch(`${baseURL}facility.json`, {
      method: "POST",
      body: JSON.stringify({
        name: newFacilityName,
        adddate: adddate,
        department: department,
        status: status,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      if (res.ok) {
        alert("Successfully added new facility");
      } else {
        alert("Error occured");
      }
      setIsLoading(false);
    });
  }

  return (
    <section className={classes.auth}>
      <h1>Add New Facility</h1>
      <form onSubmit={submitHandler}>
        <SelectInput setchoice={setUserChoice} roleOptions={roles} />

        <div className={classes.control}>
          <label htmlFor="name">Name</label>
          <input type="text" id="name" required ref={nameInputRef} />
        </div>

        <div className={classes.actions}>
          {!isLoading && <button>Add</button>}
          {isLoading && <p> Loading.... </p>}
        </div>
      </form>
    </section>
  );
}

export default AddNewFacilityPage;
