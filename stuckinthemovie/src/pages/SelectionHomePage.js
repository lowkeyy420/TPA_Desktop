import { Link } from "react-router-dom";
import Card from "../components/ui/Card";
import { AccountingLinks } from "../model/Accounting";
import { AdminLinks } from "../model/Administrator";
import { ExternalLinks } from "../model/External";
import { HRDlinks } from "../model/HRD";
import { ManagerLinks } from "../model/Manager";
import { PromotionLinks } from "../model/Promotion";
import { StorageLinks } from "../model/Storage";
import classes from "./SelectionHomePage.module.css";

function SelectionHomePage(props) {
  let links = (
    <div>
      <h2 style={{ color: "white", textAlign: "center" }}>Loading...</h2>
    </div>
  );

  if (props.role === "Accounting") {
    links = AccountingLinks().map((res, i) => (
      <Card key={i}>
        <Link to={res.link}>
          <div className={classes.boxes}>
            <h2> {res.label}</h2>
          </div>
        </Link>
      </Card>
    ));
  }
  if (props.role === "Administrator") {
    links = AdminLinks().map((res, i) => (
      <Card key={i}>
        <Link to={res.link}>
          <div className={classes.boxes}>
            <h2> {res.label}</h2>
          </div>
        </Link>
      </Card>
    ));
  }

  if (props.role === "Human Resource") {
    links = HRDlinks().map((res, i) => (
      <Card key={i}>
        <Link to={res.link}>
          <div className={classes.boxes}>
            <h2> {res.label}</h2>
          </div>
        </Link>
      </Card>
    ));
  }
  if (props.role === "Manager") {
    links = ManagerLinks().map((res, i) => (
      <Card key={i}>
        <Link to={res.link}>
          <div className={classes.boxes}>
            <h2> {res.label}</h2>
          </div>
        </Link>
      </Card>
    ));
  }

  if (props.role === "Storage") {
    links = StorageLinks().map((res, i) => (
      <Card key={i}>
        <Link to={res.link}>
          <div className={classes.boxes}>
            <h2> {res.label}</h2>
          </div>
        </Link>
      </Card>
    ));
  }

  if (props.role === "Promotion") {
    links = PromotionLinks().map((res, i) => (
      <Card key={i}>
        <Link to={res.link}>
          <div className={classes.boxes}>
            <h2> {res.label}</h2>
          </div>
        </Link>
      </Card>
    ));
  }

  if (props.role === "External") {
    links = ExternalLinks().map((res, i) => (
      <Card key={i}>
        <Link to={res.link}>
          <div className={classes.boxes}>
            <h2> {res.label}</h2>
          </div>
        </Link>
      </Card>
    ));
  }

  return (
    <section className={classes.selectionOuterContainer}>
      <div className={classes.selectionContainer}>{links}</div>
    </section>
  );
}

export default SelectionHomePage;
