import classes from "./ModalBackdrop.module.css";

function Backdrop(props) {
  function closeModalHandler() {
    props.onClick();
  }

  return <div className={classes.backdrop} onClick={closeModalHandler} />;
}

export default Backdrop;
