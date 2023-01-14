import { useState } from "react";
import classes from "./Dropdown.module.css";

function DropDown(props) {
  const [dropDownActive, setDropDownActive] = useState(false);
  let items = null;

  if (props.items) {
    items = props.items;
  }

  function toggleShowHandler() {
    setDropDownActive(!dropDownActive);
  }

  return (
    <div className={classes.dropdown}>
      <button className={classes.dropbtn} onClick={toggleShowHandler}>
        <span>{props.label}</span>
        {dropDownActive ? (
          <i className="fa fa-caret-up" style={{ paddingLeft: "10px" }}></i>
        ) : (
          <i className="fa fa-caret-down" style={{ paddingLeft: "10px" }}></i>
        )}
      </button>

      {dropDownActive && <div className={classes.dropdowncontent}>{items}</div>}
    </div>
  );
}

export default DropDown;
