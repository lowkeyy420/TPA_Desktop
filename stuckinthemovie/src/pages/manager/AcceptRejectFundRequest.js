import AcceptRejectTemplate from "../../components/layout/AcceptRejectTemplate";

const columns = [
  {
    name: "Name",
    selector: (row) => row.name,
    sortable: true,
  },
  {
    name: "Issued Date",
    selector: (row) => Object.values(row.request)[0]["issuedate"],
    sortable: true,
  },
  {
    name: "Amount",
    selector: (row) => Object.values(row.request)[0]["amount"],
    sortable: true,
  },
  {
    name: "Reason",
    selector: (row) => Object.values(row.request)[0]["reason"],
    sortable: true,
  },
  {
    name: "Status",
    selector: (row) => Object.values(row.request)[0]["status"],
    sortable: true,
    conditionalCellStyles: [
      {
        when: (row) => Object.values(row.request)[0]["status"] === "Pending",
        style: {
          backgroundColor: "rgb(255, 165, 0)",
          color: "white",
          "&:hover": {
            cursor: "pointer",
          },
        },
      },
      {
        when: (row) => Object.values(row.request)[0]["status"] === "Accepted",
        style: {
          backgroundColor: "rgba(63, 195, 128, 0.9)",
          color: "white",
          "&:hover": {
            cursor: "not-allowed",
          },
        },
      },
      {
        when: (row) => Object.values(row.request)[0]["status"] === "Rejected",
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
    name: "Action",
    selector: (row) => {
      if (
        Object.values(row.request)[0]["status"] === "Accepted" ||
        Object.values(row.request)[0]["status"] === "Rejected"
      ) {
        return null;
      }

      return (
        <div style={{ display: "flex", flexDirection: "row" }}>
          <div>{row.accept}</div>
          <div style={{ marginLeft: "20px" }}>{row.reject}</div>
        </div>
      );
    },
  },
];

const ExpandedComponent = (value) => {
  return (
    <h3 style={{ paddingLeft: "20px" }}>
      Reason : {Object.values(value.data.request)[0]["reason"]}
    </h3>
  );
};

function AcceptRejectFundRequest() {
  return (
    <AcceptRejectTemplate
      columns={columns}
      category="fund-request"
      expanded={ExpandedComponent}
    />
  );
}

export default AcceptRejectFundRequest;
