import { useState } from "react";
import { useEffect } from "react";
import DataTable from "react-data-table-component";
import QRCode from "react-qr-code";

const columns = [
  {
    name: "Name",
    selector: (row) => row.name,
    sortable: true,
  },
  {
    name: "Description",
    selector: (row) => row.description,
    sortable: true,
  },

  {
    name: "Promo Added",
    selector: (row) => row.adddate,
    sortable: true,
  },
  {
    name: "Promo Valid From",
    selector: (row) => {
      if (new Date(row.validfrom).getTime() < new Date().getTime())
        return <p style={{ color: "red" }}>{row.validfrom}</p>;

      return row.validfrom;
    },
    sortable: true,
  },
  {
    name: "Promo Valid To",
    selector: (row) => {
      if (new Date(row.validto).getTime() < new Date().getTime())
        return <p style={{ color: "red" }}>{row.validto}</p>;
      return row.validto;
    },
    sortable: true,
  },
  {
    name: "QR Label",
    selector: (row) => {
      const value = `${row.name} - ${row.description}. Promo id ${row.id}. Added on ${row.adddate} , valid from ${row.validfrom} until ${row.validto} !`;
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
    sortable: true,
  },
];

function ViewPromoPage(props) {
  const [loadedData, setLoadedData] = useState([]);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const baseURL = process.env.REACT_APP_FIREBASE_BASEURL;
    fetch(`${baseURL}promo-event.json`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        const promos = [];

        for (const key in data) {
          const promo = {
            id: key,
            ...data[key],
          };
          promos.push(promo);
        }
        setLoading(false);
        setLoadedData(promos);
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

export default ViewPromoPage;
