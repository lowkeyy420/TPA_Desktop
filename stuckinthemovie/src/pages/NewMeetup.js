import { useHistory } from "react-router-dom";
import NewMeetupForm from "../components/meetups/NewMeetupForm";

function NewMeetupPage() {
  const history = useHistory();
  const baseURL = process.env.REACT_APP_FIREBASE_BASEURL;

  function addMetupHandler(newMeetup) {
    // console.log(newMeetup);

    fetch(`${baseURL}/meetups.json`, {
      method: "POST",
      body: JSON.stringify(newMeetup),
      headers: {
        "Content-Type": "application/JSON",
      },
    }).then(() => {
      history.replace("/");
    });
  }

  return (
    <div>
      <h1>New Meetup Page</h1>
      <NewMeetupForm onAddMeetup={addMetupHandler} />
    </div>
  );
}

export default NewMeetupPage;
