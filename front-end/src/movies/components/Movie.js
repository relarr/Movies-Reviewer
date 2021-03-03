import React, { useState, useContext } from 'react';

import Container from '../../shared/UIcomponents/Container';
import Cbutton from '../../shared/UIcomponents/Cbutton';
import Modal from '../../shared/UIcomponents/Modal';
import { AuthContext } from '../../shared/context/auth-context';
import { useHttpClient } from '../../shared/hooks/http-hook';

import './Movie.css';
import Stars from '../../shared/UIcomponents/Stars';

const Movie = props => {
    const auth = useContext(AuthContext);

    const [readModal, setReadModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const readModalHandler = () => {
        setReadModal(prev => !prev);
    };

    const deleteModalHandler = () => {
        setShowDeleteModal(prev => !prev);
    };

    const { sendRequest } = useHttpClient();

    const confirmedDeleteHandler = async () => {
        try {
            await sendRequest(process.env.REACT_APP_BACKEND_URL + `/api/movies/${props.id}`,
                'DELETE', 
                null,
                { Authorization: 'Bearer ' + auth.token }
            );
            props.onDelete(props.id);
        } catch (err){}
    };

    return (
        <div className='movie'>
            {readModal && <Modal
                            show={readModal}
                            onCancel={readModalHandler}
                            header={auth.userId === props.creatorId ? 
                                        `Your movie review for ${props.title}` : 
                                        `Movie review for ${props.title}`}
                            footer={<Cbutton onClick={readModalHandler}>CLOSE</Cbutton>} >
                                <div className='movie--review'>{props.review}
                                    <div className='movie--rating'>
                                        <Stars disableRate rate={props.rate} onInput={()=>{}}/>
                                    </div>
                                </div>
                           </Modal>}

            {showDeleteModal && <Modal
                                    show={showDeleteModal}
                                    onCancel={deleteModalHandler}
                                    header={'Are you sure you want to delete this review?'}
                                    footer={<React.Fragment> 
                                                <Cbutton danger onClick={confirmedDeleteHandler}>DELETE</Cbutton> 
                                                <Cbutton onClick={deleteModalHandler}>CANCEL</Cbutton>
                                            </React.Fragment>} >
                
                </Modal>}
            <Container>
                <div>
                    <h3>{props.title}</h3>
                    <h5>{props.director}</h5>
                    <p>{props.year}</p>
                    <img src={props.image} alt={props.image}/>
                </div>
                <div className='movie--buttons'>
                    <Cbutton reversed onClick={readModalHandler}>READ</Cbutton>
                    {auth.userId === props.creatorId && <Cbutton  to={`/movies/${props.id}`}>EDIT</Cbutton>}
                    {auth.userId === props.creatorId && <Cbutton danger onClick={deleteModalHandler} >DELETE</Cbutton>}
                </div>
            </Container>
        </div>
    );
};

export default Movie;