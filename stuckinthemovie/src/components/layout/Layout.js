import classes from "./Layout.module.css";
import MainNavigation from "./MainNavigation";

function Layout(props) {
  return (
    <section>
      <MainNavigation />
      <main className={classes.main}>{props.children}</main>
    </section>
  );
}

export default Layout;
