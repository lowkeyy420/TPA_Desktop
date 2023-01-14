import { format, parseISO } from "date-fns";
import { useEffect, useRef, useState } from "react";
import SelectInput from "../../components/input/SelectInput";
import classes from "../../components/employee/AddForm.module.css";

function AddNewPromoPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [userChoice, setUserChoice] = useState("");
  const [loadedPartner, setLoadedPartner] = useState([]);

  const nameInputRef = useRef();
  const descriptionInputRef = useRef();
  const dateFromInputRef = useRef();
  const dateToInputRef = useRef();

  function submitHandler(e) {
    e.preventDefault();
    setIsLoading(true);
    const baseURL = process.env.REACT_APP_FIREBASE_BASEURL;

    const promoName = nameInputRef.current.value;
    const partnerid = userChoice;
    const promoDescription = descriptionInputRef.current.value;
    const adddate = format(new Date(), "dd/MM/yyyy").toString();

    const validfromDate = format(
      parseISO(dateFromInputRef.current.value),
      "dd/MM/yyyy"
    );
    const validtoDate = format(
      parseISO(dateToInputRef.current.value),
      "dd/MM/yyyy"
    );

    fetch(`${baseURL}promo-event.json`, {
      method: "POST",
      body: JSON.stringify({
        name: promoName,
        description: promoDescription,
        partnerid: partnerid,
        adddate: adddate,
        validfrom: validfromDate,
        validto: validtoDate,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      if (res.ok) {
        alert("Successfully added new promo");
      } else {
        alert("Error occured");
      }
      setIsLoading(false);
    });
  }

  useEffect(() => {
    const baseURL = process.env.REACT_APP_FIREBASE_BASEURL;

    fetch(`${baseURL}advertising-partner.json`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const partners = [];
        for (const key in data) {
          const partner = {
            value: key,
            label: data[key].partnername,
          };
          partners.push(partner);
        }
        setLoadedPartner(partners);
      });
  }, []);

  return (
    <section className={classes.auth}>
      <h1>Add New Promo or Event</h1>
      <form onSubmit={submitHandler}>
        <SelectInput
          label="Partner"
          setchoice={setUserChoice}
          roleOptions={loadedPartner}
        />

        <div className={classes.control}>
          <label htmlFor="name">Promo Name</label>
          <input type="text" id="name" required ref={nameInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor="description">Promo Description</label>
          <textarea id="description" required ref={descriptionInputRef} />
        </div>

        <div className={classes.control}>
          <label htmlFor="validfrom">Start From</label>
          <input type="date" id="validfrom" required ref={dateFromInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor="validto">Ends at</label>
          <input type="date" id="validto" required ref={dateToInputRef} />
        </div>

        <div className={classes.actions}>
          {!isLoading && <button>Add</button>}
          {isLoading && <p> Loading.... </p>}
        </div>
      </form>
    </section>
  );
}

export default AddNewPromoPage;
