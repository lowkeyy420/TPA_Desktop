export function AdminLinks() {
  const administratorRoutes = [
    {
      link: "/admin/reset-password",
      label: "Reset Password",
    },
    {
      link: "/hrd/view-employee",
      label: "Manage Department Access",
    },
  ];
  return administratorRoutes;
}
