import { useContext, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import AuthContext from "../../store/auth-context";

const columnsReq = [
  {
    name: "ID",
    selector: (row) => row.id,
  },
  {
    name: "Issued Date",
    selector: (row) => row.issuedate,
    sortable: true,
  },
  {
    name: "Resignation Letter",
    selector: (row) => {
      return (
        <a href={row.letter} target="_blank" rel="noreferrer">
          Open Letter
        </a>
      );
    },
    sortable: true,
  },
  {
    name: "Status",
    selector: (row) => row.status,
    sortable: true,
    conditionalCellStyles: [
      {
        when: (row) => row.status === "Accepted",
        style: {
          backgroundColor: "rgba(63, 195, 128, 0.9)",
          color: "white",
          "&:hover": {
            cursor: "pointer",
          },
        },
      },
      {
        when: (row) => row.status === "Rejected",
        style: {
          backgroundColor: "rgba(242, 38, 19, 0.9)",
          color: "white",
          "&:hover": {
            cursor: "not-allowed",
          },
        },
      },
      {
        when: (row) => row.status === "Pending",
        style: {
          backgroundColor: "rgba(240, 211, 28, 0.8)",
          color: "black",
          "&:hover": {
            cursor: "not-allowed",
          },
        },
      },
    ],
  },
];

export function ViewResignationLetter(props) {
  const [isLoading, setLoading] = useState(false);
  const [loadedResignationReq, setLoadedResignationReq] = useState([]);

  const authCtx = useContext(AuthContext);

  useEffect(() => {
    const baseURL = process.env.REACT_APP_FIREBASE_BASEURL;

    setLoading(true);
    fetch(`${baseURL}resignation-request/${authCtx.user}.json`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        const req = [];
        for (const key in data) {
          const workingTimeReq = {
            id: key,
            ...data[key],
          };
          req.push(workingTimeReq);
        }
        setLoadedResignationReq(req);
      });

    setLoading(false);
  }, [authCtx.user, props.refresh]);

  return (
    <section>
      <h2>My Resignation Letter</h2>
      <DataTable
        columns={columnsReq}
        data={loadedResignationReq}
        progressPending={isLoading}
      />
    </section>
  );
}

export default ViewResignationLetter;
