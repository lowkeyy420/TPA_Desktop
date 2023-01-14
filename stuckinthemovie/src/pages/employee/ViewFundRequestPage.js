import { useContext, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import AuthContext from "../../store/auth-context";
import classes from "../../components/ui/View.module.css";

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
    name: "Requested Amount",
    selector: (row) => row.amount,
    sortable: true,
  },
  {
    name: "Reason",
    selector: (row) => row.reason,
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

const ExpandedComponent = (value) => {
  return (
    <div>
      <p className={classes.expandedItem}>
        <span>Reason :</span> <span>{value.data.reason}</span>
      </p>
    </div>
  );
};

export function ViewFundRequestPage() {
  const [isLoading, setLoading] = useState(false);
  const [loadedFundReq, setLoadedFundReq] = useState([]);

  const authCtx = useContext(AuthContext);

  useEffect(() => {
    const baseURL = process.env.REACT_APP_FIREBASE_BASEURL;

    setLoading(true);
    fetch(`${baseURL}fund-request/${authCtx.user}.json`, {
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
        setLoadedFundReq(req);
      });

    setLoading(false);
  }, [authCtx.user]);

  return (
    <section>
      <h2>My Fund Requests</h2>
      <DataTable
        columns={columnsReq}
        data={loadedFundReq}
        progressPending={isLoading}
        expandableRows
        expandOnRowClicked
        expandableRowsComponent={ExpandedComponent}
      />
    </section>
  );
}

export default ViewFundRequestPage;
