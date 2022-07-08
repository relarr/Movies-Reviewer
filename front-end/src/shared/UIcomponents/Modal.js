import Backdrop from "./Backdrop";
import { CSSTransition } from 'react-transition-group';
import './Modal.css';

const Modal = props => {
    return (
        <div className='modal-container'>
            {props.show && <Backdrop onClick={props.onCancel} />}
            <CSSTransition
                in={props.show}
                mountOnEnter
                unmountOnExit
                timeout={300}
                classNames='modal' >
                    <div className='modal'>
                        <header className='modal__header'>
                            <h3>{props.header}</h3>
                        </header>
                        <form>
                            <div className='modal__content'>
                                {props.children}
                            </div>
                            <footer className='modal__footer'>
                                {props.footer}
                            </footer>
                        </form>
                    </div>
            </CSSTransition>
        </div>
    );
};

export default Modal;