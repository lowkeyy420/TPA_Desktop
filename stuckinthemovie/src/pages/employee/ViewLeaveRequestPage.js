import { useContext, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";
import AuthContext from "../../store/auth-context";
import classes from "./ActionButton.module.css";

const columns = [
  {
    name: "Requested Date",
    selector: (row) => row.leavedate,
    sortable: true,
  },
  {
    name: "Reason",
    selector: (row) => row.reason,
  },
  {
    name: "Status",
    selector: (row) => row.status,
    sortable: true,
    conditionalCellStyles: [
      {
        when: (row) => row.status === "Pending",
        style: {
          backgroundColor: "rgb(255, 165, 0)",
          color: "white",
          "&:hover": {
            cursor: "pointer",
          },
        },
      },
      {
        when: (row) => row.status === "Accepted",
        style: {
          backgroundColor: "rgba(63, 195, 128, 0.9)",
          color: "white",
          "&:hover": {
            cursor: "not-allowed",
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
    ],
  },
];

function ViewLeaveRequest() {
  const [isLoading, setLoading] = useState(false);
  const [loadedLeaveRequest, setloadedLeaveRequest] = useState([]);
  const authCtx = useContext(AuthContext);

  useEffect(() => {
    setLoading(true);
    const baseURL = process.env.REACT_APP_FIREBASE_BASEURL;
    fetch(`${baseURL}/leave-request/${authCtx.user}.json`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        const leaveRequests = [];

        for (const key in data) {
          const leaveReq = {
            id: key,
            ...data[key],
          };
          leaveRequests.push(leaveReq);
        }
        setLoading(false);
        setloadedLeaveRequest(leaveRequests);
      });
  }, [authCtx.user]);

  return (
    <div>
      <h1>Leave Requests</h1>
      <DataTable
        columns={columns}
        data={loadedLeaveRequest}
        progressPending={isLoading}
      />
      <div className={classes.centeredContainer}>
        <p>Need to Take a Break ?</p>
        <Link to="/employee/create-leave-request" className={classes.actions}>
          <button className={classes.btn}>Create a Leave Request</button>
        </Link>
      </div>
    </div>
  );
}

export default ViewLeaveRequest;
