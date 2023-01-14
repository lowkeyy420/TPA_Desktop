import { useContext, useEffect, useMemo, useRef, useState } from "react";
import DataTable from "react-data-table-component";
import classes from "./ViewEmployee.module.css";
import classes2 from "./../../components/employee/AddForm.module.css";
import styled from "styled-components";
import { format } from "date-fns";
import AuthContext from "../../store/auth-context";

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
    selector: (row) => {
      return Object.keys(row.letter)[0];
    },
  },
  {
    name: "Name",
    selector: (row) => row.name,
    sortable: true,
  },
  {
    name: "Department",
    selector: (row) => row.role,
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
    name: "Issued Date",
    selector: (row) => {
      return Object.values(row.letter)[0]["issuedate"];
    },
    sortable: true,
  },
  {
    name: "View Letter",
    selector: (row) => {
      const link = Object.values(row.letter)[0]["letter"];
      return (
        <a href={link} target="_blank" rel="noreferrer">
          Open Termination Letter
        </a>
      );
    },
    sortable: true,
  },
  {
    name: "Letter Status",
    selector: (row) => {
      return Object.values(row.letter)[0]["status"];
    },

    sortable: true,
    conditionalCellStyles: [
      {
        when: (row) => Object.values(row.letter)[0]["status"] === "Accepted",
        style: {
          backgroundColor: "rgba(63, 195, 128, 0.9)",
          color: "white",
          "&:hover": {
            cursor: "pointer",
          },
        },
      },
      {
        when: (row) => Object.values(row.letter)[0]["status"] === "Rejected",
        style: {
          backgroundColor: "rgba(242, 38, 19, 0.9)",
          color: "white",
          "&:hover": {
            cursor: "not-allowed",
          },
        },
      },
      {
        when: (row) => Object.values(row.letter)[0]["status"] === "Pending",
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

function IssueTerminationLetterPage() {
  const [isLoading, setLoading] = useState(true);
  const [loadedEmployees, setLoadedEmployees] = useState([]);
  const [loadedTerminationLetter, setLoadedTerminationLetter] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

  const [selectedRows, setSelectedRows] = useState([]);
  const [toggleCleared, setToggleCleared] = useState(false);

  const baseURL = process.env.REACT_APP_FIREBASE_BASEURL;
  const authCtx = useContext(AuthContext);

  const [file, setFile] = useState();
  const [fileIsSelected, setFileIsSelected] = useState(false);
  const fileName = useRef();

  const [refresher, setRefresher] = useState(false);
  const storageURL = process.env.REACT_APP_FIREBASE_STORAGEURL;

  useEffect(() => {
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
      setLoadedEmployees(employees);

      //all termination letter
      const letterRes = await fetch(`${baseURL}termination-letter.json`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const letterData = await letterRes.json();

      const letters = [];
      for (const key in letterData) {
        for (const tmp in letterData[key]) {
          const letter = {
            id: key,
            letter: {
              [tmp]: {
                ...letterData[key][tmp],
              },
            },
          };
          letters.push(letter);
        }
      }

      setLoadedTerminationLetter(
        letters.map((item) => ({
          ...item,
          ...employees.find((e) => e.id === item.id),
        }))
      );
      setLoading(false);
    }

    fetchData();
  }, [baseURL, refresher]);

  const filteredTerminationLetter = loadedTerminationLetter.filter(
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

  const handleChange = ({ selectedRows }) => {
    setSelectedRows(selectedRows);
  };

  const fileChangeHandler = (e) => {
    setFile(e.target.files[0]);
    setFileIsSelected(true);
    if (!e.target.files[0]) {
      setFileIsSelected(false);
    }
  };
  function getFileName(str) {
    const lastDot = str.lastIndexOf(".");
    const fileName = str.substring(0, lastDot);
    return fileName;
  }

  function fileUploadHandler(userid) {
    const formData = new FormData();
    fileName.current = getFileName(file.name);
    formData.append("File", file);

    fetch(
      `${storageURL}termination-letter%2F${userid}%2F${fileName.current}?alt=media`,
      {
        method: "POST",
        body: formData,
      }
    ).then((res) => {
      if (res.ok) {
        createTerminationLetter(userid);
      } else {
        alert("Failed uploading file! try again later");
      }
    });
  }

  function createTerminationLetter(userid) {
    const issuedDate = format(new Date(), "dd/MM/yyyy").toString();
    const issuer = authCtx.user;

    const letterURL = `${storageURL}termination-letter%2F${userid}%2F${fileName.current}?alt=media`;
    fetch(`${baseURL}termination-letter/${userid}.json`, {
      method: "POST",
      body: JSON.stringify({
        issuedate: issuedDate,
        issuerid: issuer,
        letter: letterURL,
        lastupdate: "",
        status: "Pending",
      }),
      headers: {
        "Content-Type": "application/JSON",
      },
    }).then((res) => {
      if (res.ok) {
        alert("Successfully added new termination letter");
      } else {
        alert("Error occured");
      }
      setRefresher(!refresher);
    });
  }

  const issueHandler = () => {
    setToggleCleared(!toggleCleared);
    const selectedId = selectedRows.map((a) => a.id).toString();

    //masukin data ke storage di dalemnya ada masukin letter ke database
    fileUploadHandler(selectedId);
  };

  return (
    <div className={classes.datatable}>
      <div>
        <h2>Issued Termination Letters</h2>
        <DataTable
          columns={columns}
          data={filteredTerminationLetter}
          keyField={""}
          progressPending={isLoading}
          highlightOnHover
          pagination
          paginationResetDefaultPage={resetPaginationToggle}
          responsive
          subHeader
          subHeaderAlign="right"
          subHeaderComponent={subHeaderComponentMemo}
        />
      </div>
      <div>
        <h2> Select Employee </h2>
        <DataTable
          columns={columnsEmp}
          data={loadedEmployees}
          progressPending={isLoading}
          selectableRows
          selectableRowsSingle
          onSelectedRowsChange={handleChange}
          clearSelectedRows={toggleCleared}
          selectableRowsHighlight
          highlightOnHover
          pagination
        />
      </div>
      <div className={classes2.fileinput}>
        <input type="file" name="file" onChange={fileChangeHandler} />
      </div>
      {/* <button onClick={issueHandler}>Prezz Me</button> */}
      {!fileIsSelected && (
        <p style={{ textAlign: "center" }}> Choose File to Upload..</p>
      )}
      {fileIsSelected && selectedRows.length === 0 && (
        <p style={{ textAlign: "center" }}> Select employee...</p>
      )}

      {fileIsSelected && selectedRows.length > 0 && (
        <div className={classes2.actions}>
          <button onClick={issueHandler}>Upload</button>
        </div>
      )}
    </div>
  );
}

export default IssueTerminationLetterPage;
