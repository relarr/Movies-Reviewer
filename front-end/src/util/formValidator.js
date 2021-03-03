export const VALIDATE_REQUIRED = () => ({ type: 'REQUIRED'});
export const VALIDATE_MINLENGTH = length => ({ type: 'MINLENGTH', length });
export const VALIDATE_EMAIL = () => ({ type: 'EMAIL' });

export const validateForm = (input, validators) => {
    let validity = true;
    for (const validator of validators){
        if (validator.type === 'REQUIRED'){
            validity = validity && input.trim().length > 0;
        }
        if (validator.type === 'MINLENGTH'){
            validity = validity && input.trim().length >= validator.length;
        }
        if (validator.type === 'EMAIL'){
            validity = validity && /^\S+@\S+\.\S+$/.test(input);
        }
    }
    return validity;
};