import React from 'react';

import Modal from './Modal';
import Cbutton from './Cbutton';

const ErrorModal = props => {
    return (
        <Modal
            onCacel={props.onClear}
            header='An error Occurred'
            show={!!props.error}
            footer={<Cbutton onClick={props.onClear}>OKAY</Cbutton>} >
            <p>{props.error}</p>
        </Modal>
    );
};

export default ErrorModal;