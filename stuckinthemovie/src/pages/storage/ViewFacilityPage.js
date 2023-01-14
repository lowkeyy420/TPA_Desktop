import { useEffect, useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import QRCode from "react-qr-code";
import styled from "styled-components";
import classes from "../hrd/ViewEmployee.module.css";

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
    name: "Added date",
    selector: (row) => row.adddate,
    sortable: true,
  },
  {
    name: "Status",
    selector: (row) => {
      if (row.status === "Working") {
        return (
          <p
            style={{
              backgroundColor: "rgba(63, 195, 128, 0.9)",
              padding: "20px",
              borderRadius: "8px",
            }}
          >
            {row.status}
          </p>
        );
      }
      if (row.status === "Maintenance") {
        return (
          <p
            style={{
              backgroundColor: "rgba(240, 211, 28, 0.8)",
              padding: "20px",
              borderRadius: "8px",
            }}
          >
            {row.status}
          </p>
        );
      }
      if (row.status === "Broken") {
        return (
          <p
            style={{
              backgroundColor: "rgba(242, 38, 19, 0.9)",
              padding: "20px",
              borderRadius: "8px",
            }}
          >
            {row.status}
          </p>
        );
      }
    },
    sortable: true,
  },
  {
    name: "Department",
    selector: (row) => row.department,
    sortable: true,
  },
  {
    name: "QR Label",
    selector: (row) => {
      const value = `Facilty / Equipment : ${row.id} - ${row.name} for ${row.department}. Added on ${row.adddate}`;
      return (
        <QRCode
          value={value}
          size={128}
          style={{
            height: "auto",
            maxWidth: "100%",
            width: "100%",
            marginTop: "20px",
            marginBottom: "20px",
            marginRight: "20px",
          }}
        />
      );
    },
  },
];

function ViewFacilityPage() {
  const [loadedFacility, setLoadedFacility] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

  useEffect(() => {
    setLoading(true);
    const baseURL = process.env.REACT_APP_FIREBASE_BASEURL;
    fetch(`${baseURL}facility.json`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        const facilities = [];

        for (const key in data) {
          const facility = {
            id: key,
            ...data[key],
          };
          facilities.push(facility);
        }
        setLoading(false);
        setLoadedFacility(facilities);
      });
  }, []);

  const filteredFacility = loadedFacility.filter(
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
        data={filteredFacility}
        columns={columns}
        responsive
        progressPending={isLoading}
        pagination
        subHeader
        subHeaderAlign="right"
        subHeaderComponent={subHeaderComponentMemo}
      />
    </div>
  );
}

export default ViewFacilityPage;
