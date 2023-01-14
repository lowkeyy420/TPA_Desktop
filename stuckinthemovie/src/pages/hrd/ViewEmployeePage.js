import { useEffect, useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import styled from "styled-components";
import classes from "./ViewEmployee.module.css";
import classes2 from "../../components/ui/View.module.css";

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

function ViewEmployeePage() {
  const [isLoading, setLoading] = useState(true);
  const [loadedEmployees, setLoadedEmployees] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

  useEffect(() => {
    setLoading(true);
    const baseURL = process.env.REACT_APP_FIREBASE_BASEURL;
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
          };
          employees.push(employee);
        }
        setLoading(false);
        setLoadedEmployees(employees);
      });
  }, []);

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
    <div className={classes.datatable}>
      <DataTable
        columns={columns}
        data={filteredEmployees}
        keyField={loadedEmployees.id}
        progressPending={isLoading}
        direction="ltr"
        fixedHeaderScrollHeight="150px"
        highlightOnHover
        noHeader
        pagination
        paginationResetDefaultPage={resetPaginationToggle}
        responsive
        subHeader
        subHeaderComponent={subHeaderComponentMemo}
        selectableRowsRadio="radio"
        subHeaderAlign="left"
        expandableRows
        expandableRowsComponent={ExpandedComponent}
        expandOnRowClicked
        persistTableHead
      />
    </div>
  );
}

export default ViewEmployeePage;
