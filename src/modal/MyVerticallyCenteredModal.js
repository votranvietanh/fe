import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function MyVerticallyCenteredModal(props) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="d-flex align-items-center justify-content-center"
    >
      <Modal.Header
        style={{
          backgroundColor: '#66b3ff',
          fontSize: "26.66px"
        }}>
        <Modal.Title id="contained-modal-title-vcenter">
          <b>

            {props.header}
          </b>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {props.content}


      </Modal.Body>
      <Modal.Footer>
        <Button  onClick={props.onSubmit} className="btn btn-primary btn-block" disabled={props.iserrors}>
          {props.isLoading && (
            <span className="spinner-border spinner-border-sm"></span>
          )}
          <span>Submit</span>
        </Button>
        <Button onClick={props.onClose} className="btn btn-danger btn-block">Close</Button>

      </Modal.Footer>
    </Modal>
  );
}

export default MyVerticallyCenteredModal;
