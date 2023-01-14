import { useState } from "react";
import { useEffect } from "react";
import DataTable from "react-data-table-component";

const columns = [
  {
    name: "ID",
    selector: (row) => row.id,
  },
  {
    name: "Name",
    selector: (row) => row.partnername,
    sortable: true,
  },
  {
    name: "Joined Date",
    selector: (row) => row.joindate,
    sortable: true,
  },
  {
    name: "Email",
    selector: (row) => row.email,
    sortable: true,
  },
  {
    name: "Phone",
    selector: (row) => row.phone,
    sortable: true,
  },
  {
    name: "Description",
    selector: (row) => row.description,
    sortable: true,
  },
];

function ViewAdvertisingPartnerPage(props) {
  const [loadedData, setLoadedData] = useState([]);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const baseURL = process.env.REACT_APP_FIREBASE_BASEURL;
    fetch(`${baseURL}advertising-partner.json`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        const partners = [];

        for (const key in data) {
          const partner = {
            id: key,
            ...data[key],
          };
          partners.push(partner);
        }
        setLoading(false);
        setLoadedData(partners);
      });
  }, []);

  function generateReportHandler() {
    window.print();
  }

  return (
    <div>
      <DataTable
        data={loadedData}
        columns={columns}
        responsive
        progressPending={isLoading}
        pagination
        highlightOnHover
      />
      <button onClick={generateReportHandler}>Generate Report</button>
    </div>
  );
}

export default ViewAdvertisingPartnerPage;
