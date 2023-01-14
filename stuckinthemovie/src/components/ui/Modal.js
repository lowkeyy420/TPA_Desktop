import classes from "./ModalBackdrop.module.css";
function Modal(props) {
  function confirmHanlder() {
    props.onConfirm();
  }

  function cancelHandler() {
    props.onCancel();
  }

  return (
    <div className={classes.modal}>
      <p>Are you sure</p>
      <button className={classes.btnAlt} onClick={cancelHandler}>
        Cancel
      </button>
      <button className={classes.btn} onClick={confirmHanlder}>
        Confirm
      </button>
    </div>
  );
}

export default Modal;
