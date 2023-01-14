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
    selector: (row) => row.name,
    sortable: true,
  },
  {
    name: "Joined Date",
    selector: (row) => row.joindate,
    sortable: true,
  },
  {
    name: "Phone",
    selector: (row) => row.phone,
    sortable: true,
  },
  {
    name: "Email",
    selector: (row) => row.email,
    sortable: true,
  },
];

function ViewMovieProducerPage(props) {
  const [loadedData, setLoadedData] = useState([]);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const baseURL = process.env.REACT_APP_FIREBASE_BASEURL;
    fetch(`${baseURL}movie-producer.json`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        const producers = [];

        for (const key in data) {
          const producer = {
            id: key,
            ...data[key],
          };
          producers.push(producer);
        }
        setLoading(false);
        setLoadedData(producers);
      });
  }, []);

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
    </div>
  );
}

export default ViewMovieProducerPage;
