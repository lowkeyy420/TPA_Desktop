export function HRDlinks() {
  const hrdRoutes = [
    {
      link: "/hrd/add-employee",
      label: "Add Employee",
    },
    {
      link: "/hrd/view-employee",
      label: "View Employee",
    },
    {
      link: "/hrd/issue-warning-letter",
      label: "Issue Warning Letter",
    },
    {
      link: "/hrd/update-warning-letter",
      label: "Update Warning Letter",
    },
    // {
    //   link: "/hrd/remove-warning-letter",
    //   label: "Remove Warning Letter",
    // },
    {
      link: "/hrd/update-working-time",
      label: "Update Employee Working Time",
    },
    {
      link: "/hrd/request-salary-adjustment",
      label: "Request Salary Adjustment",
    },
    {
      link: "/hrd/accept-reject-personal-leave-request",
      label: "Accept or Reject Personal Leave Request",
    },
    {
      link: "/hrd/issue-termination-letter",
      label: "Issue Termination Letter",
    },
    {
      link: "/hrd/update-termination-letter",
      label: "Update Termination Letter",
    },
  ];
  return hrdRoutes;
}
