import React, { useState, useCallback, useContext, useRef } from 'react';

import Cinput from '../../shared/UIcomponents/Cinput';
import Container from '../../shared/UIcomponents/Container';
import Cbutton from '../../shared/UIcomponents/Cbutton';
import Spinner from '../../shared/UIcomponents/Spinner';
import ErrorModal from '../../shared/UIcomponents/ErrorModal';
import ImageUpload from '../../shared/UIcomponents/ImageUpload';
import { VALIDATE_REQUIRED, VALIDATE_MINLENGTH, VALIDATE_EMAIL } from '../../util/formValidator';
import { AuthContext } from '../../shared/context/auth-context';
import { useHttpClient } from '../../shared/hooks/http-hook';

import './Auth.css';

const Auth = () => {
    const auth = useContext(AuthContext);

    const [isSignup, setIsSignup] = useState(false);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    const active = useRef([]);

    const [name, setName] = useState({ name: '', nameValidity: false });
    const [email, setEmail] = useState({ email: '', emailValidity: false });
    const [password, setPassword] = useState({ password: '', passwordValidity: false});
    const [image, setImage] = useState({ image: null, imageValidity: false }); 

    const setNameHandler = useCallback((value, validity) => {
        setName({ name: value, nameValidity: validity });
    }, []);

    const setEmailHandler = useCallback((value, validity) => {
        setEmail({ email: value, emailValidity: validity });
    }, []);

    const setPasswordHandler = useCallback((value, validity) => {
        setPassword({ password: value, passwordValidity: validity });
    }, []);

    const setImageHandler = useCallback((value, validity) => {
        setImage({ image: value, imageValidity: validity });
    }, []);

    const setAuthTypeHandler = e => {
        e.preventDefault();
        setIsSignup(prev => !prev);
    };

    

    const submitAuthHandler = async e => {
        e.preventDefault();

        if (isSignup){
            try {
                const httpAbort = new AbortController();
                active.current.push(httpAbort);

                const formData = new FormData();
                formData.append('name', name.name);
                formData.append('email', email.email);
                formData.append('password', password.password);
                formData.append('image', image.image);

                const responseData = await sendRequest(process.env.REACT_APP_BACKEND_URL + '/api/users/signup', 
                    'POST',
                    formData
                );

                auth.loginContext(responseData.userId, responseData.token);
            } catch (err){}            
        } else {
            try {
                const responseData = await sendRequest(process.env.REACT_APP_BACKEND_URL + '/api/users/login', 
                    'POST',
                    JSON.stringify({
                        email: email.email,
                        password: password.password
                    }),
                    {
                        'Content-Type': 'application/json'
                    }
                );
                auth.loginContext(responseData.userId, responseData.token);
            } catch (err){}                     
        }       
    };

    return (
        <div className='auth'>
            <ErrorModal error={error} onClear={clearError} />
            <Container avatar>
                {isLoading && <Spinner asOverlay/>}
                <form onSubmit={submitAuthHandler}>
                    {isSignup && <Cinput 
                        id='name'
                        option='input'
                        type='text'
                        label='Enter your name'
                        placeholder='Name'
                        validators={[VALIDATE_REQUIRED()]}
                        onInput={setNameHandler} />}
                    {isSignup && <ImageUpload center id='image' onInput={setImageHandler} />}
                    <Cinput 
                        id='email'
                        option='input'
                        type='text'
                        label='Enter your email'
                        placeholder='Email'
                        validators={[VALIDATE_EMAIL()]}
                        onInput={setEmailHandler} />
                    <Cinput 
                        id='password'
                        option='input'
                        type='password'
                        label='Enter your password'
                        placeholder='Password'
                        validators={[VALIDATE_MINLENGTH(6)]}
                        onInput={setPasswordHandler} />
                    <Cbutton 
                        type='submit' 
                        disabled={isSignup ? 
                            (!name.nameValidity || !email.emailValidity || !password.passwordValidity) || !image.imageValidity :
                            (!email.emailValidity || !password.passwordValidity)}>
                                {!isSignup ? 'LOGIN' : 'SIGNUP'}
                    </Cbutton>
                    <Cbutton 
                        reversed 
                        onClick={setAuthTypeHandler}>
                            SWITCH TO {!isSignup ? 'SIGNUP' : 'LOGIN'}
                    </Cbutton>
                </form>
            </Container>
        </div>
    );
};

export default Auth;