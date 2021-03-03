import React from 'react';
import { CSSTransition } from 'react-transition-group';

import Backdrop from './Backdrop';
import './Modal.css';

const ModalOverlay = props => {
    return (
        <div className='modal'>
            <header className='modal__header'>
                <h2>{props.header}</h2>
            </header>
            <form onSubmit={e => e.preventDefault()}>
                <div className='modal__content'>
                    {props.children}
                </div>
                <footer className='modal__footer'>
                    {props.footer}
                </footer>
            </form>
        </div>
    );
};

const Modal = props => {
    return (
        <React.Fragment>
            {props.show && <Backdrop onClick={props.onCancel} />}
            <CSSTransition
                in={props.show}
                mountOnEnter
                unmountOnExit
                timeout={300}
                classNames='modal' >
                    <ModalOverlay {...props} />
            </CSSTransition>
        </React.Fragment>
    );
};

export default Modal;