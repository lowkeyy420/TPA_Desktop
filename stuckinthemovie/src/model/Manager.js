export function ManagerLinks() {
  const managerRoutes = [
    {
      link: "/manager/view-finance-report",
      label: "View Finance Report",
    },
    {
      link: "/manager/view-movie-schedule-report",
      label: "View Schedule Report",
    },
    {
      link: "/manager/view-facilities-report",
      label: "View Facilities & Equipment Report",
    },
    {
      link: "/manager/view-employee-report",
      label: "View Employee Report",
    },
    {
      link: "/manager/view-membership-report",
      label: "View Membership Report",
    },
    {
      link: "/hrd/update-working-time",
      label: "Update Employee Working Time",
    },
    {
      link: "/manager/accept-reject-resignation-letter",
      label: "Accept or Reject Resignation Letter",
    },
    {
      link: "/manager/accept-reject-warning-letter",
      label: "Accept or Reject Warning Letter",
    },
    {
      link: "/manager/accept-reject-salary-adjustment",
      label: "Accept or Reject Salary Adjustment Request",
    },
    {
      link: "/manager/accept-reject-fund-request",
      label: "Accept or Reject Fund Request",
    },
    {
      link: "/manager/accept-reject-termination-letter",
      label: "Accept or Reject Termination Letter",
    },
  ];
  return managerRoutes;
}
