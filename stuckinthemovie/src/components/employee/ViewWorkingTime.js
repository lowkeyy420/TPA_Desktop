import { format } from "date-fns";
import { useContext, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import AuthContext from "../../store/auth-context";

const columns = [
  {
    name: "Day",
    selector: (row) => row.id,
  },
  {
    name: "Shift",
    selector: (row) => row.shift,
    sortable: true,
  },
  {
    name: "Time",
    selector: (row) => {
      if (row.shift === "Shift 1") {
        return "07.00";
      } else if (row.shift === "Shift 2") {
        return "09.00";
      } else if (row.shift === "Shift 3") {
        return "11.00";
      }
    },
    sortable: true,
  },

  {
    name: "New Shift",
    cell: (row) => {
      return (
        <select defaultValue={row.shift} id={row.id}>
          <option value={row.shift} disabled hidden>
            new time
          </option>

          <option value="Shift 1">Shift 1 (07.00)</option>
          <option value="Shift 2">Shift 2 (09.00)</option>
          <option value="Shift 3">Shift 3 (11.00)</option>
        </select>
      );
    },
  },
  {
    name: "Request Change",
    selector: (row) => row.action,
  },
];

export function ViewWorkingTime() {
  const [isLoading, setLoading] = useState(false);
  const [loadedWorkTime, setLoadedWorkTime] = useState([]);

  const authCtx = useContext(AuthContext);

  useEffect(() => {
    function requestHandler(day, shift) {
      const newShift = document.getElementById(day).value;
      const baseURL = process.env.REACT_APP_FIREBASE_BASEURL;

      const issuedDate = format(new Date(), "dd/MM/yyyy").toString();

      fetch(`${baseURL}working-time-request/${authCtx.user}.json`, {
        method: "POST",
        body: JSON.stringify({
          issuedate: issuedDate,
          newworkingtime: {
            day: day,
            oldshift: shift,
            newshift: newShift,
          },
          status: "Pending",
        }),
        headers: {
          "Content-Type": "application/JSON",
        },
      }).then((res) => {
        if (res.ok) {
          alert(
            `Sucessfully Requested Time Change For : ${day} ${shift} to ${newShift}`
          );
          setLoadedWorkTime((prev) =>
            prev.map((obj) => {
              if (obj.id === day) {
                return { ...obj, action: <button disabled>Change</button> };
              }

              return obj;
            })
          );
        } else {
          alert("Error occured");
        }
      });
    }

    setLoading(true);
    const baseURL = process.env.REACT_APP_FIREBASE_BASEURL;
    fetch(`${baseURL}working-time/${authCtx.user}.json`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        const schedule = [];

        for (const key in data) {
          const workingTime = {
            id: key,
            shift: data[key],
            action: (
              <button onClick={() => requestHandler(key, data[key])}>
                Change
              </button>
            ),
          };
          schedule.push(workingTime);
        }
        setLoading(false);
        setLoadedWorkTime(schedule);
      });
  }, [authCtx.user]);

  return (
    <section>
      <h1>Request To Change Working Time</h1>
      <DataTable
        columns={columns}
        data={loadedWorkTime}
        progressPending={isLoading}
      />
    </section>
  );
}

const columnsReq = [
  {
    name: "Day",
    selector: (row) => row.newworkingtime.day,
  },
  {
    name: "Old Shift",
    selector: (row) => {
      let time = "";
      if (row.newworkingtime.oldshift === "Shift 1") {
        time = "[07.00]";
      } else if (row.newworkingtime.oldshift === "Shift 2") {
        time = "[09.00]";
      } else if (row.newworkingtime.oldshift === "Shift 3") {
        time = "[11.00]";
      }

      const res = row.newworkingtime.oldshift + " " + time;
      return res;
    },
    sortable: true,
  },
  {
    name: "New Shift",
    selector: (row) => {
      let time = "";
      if (row.newworkingtime.newshift === "Shift 1") {
        time = "[07.00]";
      } else if (row.newworkingtime.newshift === "Shift 2") {
        time = "[09.00]";
      } else if (row.newworkingtime.newshift === "Shift 3") {
        time = "[11.00]";
      }

      const res = row.newworkingtime.newshift + " " + time;
      return res;
    },
    sortable: true,
  },
  {
    name: "Issued Change Date",
    selector: (row) => row.issuedate,
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

export function ViewWorkingTimeOnly() {
  const [isLoading, setLoading] = useState(false);
  const [loadedWorkTime, setLoadedWorkTime] = useState([]);
  const [loadedWorkTimeReq, setLoadedWorkTimeReq] = useState([]);

  const authCtx = useContext(AuthContext);

  useEffect(() => {
    const baseURL = process.env.REACT_APP_FIREBASE_BASEURL;
    fetch(`${baseURL}working-time/${authCtx.user}.json`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        const schedule = [];

        for (const key in data) {
          const workingTime = {
            name: key,
            shift: data[key],
          };
          schedule.push(workingTime);
        }
        setLoadedWorkTime(schedule);
      });

    setLoading(true);
    fetch(`${baseURL}working-time-request/${authCtx.user}.json`, {
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
        setLoadedWorkTimeReq(req);
      });

    setLoading(false);
  }, [authCtx.user]);

  return (
    <section>
      <h2>My Current Working Time</h2>
      <div>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart
            data={loadedWorkTime}
            margin={{ top: 15, right: 0, bottom: 15, left: 0 }}
          >
            <CartesianGrid stroke="#ccc" strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis
              dataKey="shift"
              type="category"
              orientation="right"
              // reversed
              scale="point"
            />
            <Tooltip />
            <Legend />
            <Bar
              type="monotone"
              dataKey="shift"
              fill="#3F9430"
              reverseStackOrder={true}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div style={{ marginTop: "20px" }}>
        <h2>My Change Requests</h2>
        <DataTable
          columns={columnsReq}
          data={loadedWorkTimeReq}
          progressPending={isLoading}
        />
      </div>
    </section>
  );
}
