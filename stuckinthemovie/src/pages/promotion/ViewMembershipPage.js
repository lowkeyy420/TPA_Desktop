import { useState } from "react";
import { useEffect } from "react";
import DataTable from "react-data-table-component";

function notify(customeremail) {
  console.log(customeremail);
}

const columns = [
  {
    name: "Name",
    selector: (row) => row.name,
    sortable: true,
  },
  {
    name: "Membership",
    selector: (row) => row.membership,
    sortable: true,
  },

  {
    name: "Promos",
    selector: (row) => {
      return (
        <div>
          <select>
            <option>Test</option>
          </select>
        </div>
      );
    },
  },
  {
    name: "Action",
    selector: (row) => {
      return (
        <div>
          <button onClick={() => notify(row.email)}>Notify</button>
        </div>
      );
    },
  },
];

function ViewMembershipPage() {
  const [loadedData, setLoadedData] = useState([]);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const baseURL = process.env.REACT_APP_FIREBASE_BASEURL;
    fetch(`${baseURL}customer.json`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        const customers = [];

        for (const key in data) {
          const customer = {
            id: key,
            ...data[key],
          };
          customers.push(customer);
        }
        setLoading(false);
        setLoadedData(customers);
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

export default ViewMembershipPage;
