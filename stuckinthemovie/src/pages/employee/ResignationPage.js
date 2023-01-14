import { useState } from "react";
import UploadResignationForm from "../../components/employee/UploadResignationForm";
import ViewResignationLetter from "./ViewResignationLetter";

function ResignationPage() {
  const [refresher, setRefresher] = useState("");

  function refreshHandler(str) {
    if (refresher.length < 2) setRefresher((prev) => [...(prev + str)]);
    else setRefresher("");
  }
  return (
    <section>
      <ViewResignationLetter refresh={refresher} />
      <UploadResignationForm refresher={refreshHandler} />
    </section>
  );
}

export default ResignationPage;
