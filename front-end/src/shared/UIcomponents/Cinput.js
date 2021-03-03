import React, { useReducer, useEffect } from 'react';

import { validateForm } from '../../util/formValidator';

import './Cinput.css';

const inputReducer = (state, action) => {
    switch (action.type){
        case 'CHANGE':
            return {
                ...state,
                value: action.val,
                validity: validateForm(action.val, action.validators)
            };
        default:
            return state;
    }
};

const Cinput = props => {
    const [inputState, dispatch] = useReducer(inputReducer, {
        value: props.initialValue || '',
        validity: false
    });

    const { onInput } = props;
    const { value, validity } = inputState;

    useEffect(() => {
        onInput(value, validity);
    }, [onInput, value, validity]);

    const inputChangeHandler = e => {
        dispatch({
            type: 'CHANGE',
            val: e.target.value,
            validators: props.validators
        });
    };

    

    const formType = props.option === 'input' ?
        (<input 
            id={props.name}
            type={props.type}
            placeholder={props.placeholder}
            readOnly={props.uneditable}
            value={props.initialValue}
            onChange={inputChangeHandler}
             />) :
        (<textarea 
            id={props.name}
            placeholder={props.placeholder}
            readOnly={props.uneditable}
            value={inputState.value}
            rows={5}
            onChange={inputChangeHandler}
             />);

    return (
        <div className={`form-control 
                ${!inputState.validity && 'form-control--invalid'}
                ${props.uneditable && 'form-control--uneditable'}`}>
            <label htmlFor={props.id}>{props.label}</label>
            {formType}
        </div>
    );
};

export default Cinput;