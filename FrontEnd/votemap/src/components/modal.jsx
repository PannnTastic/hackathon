import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

function ModalShow({title, message, show, handleClose}) {
  
    return (
      <>
  
        <Modal
          show={show}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title style={{
                textAlign : 'center',
                width : '100%'
            }}>
                {title}
                </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {message}
          </Modal.Body>
        </Modal>
      </>
    );

}

export default ModalShow