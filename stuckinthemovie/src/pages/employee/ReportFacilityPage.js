import { format } from "date-fns";
import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import QRCode from "react-qr-code";

function changeHandler(selectedId) {
  const baseURL = process.env.REACT_APP_FIREBASE_BASEURL;
  const reportStatus = document.getElementById(selectedId).value;
  const reportDate = format(new Date(), "dd/MM/yyyy").toString();

  fetch(`${baseURL}facility-report/${selectedId}.json`, {
    method: "POST",
    body: JSON.stringify({
      reportdate: reportDate,
      status: reportStatus,
    }),
  }).then((res) => {
    if (res.ok) {
      alert("Sucessfully reported");
    } else {
      alert("Error occured");
    }
  });
}

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
    name: "Report Item",
    cell: (row) => {
      return (
        <div
          style={{
            height: "100px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-evenly",
            alignItems: "center",
          }}
        >
          <select defaultValue={row.shift} id={row.id}>
            <option value={row.shift} disabled hidden>
              new time
            </option>

            <option value="Working">Working</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Broken">Broken</option>
          </select>
          <button onClick={() => changeHandler(row.id)}>Report</button>
        </div>
      );
    },
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

function ReportFacilityPage() {
  const [loadedFacility, setLoadedFacility] = useState([]);
  const [isLoading, setLoading] = useState(true);

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

  return (
    <div>
      <DataTable
        data={loadedFacility}
        columns={columns}
        responsive
        progressPending={isLoading}
        pagination
      />
    </div>
  );
}

export default ReportFacilityPage;
