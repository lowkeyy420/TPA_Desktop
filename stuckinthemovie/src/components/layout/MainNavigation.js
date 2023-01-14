import { useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import AuthContext from "../../store/auth-context";
import DropDown from "../input/Dropdown";
import classes from "./MainNavigation.module.css";

function MainNavigation() {
  const authCtx = useContext(AuthContext);
  const history = useHistory();

  function logoutHandler() {
    authCtx.logout();
    history.replace("login");
  }

  let employeeItems = null;

  if (authCtx.isLoggedIn) {
    employeeItems = [
      <li key="emp1">
        <DropDown
          label="Leave"
          items={[
            <div className={classes.link} key="emp1-1">
              <Link to="/employee/create-leave-request">
                Create Leave Request
              </Link>
            </div>,
            <div className={classes.link} key="emp1-2">
              <Link to="/employee/view-leave-request">View Leave Request</Link>
            </div>,
          ]}
        />
      </li>,
      <li key="emp2">
        <DropDown
          label="Working Time Change"
          items={[
            <div className={classes.link} key="emp2-1">
              <Link to="/employee/create-working-time-change-request">
                Request To Change Working Time
              </Link>
            </div>,

            <div className={classes.link} key="emp2-2">
              <Link to="/employee/view-working-time-change-request">
                View Working Time
              </Link>
            </div>,
          ]}
        />
      </li>,
      <li key="emp3">
        <DropDown
          label="Fund"
          items={[
            <div className={classes.link} key="emp3-1">
              <Link to="/employee/create-fund-request">
                Create Fund Request
              </Link>
            </div>,

            <div className={classes.link} key="emp3-2">
              <Link to="/employee/view-fund-request">View Fund Request</Link>
            </div>,
          ]}
        />
      </li>,
      // <li key="emp4">
      //   <DropDown
      //     label="Facilities"
      //     items={
      //       [
      //         <div className={classes.link} key="emp4-1">
      //           <Link to="/employee/request-new-facility">
      //             Request New Facility
      //           </Link>
      //         </div>,
      //         <div className={classes.link} key="emp4-2">
      //           <Link to="/employee/view-new-facility-request">
      //             View New Facility Request
      //           </Link>
      //         </div>,
      //         <div className={classes.link} key="emp4-3">
      //           <Link to="/employee/report-broken-facility">
      //             Report Broken Facility
      //           </Link>
      //         </div>,
      //         <div className={classes.link} key="emp4-4">
      //           <Link to="/employee/view-broken-facility-report">
      //             View Broken Facility Report
      //           </Link>
      //         </div>,
      //       ]
      //     }
      //   />
      // </li>,

      <li key="emp4">
        <Link to="/employee/report-broken-facility">
          <button className={classes.logoutButton}>
            Report Broken Facility
          </button>
        </Link>
      </li>,
      <li key="emp5">
        <Link to="/employee/upload-resignation-request">
          <button className={classes.logoutButton}>Resign</button>
        </Link>
      </li>,
    ];
  }

  return (
    <header className={classes.header}>
      <div className={classes.logo}>Stuck In The Movie</div>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>

          {!authCtx.isLoggedIn && (
            <li>
              <Link to="/login">Login</Link>
            </li>
          )}

          {employeeItems}

          {authCtx.isLoggedIn && (
            <li>
              <button className={classes.logoutButton} onClick={logoutHandler}>
                Logout
              </button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default MainNavigation;
