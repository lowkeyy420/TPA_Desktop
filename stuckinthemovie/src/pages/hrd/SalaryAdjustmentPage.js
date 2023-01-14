import { useEffect, useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import classes from "./ViewEmployee.module.css";
import styled from "styled-components";
import { format } from "date-fns";

const TextField = styled.input`
  height: 32px;
  width: 200px;
  border-radius: 3px;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border: 1px solid #e5e5e5;
  padding: 0 32px 0 16px;

  &:hover {
    cursor: pointer;
  }
`;

const ClearButton = styled.button`
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  height: 34px;
  width: 32px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FilterComponent = ({ filterText, onFilter, onClear }) => (
  <>
    <TextField
      id="search"
      type="text"
      placeholder="Search Employee"
      aria-label="Search Input"
      value={filterText}
      onChange={onFilter}
    />
    <ClearButton type="button" onClick={onClear} className={classes.clearButon}>
      X
    </ClearButton>
  </>
);

const columns = [
  {
    name: "Name",
    selector: (row) => row.name,
    sortable: true,
  },

  {
    name: "Issued Date",
    selector: (row) => {
      return Object.values(row.salaryreq)[0]["issuedate"];
    },
    sortable: true,
  },
  {
    name: "Old Salary",
    selector: (row) => {
      return Object.values(row.salaryreq)[0]["oldsalary"];
    },
    sortable: true,
  },
  {
    name: "New Salary",
    selector: (row) => {
      return Object.values(row.salaryreq)[0]["newsalary"];
    },
    sortable: true,
  },
  {
    name: "Status",
    selector: (row) => Object.values(row.salaryreq)[0]["status"],
    sortable: true,
    conditionalCellStyles: [
      {
        when: (row) => Object.values(row.salaryreq)[0]["status"] === "Accepted",
        style: {
          backgroundColor: "rgba(63, 195, 128, 0.9)",
          color: "white",
          "&:hover": {
            cursor: "pointer",
          },
        },
      },
      {
        when: (row) => Object.values(row.salaryreq)[0]["status"] === "Rejected",
        style: {
          backgroundColor: "rgba(242, 38, 19, 0.9)",
          color: "white",
          "&:hover": {
            cursor: "not-allowed",
          },
        },
      },
      {
        when: (row) => Object.values(row.salaryreq)[0]["status"] === "Pending",
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

const columnsEmp = [
  {
    name: "Name",
    selector: (row) => row.name,
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
        backgroundColor: "rgba(242, 38, 19, 0.9)",
        style: {
          color: "white",
          "&:hover": {
            cursor: "not-allowed",
          },
        },
      },
    ],
  },
  {
    name: "Salary",
    selector: (row) => row.salary,
    sortable: true,
  },
  {
    name: "New Salary",
    selector: (row) => row.newsalary,
  },
  {
    name: "Action",
    selector: (row) => row.action,
  },
];

function SalaryAdjustmentPage() {
  const [isLoading, setLoading] = useState(true);
  const [loadedWarningSalary, setLoadedWarningSalary] = useState([]);
  const [loadedEmployees, setLoadedEmployees] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

  const baseURL = process.env.REACT_APP_FIREBASE_BASEURL;

  const [refresher, setRefresher] = useState(false);

  useEffect(() => {
    function requestHandler(userid, data) {
      const newSalary = document.getElementById(userid).value;

      if (newSalary > 0) {
        const issuedDate = format(new Date(), "dd/MM/yyyy").toString();
        const oldSalary = data.salary;
        fetch(`${baseURL}salary-adjustment/${userid}.json`, {
          method: "POST",
          body: JSON.stringify({
            issuedate: issuedDate,
            oldsalary: oldSalary,
            newsalary: newSalary,
            status: "Pending",
          }),
          headers: {
            "Content-Type": "application/JSON",
          },
        }).then((res) => {
          if (res.ok) {
            alert("Successfully made request");
            setRefresher(!refresher);
          } else {
            alert("Error creating request");
          }
        });
      } else {
        alert("New salary must be > 0");
      }
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
          newsalary: <input type="number" id={key} />,
          action: (
            <button onClick={() => requestHandler(key, employeeData[key])}>
              Make Request
            </button>
          ),
          ...employeeData[key],
        };
        employees.push(employee);
      }

      setLoadedEmployees(employees);

      const salaryRes = await fetch(`${baseURL}salary-adjustment.json`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const salaryData = await salaryRes.json();

      const salarys = [];
      for (const key in salaryData) {
        for (const tmp in salaryData[key]) {
          const salary = {
            id: key,
            salaryreq: {
              [tmp]: {
                ...salaryData[key][tmp],
              },
            },
          };
          salarys.push(salary);
        }
      }

      setLoadedWarningSalary(
        salarys.map((item) => ({
          ...item,
          ...employees.find((e) => e.id === item.id),
        }))
      );
      setLoading(false);
    }

    fetchData();
  }, [baseURL, refresher]);

  const filteredEmployees = loadedEmployees.filter(
    (employee) =>
      employee.name &&
      employee.name.toLowerCase().includes(filterText.toLowerCase())
  );

  const subHeaderComponentMemo = useMemo(() => {
    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle);
        setFilterText("");
      }
    };

    return (
      <FilterComponent
        onFilter={(e) => setFilterText(e.target.value)}
        onClear={handleClear}
        filterText={filterText}
      />
    );
  }, [filterText, resetPaginationToggle]);

  return (
    <div className={classes.datatable} style={{ height: "150vh" }}>
      <div>
        <h2>Employees</h2>

        <DataTable
          columns={columnsEmp}
          data={filteredEmployees}
          pagination
          progressPending={isLoading}
          highlightOnHover
          responsive
          paginationResetDefaultPage={resetPaginationToggle}
          subHeader
          subHeaderAlign="right"
          subHeaderComponent={subHeaderComponentMemo}
          selectableRowsHighlight
        />
      </div>
      <div>
        <h2>All salary Adjustments</h2>
        <DataTable
          columns={columns}
          data={loadedWarningSalary}
          keyField={""}
          pagination
          paginationResetDefaultPage={resetPaginationToggle}
          responsive
        />
      </div>
    </div>
  );
}

export default SalaryAdjustmentPage;
