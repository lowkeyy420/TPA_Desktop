import { useContext, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import AuthContext from "../../store/auth-context";

const columnsReq = [
  {
    name: "Employee",
    selector: (row) => row.name,
  },
  {
    name: "Day",
    selector: (row) => Object.values(row.time)[0]["newworkingtime"]["day"],
  },
  {
    name: "Old Shift",
    selector: (row) => {
      let time = "";
      if (
        Object.values(row.time)[0]["newworkingtime"]["oldshift"] === "Shift 1"
      ) {
        time = "[07.00]";
      } else if (
        Object.values(row.time)[0]["newworkingtime"]["oldshift"] === "Shift 2"
      ) {
        time = "[09.00]";
      } else if (
        Object.values(row.time)[0]["newworkingtime"]["oldshift"] === "Shift 3"
      ) {
        time = "[11.00]";
      }

      const res =
        Object.values(row.time)[0]["newworkingtime"]["oldshift"] + " " + time;
      return res;
    },
    sortable: true,
  },
  {
    name: "New Shift",
    selector: (row) => {
      let time = "";
      if (
        Object.values(row.time)[0]["newworkingtime"]["newshift"] === "Shift 1"
      ) {
        time = "[07.00]";
      } else if (
        Object.values(row.time)[0]["newworkingtime"]["newshift"] === "Shift 2"
      ) {
        time = "[09.00]";
      } else if (
        Object.values(row.time)[0]["newworkingtime"]["newshift"] === "Shift 3"
      ) {
        time = "[11.00]";
      }

      const res =
        Object.values(row.time)[0]["newworkingtime"]["newshift"] + " " + time;
      return res;
    },
    sortable: true,
  },
  {
    name: "Issued Change Date",
    selector: (row) => Object.values(row.time)[0]["issuedate"],
    sortable: true,
  },
  {
    name: "Status",
    selector: (row) => Object.values(row.time)[0]["status"],
    sortable: true,
    conditionalCellStyles: [
      {
        when: (row) => Object.values(row.time)[0]["status"] === "Accepted",
        style: {
          backgroundColor: "rgba(63, 195, 128, 0.9)",
          color: "white",
          "&:hover": {
            cursor: "pointer",
          },
        },
      },
      {
        when: (row) => Object.values(row.time)[0]["status"] === "Rejected",
        style: {
          backgroundColor: "rgba(242, 38, 19, 0.9)",
          color: "white",
          "&:hover": {
            cursor: "not-allowed",
          },
        },
      },
      {
        when: (row) => Object.values(row.time)[0]["status"] === "Pending",
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
  {
    name: "Action",
    selector: (row) => {
      if (
        Object.values(row.time)[0]["status"] === "Accepted" ||
        Object.values(row.time)[0]["status"] === "Rejected"
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

function UpdateWorkingTime() {
  const [isLoading, setLoading] = useState(false);
  const [loadedWorkTimeReq, setLoadedWorkTimeReq] = useState([]);
  const [refresher, setRefresher] = useState(false);

  const authCtx = useContext(AuthContext);

  useEffect(() => {
    function acceptHandler(userid, requestid, data) {
      const baseURL = process.env.REACT_APP_FIREBASE_BASEURL;

      if (data.status === "Accepted") {
        return;
      }

      const day = data.newworkingtime.day;
      const newshift = data.newworkingtime.newshift;

      fetch(`${baseURL}working-time/${userid}.json`, {
        method: "PATCH",
        body: JSON.stringify({
          [day]: newshift,
        }),
      }).then((res) => {
        if (res.ok) {
          fetch(`${baseURL}working-time-request/${userid}/${requestid}.json`, {
            method: "PATCH",
            body: JSON.stringify({
              status: "Accepted",
            }),
          }).then((res) => {
            if (res.ok) {
              alert(
                `updated old shift for ${day} from ${data.newworkingtime.oldshift} to ${data.newworkingtime.newshift}`
              );
              setRefresher(!refresher);
            } else {
              alert("failed to accept");
            }
          });
        } else {
          alert("error occured");
        }
      });
    }
    function rejectHandler(userid, requestid, data) {
      const baseURL = process.env.REACT_APP_FIREBASE_BASEURL;

      if (data.status === "Rejected") {
        return;
      }

      fetch(`${baseURL}working-time-request/${userid}/${requestid}.json`, {
        method: "PATCH",
        body: JSON.stringify({
          status: "Rejected",
        }),
      }).then((res) => {
        if (res.ok) {
          alert(
            `request to change old shift for ${data.newworkingtime.day} from ${data.newworkingtime.oldshift} to ${data.newworkingtime.newshift} rejected`
          );
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

      //all time change request
      const timeRequestRes = await fetch(
        `${baseURL}working-time-request.json`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const timeRequestData = await timeRequestRes.json();

      const timeRequests = [];
      for (const key in timeRequestData) {
        for (const tmp in timeRequestData[key]) {
          const timeRequest = {
            id: key,
            time: {
              [tmp]: {
                ...timeRequestData[key][tmp],
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
                onClick={() =>
                  acceptHandler(key, tmp, timeRequestData[key][tmp])
                }
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
                onClick={() =>
                  rejectHandler(key, tmp, timeRequestData[key][tmp])
                }
              >
                Reject
              </button>
            ),
          };
          timeRequests.push(timeRequest);
        }
      }

      setLoadedWorkTimeReq(
        timeRequests.map((item) => ({
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
      <div style={{ marginTop: "20px" }}>
        <h2>Change Working Time</h2>
        <DataTable
          columns={columnsReq}
          data={loadedWorkTimeReq}
          keyField=""
          progressPending={isLoading}
        />
      </div>
    </section>
  );
}

export default UpdateWorkingTime;
