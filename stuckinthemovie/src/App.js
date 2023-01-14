import { useContext } from "react";
import { Route, Switch, Redirect } from "react-router-dom";

import Layout from "./components/layout/Layout";
import ViewDepartmentFundRequest from "./pages/accounting/ViewDepartmentFundRequest";
import ViewSalaryAdjustment from "./pages/accounting/ViewSalaryAdjustment";
import ResetPasswordPage from "./pages/admin/ResetPasswordPage";
import LoginPage from "./pages/auth/LoginPage";
import CreateFundRequestPage from "./pages/employee/CreateFundRequestPage";
import CreateLeaveRequestPage from "./pages/employee/CreateLeaveRequestPage";
import CreateWorkingTimeChangeRequest from "./pages/employee/CreateWorkingTimeChangeRequest";
import ReportFacilityPage from "./pages/employee/ReportFacilityPage";
import ResignationPage from "./pages/employee/ResignationPage";
import ViewFundRequestPage from "./pages/employee/ViewFundRequestPage";
import ViewLeaveRequest from "./pages/employee/ViewLeaveRequestPage";
import ViewWorkingTimePage from "./pages/employee/ViewWorkingTimePage";
import AddAdvertisingPartnerPage from "./pages/external/AddAdvertisingPartnerPage";
import AddFoodSupplierPage from "./pages/external/AddFoodSupplierPage";
import AddMovieProducerPage from "./pages/external/AddMovieProducerPage";
import ViewAdvertisingPartnerPage from "./pages/external/ViewAdvertisingPartnerPage";
import ViewFoodSupplierPage from "./pages/external/ViewFoodSupplierPage";
import ViewMovieProducerPage from "./pages/external/ViewMovieProducerPage";
import AcceptRejectPersonalLeaveRequest from "./pages/hrd/AcceptRejectPersonalLeavePage";
import AddEmployeePage from "./pages/hrd/AddEmployeePage";
import IssueTerminationLetterPage from "./pages/hrd/IssueTerminationLetterPage";
import IssueWarningLetterPage from "./pages/hrd/IssueWarningLetterPage";
import SalaryAdjustmentPage from "./pages/hrd/SalaryAdjustmentPage";
import UpdateTerminationLetterPage from "./pages/hrd/UpdateTerminationLetterPage";
import UpdateWarningLetterPage from "./pages/hrd/UpdateWarningLetterPage";
import UpdateWorkingTime from "./pages/hrd/UpdateWorkingTime";
import ViewEmployeePage from "./pages/hrd/ViewEmployeePage";
import AcceptRejectFundRequest from "./pages/manager/AcceptRejectFundRequest";
import AcceptRejectResignation from "./pages/manager/AcceptRejectResignation";
import AcceptRejectSalaryAdjustment from "./pages/manager/AcceptRejectSalaryAdjustment";
import AcceptRejectTerminationLetter from "./pages/manager/AcceptRejectTerminationLetter";
import AcceptRejectWarningLetter from "./pages/manager/AcceptRejectWarningLetter";
import OpeningPage from "./pages/OpeningPage";
import AddNewPromoPage from "./pages/promotion/AddNewPromoPage";
import ViewMembershipPage from "./pages/promotion/ViewMembershipPage";
import ViewPromoPage from "./pages/promotion/ViewPromoPage";
import SelectionHomePage from "./pages/SelectionHomePage";
import AddNewFacilityPage from "./pages/storage/AddNewFacilityPage";
import FixBrokenFacilityPage from "./pages/storage/FixBrokenFacilityPage";
import ViewFacilityPage from "./pages/storage/ViewFacilityPage";
import ViewStorageFundRequest from "./pages/storage/ViewStorageFundRequest";
import AuthContext from "./store/auth-context";

