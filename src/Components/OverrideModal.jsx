import React from "react";
import { Modal, Button } from "react-bootstrap";

const OverrideModal = ({ show, onHide, onConfirm, message }) => {
    return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Override</Modal.Title>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onConfirm}>
          Yes
        </Button>
        <Button variant="primary" onClick={onHide}>
          No
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default OverrideModal;
