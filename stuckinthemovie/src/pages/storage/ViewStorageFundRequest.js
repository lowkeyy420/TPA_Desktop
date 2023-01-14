import { useContext, useEffect, useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import AuthContext from "../../store/auth-context";
import styled from "styled-components";
import classes from "../hrd/ViewEmployee.module.css";

const columns = [
  {
    name: "Name",
    selector: (row) => row.name,
    sortable: true,
  },
  {
    name: "Issued Date",
    selector: (row) => Object.values(row.request)[0]["issuedate"],
    sortable: true,
  },
  {
    name: "Department",
    selector: (row) => row.role,
    sortable: true,
  },
  {
    name: "Requested Amount",
    selector: (row) => Object.values(row.request)[0]["amount"],
    sortable: true,
  },
  {
    name: "Requested Amount",
    selector: (row) => Object.values(row.request)[0]["amount"],
    sortable: true,
  },
  {
    name: "Status",
    selector: (row) => Object.values(row.request)[0]["status"],
    sortable: true,
    conditionalCellStyles: [
      {
        when: (row) => Object.values(row.request)[0]["status"] === "Pending",
        style: {
          backgroundColor: "rgb(255, 165, 0)",
          color: "white",
          "&:hover": {
            cursor: "pointer",
          },
        },
      },
      {
        when: (row) => Object.values(row.request)[0]["status"] === "Accepted",
        style: {
          backgroundColor: "rgba(63, 195, 128, 0.9)",
          color: "white",
          "&:hover": {
            cursor: "not-allowed",
          },
        },
      },
      {
        when: (row) => Object.values(row.request)[0]["status"] === "Rejected",
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

const ExpandedComponent = (value) => {
  return (
    <div>
      <p className={classes.expandedItem}>
        <h2 style={{ paddingLeft: "20px" }}>
          Reason : {Object.values(value.data.request)[0]["reason"]}
        </h2>
      </p>
    </div>
  );
};

function ViewStorageFundRequest() {
  const [isLoading, setLoading] = useState(false);
  const [loadedRequest, setloadedRequest] = useState([]);
  const authCtx = useContext(AuthContext);
  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

  useEffect(() => {
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

      //all request change request
      const requestRes = await fetch(`${baseURL}fund-request.json`, {
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
          };
          requests.push(request);
        }
      }

      // console.log(requests);
      const a = requests.map((item) => ({
        ...employees.find((e) => e.id === item.id),
        ...item,
      }));

      setloadedRequest(a.filter((a) => a.role === "Storage"));
      setLoading(false);
    }
    fetchData();
  }, [authCtx.user]);

  const filteredEmployees = loadedRequest.filter(
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
    <div>
      <DataTable
        columns={columns}
        data={filteredEmployees}
        keyField=""
        progressPending={isLoading}
        responsive
        subHeader
        subHeaderComponent={subHeaderComponentMemo}
        subHeaderAlign="left"
        expandableRows
        expandOnRowClicked
        expandableRowsComponent={ExpandedComponent}
      />
    </div>
  );
}

export default ViewStorageFundRequest;