function App() {
  const authCtx = useContext(AuthContext);

  let employeeRouting = null;
  let hrdRouting = null;
  let managerRouting = null;
  let accountingRouting = null;
  let adminRouting = null;
  let storageRouting = null;
  let promotionRouting = null;
  let externalRouting = null;

  if (authCtx.isLoggedIn) {
    employeeRouting = [
      <Route key="employee1" path="/employee/create-leave-request" exact>
        <CreateLeaveRequestPage />
      </Route>,
      <Route key="employee2" path="/employee/view-leave-request" exact>
        <ViewLeaveRequest />
      </Route>,
      <Route
        key="employee3"
        path="/employee/create-working-time-change-request"
        exact
      >
        <CreateWorkingTimeChangeRequest />
      </Route>,
      <Route
        key="employee4"
        path="/employee/view-working-time-change-request"
        exact
      >
        <ViewWorkingTimePage />
      </Route>,
      <Route key="employee5" path="/employee/create-fund-request" exact>
        <CreateFundRequestPage />
      </Route>,
      <Route key="employee6" path="/employee/view-fund-request" exact>
        <ViewFundRequestPage />
      </Route>,
      // <Route key="employee7" path="/employee/request-new-facility" exact>
      //   <AddEmployeePage />
      // </Route>,
      // <Route key="employee8" path="/employee/view-new-facility-request" exact>
      //   <ViewEmployeePage />
      // </Route>,
      <Route key="employee9" path="/employee/report-broken-facility" exact>
        <ReportFacilityPage />
      </Route>,
      // <Route
      //   key="employee10"
      //   path="/employee/view-broken-facility-report"
      //   exact
      // >
      //   <ViewReportedFacilityPage />
      // </Route>,
      <Route key="employee11" path="/employee/upload-resignation-request" exact>
        <ResignationPage />
      </Route>,
    ];

    if (authCtx.role === "Administrator") {
      adminRouting = [
        <Route key="admin1" path="/admin/reset-password">
          <ResetPasswordPage />
        </Route>,
      ];
    }

    if (authCtx.role === "Human Resource" || authCtx.role === "Administrator") {
      hrdRouting = [
        <Route key="hrd1" path="/hrd/add-employee">
          <AddEmployeePage />
        </Route>,
        <Route key="hrd2" path="/hrd/view-employee">
          <ViewEmployeePage />
        </Route>,
        <Route key="hrd3" path="/hrd/issue-warning-letter">
          <IssueWarningLetterPage />
        </Route>,
        <Route key="hrd4" path="/hrd/update-warning-letter">
          <UpdateWarningLetterPage />
        </Route>,
        // <Route key="hrd5" path="/hrd/remove-warning-letter">
        //   <ViewEmployeePage />
        // </Route>,
        <Route key="hrd6" path="/hrd/update-working-time">
          <UpdateWorkingTime />
        </Route>,
        <Route key="hrd7" path="/hrd/request-salary-adjustment">
          <SalaryAdjustmentPage />
        </Route>,
        <Route key="hrd8" path="/hrd/accept-reject-personal-leave-request">
          <AcceptRejectPersonalLeaveRequest />
        </Route>,
        <Route key="hrd9" path="/hrd/issue-termination-letter">
          <IssueTerminationLetterPage />
        </Route>,
        <Route key="hrd10" path="/hrd/update-termination-letter">
          <UpdateTerminationLetterPage />
        </Route>,
      ];
    }
    if (authCtx.role === "Manager" || authCtx.role === "Administrator") {
      managerRouting = [
        <Route key="manager1" path="/manager/view-finance-report"></Route>,
        <Route
          key="manager2"
          path="/manager/view-movie-schedule-report"
        ></Route>,
        <Route key="manager3" path="/manager/view-facilities-report"></Route>,
        <Route key="manager4" path="/manager/view-employee-report"></Route>,
        // <Route key="manager5" path="/manager/remove-warning-letter">
        //   <ViewEmployeePage />
        // </Route>,
        <Route key="manager6" path="/manager/view-membership-report"></Route>,
        <Route key="manager7" path="/manager/accept-reject-resignation-letter">
          <AcceptRejectResignation />
        </Route>,
        <Route key="manager8" path="/manager/accept-reject-warning-letter">
          <AcceptRejectWarningLetter />
        </Route>,
        <Route key="manager9" path="/manager/accept-reject-salary-adjustment">
          <AcceptRejectSalaryAdjustment />
        </Route>,
        <Route key="manager10" path="/manager/accept-reject-fund-request">
          <AcceptRejectFundRequest />
        </Route>,
        <Route key="manager11" path="/manager/accept-reject-termination-letter">
          <AcceptRejectTerminationLetter />
        </Route>,
      ];
    }
    if (authCtx.role === "Accounting" || authCtx.role === "Administrator") {
      accountingRouting = [
        <Route key="accounting1" path="/accounting/view-salary-adjustment">
          <ViewSalaryAdjustment />
        </Route>,
        <Route
          key="accounting2"
          path="/accounting/view-facility-purchase-report"
        ></Route>,
        <Route key="accounting3" path="/accounting/view-fund-request">
          <ViewDepartmentFundRequest />
        </Route>,
      ];
    }
    if (authCtx.role === "Storage" || authCtx.role === "Administrator") {
      storageRouting = [
        <Route key="storage1" path="/storage/add-new-facility">
          <AddNewFacilityPage />
        </Route>,
        <Route key="storage2" path="/storage/view-facility">
          <ViewFacilityPage />
        </Route>,
        <Route key="storage3" path="/storage/fix-broken-facility">
          <FixBrokenFacilityPage />
        </Route>,
        <Route key="storage4" path="/storage/view-storage-fund-request">
          <ViewStorageFundRequest />
        </Route>,
      ];
    }
    if (authCtx.role === "Promotion" || authCtx.role === "Administrator") {
      promotionRouting = [
        <Route key="promotion1" path="/promotion/add-new-promo">
          <AddNewPromoPage />
        </Route>,
        <Route key="promotion2" path="/promotion/view-promo">
          <ViewPromoPage />
        </Route>,
        <Route key="promotion3" path="/promotion/view-membership">
          <ViewMembershipPage />
        </Route>,
      ];
    }
    if (authCtx.role === "External" || authCtx.role === "Administrator") {
      externalRouting = [
        <Route key="external1" path="/external/add-movie-producer">
          <AddMovieProducerPage />
        </Route>,
        <Route key="external2" path="/external/view-movie-producer">
          <ViewMovieProducerPage />
        </Route>,
        <Route key="external3" path="/external/add-movie">
          <h1>3</h1>
        </Route>,
        <Route key="external4" path="/external/view-movie">
          <h1>4</h1>
        </Route>,
        <Route key="external5" path="/external/add-food-supplier">
          <AddFoodSupplierPage />
        </Route>,
        <Route key="external6" path="/external/view-food-supplier">
          <ViewFoodSupplierPage />
        </Route>,
        <Route key="external7" path="/external/add-advertising-partner">
          <AddAdvertisingPartnerPage />
        </Route>,
        <Route key="external8" path="/external/view-advertising-partner">
          <ViewAdvertisingPartnerPage />
        </Route>,
      ];
    }
  }

  return (
    <Layout>
      <Switch>
        {authCtx.isLoggedIn && (
          <Route path="/" exact>
            <SelectionHomePage role={authCtx.role} />
          </Route>
        )}

        {!authCtx.isLoggedIn && (
          <Route path="/" exact>
            <OpeningPage />
          </Route>
        )}

        {!authCtx.isLoggedIn && (
          <Route path="/login">
            <LoginPage />
          </Route>
        )}

        {employeeRouting}
        {hrdRouting}
        {managerRouting}
        {accountingRouting}
        {adminRouting}
        {storageRouting}
        {promotionRouting}
        {externalRouting}

        <Route path="*">
          <Redirect to="/" />
        </Route>
      </Switch>
    </Layout>
  );
}

export default App;
