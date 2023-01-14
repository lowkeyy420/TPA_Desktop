import { useContext, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import AuthContext from "../../store/auth-context";

function AcceptRejectTemplate(props) {
  const columns = props.columns;
  const [isLoading, setLoading] = useState(false);
  const [loadedRequest, setloadedRequest] = useState([]);
  const [refresher, setRefresher] = useState(false);
  const authCtx = useContext(AuthContext);

  const category = props.category;

  useEffect(() => {
    const baseURL = process.env.REACT_APP_FIREBASE_BASEURL;

    function actionHandler(userid, data) {
      if (props.updater === true) {
        if (props.category === "salary-adjustment") {
          const newsalary = data.newsalary;
          fetch(`${baseURL}employees/${userid}.json`, {
            method: "PATCH",
            body: JSON.stringify({
              salary: newsalary,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          }).then((res) => {
            if (res.ok) {
            } else {
              alert("Failed to update employee salary");
            }
          });
        }
        if (props.category === "resignation-request") {
          fetch(`${baseURL}employees/${userid}.json`, {
            method: "PATCH",
            body: JSON.stringify({
              status: "Inactive",
            }),
            headers: {
              "Content-Type": "application/json",
            },
          }).then((res) => {
            if (res.ok) {
            } else {
              alert("Failed to update employee status");
            }
          });
        }
      } else {
        return;
      }
    }

    function acceptHandler(userid, requestid, data) {
      fetch(`${baseURL}${category}/${userid}/${requestid}.json`, {
        method: "PATCH",
        body: JSON.stringify({
          status: "Accepted",
        }),
      }).then((res) => {
        if (res.ok) {
          alert("Accepted");
          actionHandler(userid, data);

          setRefresher(!refresher);
        } else {
          alert("failed to accept");
        }
      });
    }
    function rejectHandler(userid, requestid) {
      const baseURL = process.env.REACT_APP_FIREBASE_BASEURL;

      fetch(`${baseURL}${category}/${userid}/${requestid}.json`, {
        method: "PATCH",
        body: JSON.stringify({
          status: "Rejected",
        }),
      }).then((res) => {
        if (res.ok) {
          alert("Rejected");
          setRefresher(!refresher);
        } else {
          alert("failed to reject");
        }
      });
    }

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

      //all request change request
      const requestRes = await fetch(`${baseURL}${category}.json`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const requestData = await requestRes.json();

      const requests = [];
      for (const key in requestData) {
        for (const tmp in requestData[key]) {
          const request = {
            id: key,
            request: {
              [tmp]: {
                ...requestData[key][tmp],
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
                  acceptHandler(key, tmp, requestData[key][tmp]);
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
          requests.push(request);
        }
      }

      // console.log(requests);
      setloadedRequest(
        requests.map((item) => ({
          ...employees.find((e) => e.id === item.id),
          ...item,
        }))
      );
      setLoading(false);
    }
    fetchData();
  }, [authCtx.user, refresher, category]);

  return (
    <div>
      <DataTable
        columns={columns}
        data={loadedRequest}
        keyField=""
        progressPending={isLoading}
        expandableRows={true}
        expandableRowsComponent={props.expanded}
      />
    </div>
  );
}

export default AcceptRejectTemplate;
