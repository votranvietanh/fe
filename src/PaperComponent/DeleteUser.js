import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export function DeleteUserDialog(props) {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => {
        if (props.selectedRowIds.length === 0) {
            alert('Empty');
            return
        }
        setShow(true);
    }
    // click ok thi done
    const handleDeleteRows = () => {
        props.onClick();
        handleClose()
    }

    return (
        <>
            <Button variant="light" onClick={handleShow} disabled={(props.selectedRowIds.length === 0) ? true : false}>
                <img className='icon-title1' src="/DeleteIcon.svg" alt="delete-icon" />
            </Button>

            <Modal              
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header style={{ width: 500 }}>
                    <Modal.Title style={{ fontSize: 22 }}>Are you sure to delete all employee selected?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Will be delete all data employee selected.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleDeleteRows}>OK</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
