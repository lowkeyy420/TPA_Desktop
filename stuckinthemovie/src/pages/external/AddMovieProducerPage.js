import { format } from "date-fns";
import { useRef, useState } from "react";
import NumberInput from "../../components/input/NumberInput";
import classes from "../../components/employee/AddForm.module.css";

function AddMovieProducerPage() {
  const nameInputRef = useRef();
  const emailInputRef = useRef();
  const addressInputRef = useRef();
  const phoneInputRef = useRef();

  const [isLoading, setIsLoading] = useState(false);

  function submitHandler(e) {
    e.preventDefault();
    setIsLoading(true);
    const baseURL = process.env.REACT_APP_FIREBASE_BASEURL;

    const name = nameInputRef.current.value;
    const email = emailInputRef.current.value;
    const address = addressInputRef.current.value;
    const phone = phoneInputRef.current.value;
    const joindate = format(new Date(), "dd/MM/yyyy").toString();

    fetch(`${baseURL}movie-producer.json`, {
      method: "POST",
      body: JSON.stringify({
        name: name,
        email: email,
        address: address,
        phone: phone,
        joindate: joindate,
      }),
      headers: {
        "Content-Type": "application/JSON",
      },
    }).then((res) => {
      if (res.ok) {
        alert("Sucessfully added movie producer");
      } else {
        alert("Error occured");
      }
      setIsLoading(false);
    });
  }

  return (
    <section className={classes.auth}>
      <h1>Add New Movie Producer</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="name">Name</label>
          <input type="text" id="name" required ref={nameInputRef} />
        </div>

        <div className={classes.control}>
          <label htmlFor="email">Email</label>
          <input type="email" id="email" required ref={emailInputRef} />
        </div>

        <div className={classes.control}>
          <label htmlFor="address">Address</label>
          <input type="address" id="address" required ref={addressInputRef} />
        </div>

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

export default AddMovieProducerPage;
