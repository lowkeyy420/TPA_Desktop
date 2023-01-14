import { useContext, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import AuthContext from "../../store/auth-context";
const columns = [
  {
    name: "Name",
    selector: (row) => row.name,
    sortable: true,
  },
  {
    name: "Issued Date",
    selector: (row) => Object.values(row.leave)[0]["issuedate"],
    sortable: true,
  },
  {
    name: "Requested Date",
    selector: (row) => Object.values(row.leave)[0]["leavedate"],
    sortable: true,
  },
  {
    name: "Reason",
    selector: (row) => Object.values(row.leave)[0]["reason"],
  },
  {
    name: "Status",
    selector: (row) => Object.values(row.leave)[0]["status"],
    sortable: true,
    conditionalCellStyles: [
      {
        when: (row) => Object.values(row.leave)[0]["status"] === "Pending",
        style: {
          backgroundColor: "rgb(255, 165, 0)",
          color: "white",
          "&:hover": {
            cursor: "pointer",
          },
        },
      },
      {
        when: (row) => Object.values(row.leave)[0]["status"] === "Accepted",
        style: {
          backgroundColor: "rgba(63, 195, 128, 0.9)",
          color: "white",
          "&:hover": {
            cursor: "not-allowed",
          },
        },
      },
      {
        when: (row) => Object.values(row.leave)[0]["status"] === "Rejected",
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
  {
    name: "Action",
    selector: (row) => {
      if (
        Object.values(row.leave)[0]["status"] === "Accepted" ||
        Object.values(row.leave)[0]["status"] === "Rejected"
      ) {
        return null;
      }

      return (
        <div style={{ display: "flex", flexDirection: "row" }}>
          <div>{row.accept}</div>
          <div style={{ marginLeft: "20px" }}>{row.reject}</div>
        </div>
      );
    },
  },
];

function AcceptRejectPersonalLeaveRequest() {
  const [isLoading, setLoading] = useState(false);
  const [loadedLeaveRequest, setloadedLeaveRequest] = useState([]);
  const [refresher, setRefresher] = useState(false);
  const authCtx = useContext(AuthContext);

  useEffect(() => {
    function acceptHandler(userid, requestid) {
      const baseURL = process.env.REACT_APP_FIREBASE_BASEURL;

      fetch(`${baseURL}leave-request/${userid}/${requestid}.json`, {
        method: "PATCH",
        body: JSON.stringify({
          status: "Accepted",
        }),
      }).then((res) => {
        if (res.ok) {
          alert("leave request accepted");
          setRefresher(!refresher);
        } else {
          alert("failed to accept");
        }
      });
    }
    function rejectHandler(userid, requestid) {
      const baseURL = process.env.REACT_APP_FIREBASE_BASEURL;

      fetch(`${baseURL}leave-request/${userid}/${requestid}.json`, {
        method: "PATCH",
        body: JSON.stringify({
          status: "Rejected",
        }),
      }).then((res) => {
        if (res.ok) {
          alert("leave request rejected");
          setRefresher(!refresher);
        } else {
          alert("failed to reject");
        }
      });
    }

    const baseURL = process.env.REACT_APP_FIREBASE_BASEURL;

    setLoading(true);
    async function fetchData() {
      //all employee
      const employeRes = await fetch(
        `${baseURL}employees.json?orderBy="status"&startAt="A"`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const employeeData = await employeRes.json();

      const employees = [];
      for (const key in employeeData) {
        const employee = {
          id: key,
          ...employeeData[key],
        };
        employees.push(employee);
      }

      //all leave change request
      const leaveRequestRes = await fetch(`${baseURL}leave-request.json`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const leaveRequestData = await leaveRequestRes.json();

      const leaveRequests = [];
      for (const key in leaveRequestData) {
        for (const tmp in leaveRequestData[key]) {
          const leaveRequest = {
            id: key,
            leave: {
              [tmp]: {
                ...leaveRequestData[key][tmp],
              },
            },
            accept: (
              <button
                style={{
                  backgroundColor: "green",
                  border: "none",
                  padding: "7px",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
                onClick={() => {
                  acceptHandler(key, tmp);
                }}
              >
                Accept
              </button>
            ),
            reject: (
              <button
                style={{
                  backgroundColor: "red",
                  border: "none",
                  padding: "7px",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
                onClick={() => {
                  rejectHandler(key, tmp);
                }}
              >
                Reject
              </button>
            ),
          };
          leaveRequests.push(leaveRequest);
        }
      }

      // console.log(leaveRequests);
      setloadedLeaveRequest(
        leaveRequests.map((item) => ({
          ...employees.find((e) => e.id === item.id),
          ...item,
        }))
      );
      setLoading(false);
    }
    fetchData();
  }, [authCtx.user, refresher]);

  return (
    <section>
      <h1>Leave Requests</h1>
      <DataTable
        columns={columns}
        data={loadedLeaveRequest}
        progressPending={isLoading}
      />
    </section>
  );
}

export default AcceptRejectPersonalLeaveRequest;
