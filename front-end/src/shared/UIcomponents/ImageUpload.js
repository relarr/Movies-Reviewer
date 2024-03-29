import { useState, useEffect, useRef } from "react";
import Button from "./Button";
import './ImageUpload.css';

const ImageUpload = props => {
    const imageRef = useRef();
    const [file, setFile] =   useState();
    const [isValid, setIsValid] = useState(false);
    const [previewUrl,setPreviewUrl] = useState();

    useEffect(() => {
        if (!file) return;
        
        const fileReader = new FileReader();
        fileReader.onload = () => {
            setPreviewUrl(fileReader.result);
        };
        fileReader.readAsDataURL(file);
    }, [file]);

    const pickerHandler = event => {
        let pickedFile;
        let fileIsValid = isValid;
        if (event.target.files && event.target.files.length === 1){
            pickedFile = event.target.files[0];
            setFile(pickedFile);
            setIsValid(true);
            fileIsValid = true;
        } else {
            setIsValid(false);
            fileIsValid = false;
        }
        props.onInput(pickedFile, fileIsValid);
    };

    const pickImageHandler = () => {
        imageRef.current.click();
    };

    return (
        <div>
            <input
                id={props.id}
                ref={imageRef}
                style={{ display: 'none' }}
                type='file'
                accept='.jpg,.png,.jpeg'
                onChange={pickerHandler} />
            <div className='image-upload'>
                <div className='image-upload__preview'> 
                    {previewUrl && <img src={previewUrl} alt='Preview' />}
                    {!previewUrl && <p>Please pick an image</p>}
                </div>
                <Button 
                    type='button'
                    onClick={pickImageHandler}>
                    PICK IMAGE
                </Button>
            </div>
            {!isValid && <p>{props.errorText}</p>}
        </div>
    );
};

export default ImageUpload;