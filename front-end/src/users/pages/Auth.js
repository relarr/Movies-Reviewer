import { useState, useContext } from 'react';
import { AuthContext } from '../../shared/context/auth-context';
import useInput from "../../shared/hooks/use-input";
import ImageUpload from '../../shared/UIcomponents/ImageUpload';
import Button from "../../shared/UIcomponents/Button";
import LoadingSpinner from '../../shared/UIcomponents/LoadingSpinner';
import "./Auth.css";

const Auth = () => {
    const auth = useContext(AuthContext);

    const [isSignUp, setIsSignUp] = useState(false);
    const [invalidCredentials, setInvalidCredentials] = useState({ invalid: false, message: '' });
    const [image, setImage] = useState({ value: null, validity: false });
    const [loading, setLoading] = useState(false);

    const {
        value: name,
        isValid: nameIsValid,
        hasError: nameHasError,
        valueChangeHandler: nameChangeHandler,
        inputBlurHandler: nameBlurHandler,
        reset: resetName
    } = useInput(val => val.trim() !== '');

    const {
        value: email,
        setEnteredValue: setEmail,
        isValid: emailIsValid,
        hasError: emailHasError,
        inputBlurHandler: emailBlurHandler,
        reset: resetEmail
    } = useInput(val => val.includes("@"));

    const {
        value: password,
        setEnteredValue: setPassword,
        isValid: passwordIsValid,
        hasError: passwordHasError,
        inputBlurHandler: passwordBlurHandler,
        reset: resetPassword
    } = useInput(val => val.length >= 6);

    let formIsValid = false;
    if (isSignUp){
        if (nameIsValid && emailIsValid && passwordIsValid && image.validity) formIsValid = true;
    }
    else {
        if (emailIsValid && passwordIsValid) formIsValid = true;
    }

    const emailChangeHandler = event => {
        setEmail(event.target.value);
        if (invalidCredentials.invalid) setInvalidCredentials(false);
    };

    const passwordChangeHandler = event => {
        setPassword(event.target.value);
        if (invalidCredentials.invalid) setInvalidCredentials(false); 
    };

    const setImageHandler = (value, validity) => {
        setImage({ value, validity });
    };

    const submitHandler = async event => {
        event.preventDefault();

        if (isSignUp){
            setLoading(true);
            try {
                const formData = new FormData();
                formData.append('name', name);
                formData.append('email', email);
                formData.append('password', password);
                formData.append('image', image.value);

                const res = await fetch(process.env.REACT_APP_BACKEND_URL + '/users/signup',
                {
                    method: 'POST',
                    body: formData
                });
                const resJson = await res.json();

                setLoading(false);
                if (res.status === 201){
                    resetName();
                    resetEmail();
                    resetPassword();
                    auth.loginContext(resJson.userId, resJson.token);
                } else {
                    setInvalidCredentials({ invalid: true, message: resJson.message });
                    return;
                }
            } catch (err){ }
        } else {
            try {
                setLoading(true);
                const res = await fetch(process.env.REACT_APP_BACKEND_URL + '/users/login', 
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                const resJson = await res.json();

                setLoading(false);
                if (res.status === 200){
                    resetEmail();
                    resetPassword();
                    auth.loginContext(resJson.userId, resJson.token);
                } else {
                    setInvalidCredentials({ invalid: true, message: resJson.message });
                    return;
                }
            } catch (err){ }
        }
    };

    return (
        <div className="auth">
            {loading && <LoadingSpinner asOverlay />}
            <div className='auth-container'>
            <form 
                onSubmit={submitHandler}>
                <div className='form'>
                    {isSignUp && <input
                        className={nameHasError ? 'input invalid' : 'input'}
                        type='text'
                        id='name'
                        onChange={nameChangeHandler}
                        onBlur={nameBlurHandler}
                        placeholder='Your name'
                        value={name} />}
                    {isSignUp && nameHasError && <p className='error-text'>Name must not be empty</p>}
                    {isSignUp && <ImageUpload 
                                    id='image'
                                    onInput={setImageHandler} />}
                    <input
                        className={emailHasError ? 'input invalid' : 'input'}
                        type='email'
                        id='email'
                        onChange={emailChangeHandler}
                        onBlur={emailBlurHandler}
                        placeholder='Your email'
                        value={email} />
                    {emailHasError && <p className='error-text'>Invalid email</p>}
                    <input
                        className={passwordHasError ? 'input invalid' : 'input'}
                        type='password'
                        id='password'
                        onChange={passwordChangeHandler}
                        onBlur={passwordBlurHandler}
                        placeholder='Your password'
                        value={password} />
                    {passwordHasError && <p className='error-text'>At least 6 characters</p>}
                    {invalidCredentials.invalid && <p className='error-text'>{invalidCredentials.message}</p>}
                    <div className='buttons'>
                        <Button 
                            type='button'
                            alternate
                            onClick={() => setIsSignUp(prev => !prev)} >GO TO {!isSignUp ? 'SIGN UP' : 'LOGIN'}</Button>
                        <Button 
                            type='submit'
                            disabled={!formIsValid}>SUBMIT</Button>
                    </div>
                </div>
            </form>
            </div>
        </div>
    );
};

export default Auth;