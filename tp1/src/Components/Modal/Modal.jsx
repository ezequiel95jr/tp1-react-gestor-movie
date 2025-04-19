import styles from "./Modal.module.css";
import Button from "../Button/Button";
const Modal = ({ children, onClose }) => {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.content} onClick={(e) => e.stopPropagation()}>
        <Button onClick={() => onClose()} type="button">
                x
        </Button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
