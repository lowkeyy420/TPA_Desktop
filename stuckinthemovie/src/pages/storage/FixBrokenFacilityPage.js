import { useEffect, useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import styled from "styled-components";

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
      placeholder="Search Facilitye"
      aria-label="Search Input"
      value={filterText}
      onChange={onFilter}
    />
    <ClearButton type="button" onClick={onClear}>
      X
    </ClearButton>
  </>
);

const columns = [
  {
    name: "ID",
    selector: (row) => {
      return Object.keys(row.report)[0];
    },
  },
  {
    name: "Name",
    selector: (row) => row.name,
    sortable: true,
  },
  {
    name: "Department",
    selector: (row) => row.department,
    sortable: true,
  },
  {
    name: "Current Status",
    selector: (row) => row.status,
    sortable: true,
    conditionalCellStyles: [
      {
        when: (row) => row.status === "Working",
        style: {
          backgroundColor: "rgba(63, 195, 128, 0.9)",
          color: "white",
          "&:hover": {
            cursor: "pointer",
          },
        },
      },
      {
        when: (row) => row.status === "Broken",
        style: {
          backgroundColor: "rgba(242, 38, 19, 0.9)",
          color: "white",
          "&:hover": {
            cursor: "not-allowed",
          },
        },
      },
      {
        when: (row) => row.status === "Maintenance",
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
    name: "Reported Date",
    selector: (row) => {
      return Object.values(row.report)[0]["reportdate"];
    },
    sortable: true,
  },

  {
    name: "Reported Status",
    selector: (row) => {
      return Object.values(row.report)[0]["status"];
    },

    sortable: true,
    conditionalCellStyles: [
      {
        when: (row) => Object.values(row.report)[0]["status"] === "Working",
        style: {
          backgroundColor: "rgba(63, 195, 128, 0.9)",
          color: "white",
          "&:hover": {
            cursor: "pointer",
          },
        },
      },
      {
        when: (row) => Object.values(row.report)[0]["status"] === "Broken",
        style: {
          backgroundColor: "rgba(242, 38, 19, 0.9)",
          color: "white",
          "&:hover": {
            cursor: "not-allowed",
          },
        },
      },
      {
        when: (row) => Object.values(row.report)[0]["status"] === "Maintenance",
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
    minWidth: "300px",
    selector: (row) => row.action,
  },
];

function FixBrokenFacilityPage() {
  const [isLoading, setLoading] = useState(true);
  const [loadedBrokenReport, setLoadedBrokenReport] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [refresher, setRefresher] = useState(false);

  useEffect(() => {
    const baseURL = process.env.REACT_APP_FIREBASE_BASEURL;

    function updateHandler(type, facilityid) {
      fetch(`${baseURL}facility/${facilityid}.json`, {
        method: "PATCH",
        body: JSON.stringify({
          status: type,
        }),
      }).then((res) => {
        if (res.ok) {
          alert("Successfully updated status");
          setRefresher(!refresher);
        } else {
          alert("Error occured");
        }
      });
    }

    setLoading(true);
    async function fetchData() {
      //all facilitye
      const facilityRes = await fetch(`${baseURL}facility.json`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const facilityData = await facilityRes.json();

      const facilites = [];
      for (const key in facilityData) {
        const facilitye = {
          id: key,
          ...facilityData[key],
        };
        facilites.push(facilitye);
      }

      //all warning report
      const reportRes = await fetch(`${baseURL}facility-report.json`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const reportData = await reportRes.json();

      const reports = [];
      for (const key in reportData) {
        for (const tmp in reportData[key]) {
          const report = {
            id: key,
            report: {
              [tmp]: {
                ...reportData[key][tmp],
              },
            },
            action: (
              <div
                style={{
                  width: "250px",
                  display: "flex",
                  justifyContent: "space-evenly",
                }}
              >
                <button
                  onClick={() => {
                    updateHandler("Working", key);
                  }}
                >
                  Working
                </button>
                <button
                  onClick={() => {
                    updateHandler("Maintenance", key);
                  }}
                >
                  Maintenance
                </button>
                <button
                  onClick={() => {
                    updateHandler("Broken", key);
                  }}
                >
                  Broken
                </button>
              </div>
            ),
          };
          reports.push(report);
        }
      }

      setLoadedBrokenReport(
        reports.map((item) => ({
          ...item,
          ...facilites.find((e) => e.id === item.id),
        }))
      );
      setLoading(false);
    }

    fetchData();
  }, [refresher]);

  const filteredBrokenReport = loadedBrokenReport.filter(
    (facilitye) =>
      facilitye.name &&
      facilitye.name.toLowerCase().includes(filterText.toLowerCase())
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
      <h2>Broken Facility Report</h2>
      <DataTable
        columns={columns}
        data={filteredBrokenReport}
        keyField={""}
        progressPending={isLoading}
        highlightOnHover
        pagination
        paginationResetDefaultPage={resetPaginationToggle}
        responsive
        subHeader
        subHeaderAlign="right"
        subHeaderComponent={subHeaderComponentMemo}
        selectableRowsHighlight
      />
    </div>
  );
}
export default FixBrokenFacilityPage;
