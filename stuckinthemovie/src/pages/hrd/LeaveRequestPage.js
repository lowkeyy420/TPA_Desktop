import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import classes from "./ViewEmployee.module.css";
import classes2 from "../../components/ui/View.module.css";

const columns = [
  {
    name: "ID",
    selector: (row) => row.id,
  },
  {
    name: "Name",
    selector: (row) => row.name,
    sortable: true,
  },
  {
    name: "Gender",
    selector: (row) => row.gender,
    sortable: true,
  },
  {
    name: "Department",
    selector: (row) => row.role,
    sortable: true,
  },
  {
    name: "Salary",
    selector: (row) => row.salary,
    sortable: true,
  },
  {
    name: "Status",
    selector: (row) => row.status,
    maxWidth: "100px",
    sortable: true,
    conditionalCellStyles: [
      {
        when: (row) => row.status === "Active",
        style: {
          backgroundColor: "rgba(63, 195, 128, 0.9)",
          color: "white",
          "&:hover": {
            cursor: "pointer",
          },
        },
      },
      {
        when: (row) => row.status === "Inactive",
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
    name: "Button",
    selector: (row) => row.action,
  },
  {
    name: "Start Working Date",
    selector: (row) => row.startWorkingDate,
    sortable: true,
  },
];
const ExpandedComponent = (value) => {
  return (
    <div>
      <p className={classes2.expandedItem}>
        <span>Email :</span> <span>{value.data.email}</span>
      </p>
      <p className={classes2.expandedItem}>
        <span>Address :</span> <span>{value.data.address}</span>
      </p>
      <p className={classes2.expandedItem}>
        <span>Phone Number :</span> <span>{value.data.phone}</span>
      </p>
    </div>
  );
};

function LeaveRequestPage() {
  const [isLoading, setLoading] = useState(true);
  const [loadedEmployees, setLoadedEmployees] = useState([]);
  const [loadedResignationLetter, setLoadedResignationLetter] = useState([]);

  const baseURL = process.env.REACT_APP_FIREBASE_BASEURL;

  useEffect(() => {
    setLoading(true);
    fetch(`${baseURL}employees.json?orderBy="status"&startAt="A"`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        const employees = [];

        for (const key in data) {
          const employee = {
            id: key,
            ...data[key],
            action: <button onClick={test}>TEST</button>,
          };
          employees.push(employee);
        }
        setLoading(false);
        setLoadedEmployees(employees);
      });
  }, []);

  async function test() {
    loadedEmployees.forEach((e) => {
      console.log(e.id);
      fetch(`${baseURL}resignation-letter/${e.id}.json?`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          const employees = [];

          for (const key in data) {
            const employee = {
              id: key,
              ...data[key],
            };
            employees.push(employee);
          }
          setLoading(false);
          setLoadedEmployees(employees);
        });
    });
  }

  return (
    <div className={classes.datatable}>
      <DataTable
        columns={columns}
        data={loadedEmployees}
        progressPending={isLoading}
        highlightOnHover
        pagination
        responsive
        expandableRows
        expandableRowsComponent={ExpandedComponent}
      />
    </div>
  );
}

export default LeaveRequestPage;
