import classes from "./OpeningPage.module.css";
import logo from "../assets/logositm.jpg";

function OpeningPage() {
  return (
    <section>
      <div className={classes.openingOuterContainer}>
        <div className={classes.openingBox}>
          <div className={classes.header}>
            <h2>Welcome to Stuck In The Movie </h2>
            <p> Login to Get Started !</p>
          </div>
          <img src={logo} alt="logo" className={classes.logo} />
        </div>
      </div>
    </section>
  );
}

export default OpeningPage;
