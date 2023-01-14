import { useEffect, useMemo, useRef, useState } from "react";
import DataTable from "react-data-table-component";
import classes from "./ViewEmployee.module.css";
import classes2 from "./../../components/employee/AddForm.module.css";
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
    name: "Last Update Date",
    selector: (row) => {
      if (Object.values(row.letter)[0]["lastupdate"].length === 0) return "-";
      return Object.values(row.letter)[0]["lastupdate"];
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
        when: (row) => Object.values(row.letter)[0]["status"] === "Working",
        style: {
          backgroundColor: "rgba(63, 195, 128, 0.9)",
          color: "white",
          "&:hover": {
            cursor: "pointer",
          },
        },
      },
      {
        when: (row) => Object.values(row.letter)[0]["status"] === "Broken",
        style: {
          backgroundColor: "rgba(242, 38, 19, 0.9)",
          color: "white",
          "&:hover": {
            cursor: "not-allowed",
          },
        },
      },
      {
        when: (row) => Object.values(row.letter)[0]["status"] === "Maintenance",
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

function UpdateTerminationLetterPage() {
  const [isLoading, setLoading] = useState(true);
  const [loadedTerminationLetter, setLoadedTerminationLetter] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

  const baseURL = process.env.REACT_APP_FIREBASE_BASEURL;

  const storageURL = process.env.REACT_APP_FIREBASE_STORAGEURL;

  const [selectedRows, setSelectedRows] = useState([]);
  const [toggleCleared, setToggleCleared] = useState(false);

  const [file, setFile] = useState();
  const [fileIsSelected, setFileIsSelected] = useState(false);
  const fileName = useRef();
  const [refresher, setRefresher] = useState(false);

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

  function fileDeleteHandler(link) {
    fetch(link, { method: "DELETE" }).catch((error) => {
      console.log(error);
    });
  }

  function updateLinkHandler(userid, letterid) {
    const link = `${storageURL}termination-letter%2F${userid}%2F${fileName.current}?alt=media`;
    const updatedate = format(new Date(), "dd/MM/yyyy").toString();
    fetch(`${baseURL}termination-letter/${userid}/${letterid}.json`, {
      method: "PATCH",
      body: JSON.stringify({
        letter: link,
        lastupdate: updatedate,
      }),
    }).then((res) => {
      if (res.ok) {
        alert("Successfully Updated");
      } else {
        alert("Failed to update");
      }
      setRefresher(!refresher);
    });
  }

  function fileUploadHandler(userid, letterid) {
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
        updateLinkHandler(userid, letterid);
      } else {
        alert("Failed uploading file! try again later");
      }
    });
  }

  const updateHandler = () => {
    // delete yang lama
    const selectedId = selectedRows.map((a) => a.id).toString();
    const selectedLetterID = selectedRows
      .map((a) => Object.keys(a.letter)[0])
      .toString();
    const selectedLetterLink = selectedRows
      .map((a) => Object.values(a.letter)[0]["letter"])
      .toString();

    const formattedLetterLink = selectedLetterLink.replace(/ /g, "%20");

    setToggleCleared(!toggleCleared);
    fileDeleteHandler(formattedLetterLink);
    fileUploadHandler(selectedId, selectedLetterID);
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
          selectableRows
          selectableRowsSingle
          onSelectedRowsChange={handleChange}
          clearSelectedRows={toggleCleared}
          selectableRowsHighlight
        />
      </div>
      <div className={classes2.fileinput}>
        <input type="file" id="fileInput" onChange={fileChangeHandler} />
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
          <button onClick={updateHandler}>Upload</button>
        </div>
      )}
    </div>
  );
}

export default UpdateTerminationLetterPage;
