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

function ViewFoodSupplierPage() {
  const [loadedData, setLoadedData] = useState([]);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const baseURL = process.env.REACT_APP_FIREBASE_BASEURL;
    fetch(`${baseURL}food-supplier.json`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        const foods = [];

        for (const key in data) {
          const food = {
            id: key,
            ...data[key],
          };
          foods.push(food);
        }
        setLoading(false);
        setLoadedData(foods);
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

export default ViewFoodSupplierPage;
